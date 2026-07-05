import React, { useState, useEffect, useRef } from 'react';
import { MapPin, Compass, Navigation2, Info, Eye, Loader, CheckCircle2, ShieldAlert } from 'lucide-react';

interface SpotSurroundingViewProps {
  spotName: string;
  latitude: number;
  longitude: number;
  isDark?: boolean;
}

export default function SpotSurroundingView({
  spotName,
  latitude,
  longitude,
  isDark = false,
}: SpotSurroundingViewProps) {
  const [activeTab, setActiveTab] = useState<'map' | 'street' | 'radar'>('map');
  const [userLocation, setUserLocation] = useState<{ lat: number; lon: number } | null>(null);
  const [geoError, setGeoError] = useState<string | null>(null);
  const [geoLoading, setGeoLoading] = useState<boolean>(false);
  const [bearing, setBearing] = useState<number>(0);
  const [distance, setDistance] = useState<number | null>(null);
  const [eta, setEta] = useState<number | null>(null); // in minutes
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Haversine formula for distance calculation
  const getDistanceKm = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
    const R = 6371; // Earth's radius in km
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLon = ((lon2 - lon1) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  // Bearing calculation
  const getBearingDegrees = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
    const dLon = ((lon2 - lon1) * Math.PI) / 180;
    const lat1Rad = (lat1 * Math.PI) / 180;
    const lat2Rad = (lat2 * Math.PI) / 180;

    const y = Math.sin(dLon) * Math.cos(lat2Rad);
    const x =
      Math.cos(lat1Rad) * Math.sin(lat2Rad) -
      Math.sin(lat1Rad) * Math.cos(lat2Rad) * Math.cos(dLon);

    let brng = Math.atan2(y, x);
    brng = (brng * 180) / Math.PI;
    return (brng + 360) % 360;
  };

  // Handle live location tracking
  useEffect(() => {
    if (activeTab !== 'radar') return;

    if (!navigator.geolocation) {
      setGeoError('브라우저가 위치 정보를 지원하지 않습니다.');
      return;
    }

    setGeoLoading(true);
    setGeoError(null);

    const handleSuccess = (position: GeolocationPosition) => {
      const uLat = position.coords.latitude;
      const uLon = position.coords.longitude;
      setUserLocation({ lat: uLat, lon: uLon });
      
      const dist = getDistanceKm(uLat, uLon, latitude, longitude);
      setDistance(dist);
      setBearing(getBearingDegrees(uLat, uLon, latitude, longitude));
      
      // Estimate travel time (approx 5km/h for walking, 40km/h for car)
      const walkSpeed = 4.8; 
      const drivingSpeed = 40;
      const estimatedWalkTime = (dist / walkSpeed) * 60;
      setEta(Math.round(estimatedWalkTime));
      setGeoLoading(false);
    };

    const handleError = (error: GeolocationPositionError) => {
      console.warn('Geolocation error:', error);
      setGeoError(
        error.code === 1
          ? '위치 권한이 거부되었습니다. (가상 궤적 시뮬레이터로 기동)'
          : '위치 정보를 수신하는 중 오류가 발생했습니다.'
      );
      setGeoLoading(false);

      // Fallback: Simulate a random user in Cheonan city center (e.g. Cheonan Station)
      const centerCheonan = { lat: 36.8065, lon: 127.1492 };
      setUserLocation(centerCheonan);
      const dist = getDistanceKm(centerCheonan.lat, centerCheonan.lon, latitude, longitude);
      setDistance(dist);
      setBearing(getBearingDegrees(centerCheonan.lat, centerCheonan.lon, latitude, longitude));
      setEta(Math.round((dist / 4.8) * 60));
    };

    const watchId = navigator.geolocation.watchPosition(handleSuccess, handleError, {
      enableHighAccuracy: true,
      timeout: 10000,
    });

    return () => navigator.geolocation.clearWatch(watchId);
  }, [activeTab, latitude, longitude]);

  // High-fidelity Radar Sweep Canvas animation
  useEffect(() => {
    if (activeTab !== 'radar') return;
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let sweepAngle = 0;

    const width = canvas.width;
    const height = canvas.height;
    const cx = width / 2;
    const cy = height / 2;
    const maxRadius = Math.min(cx, cy) - 15;

    const draw = () => {
      ctx.clearRect(0, 0, width, height);

      // Background grid
      ctx.fillStyle = isDark ? '#020617' : '#f8fafc';
      ctx.fillRect(0, 0, width, height);

      // Concentric circles
      ctx.strokeStyle = isDark ? 'rgba(34, 211, 238, 0.15)' : 'rgba(234, 88, 12, 0.15)';
      ctx.lineWidth = 1;
      for (let r = maxRadius / 3; r <= maxRadius; r += maxRadius / 3) {
        ctx.beginPath();
        ctx.arc(cx, cy, r, 0, Math.PI * 2);
        ctx.stroke();
      }

      // Crosshairs
      ctx.beginPath();
      ctx.moveTo(cx - maxRadius, cy);
      ctx.lineTo(cx + maxRadius, cy);
      ctx.moveTo(cx, cy - maxRadius);
      ctx.lineTo(cx, cy + maxRadius);
      ctx.stroke();

      // Draw sweep line
      sweepAngle = (sweepAngle + 0.02) % (Math.PI * 2);
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.arc(cx, cy, maxRadius, sweepAngle - 0.25, sweepAngle);
      ctx.lineTo(cx, cy);
      
      const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, maxRadius);
      if (isDark) {
        grad.addColorStop(0, 'rgba(34, 211, 238, 0.35)');
        grad.addColorStop(1, 'rgba(34, 211, 238, 0.0)');
      } else {
        grad.addColorStop(0, 'rgba(234, 88, 12, 0.35)');
        grad.addColorStop(1, 'rgba(234, 88, 12, 0.0)');
      }
      ctx.fillStyle = grad;
      ctx.fill();

      // Draw the target waypoint (spot direction based on bearing)
      // Convert bearing (0 deg top, clockwise) to standard canvas coordinates (0 deg right, counter-clockwise)
      const canvasAngle = ((bearing - 90) * Math.PI) / 180;
      
      // Keep target indicator inside the radar grid proportionally
      const targetRadius = maxRadius * 0.75;
      const tx = cx + Math.cos(canvasAngle) * targetRadius;
      const ty = cy + Math.sin(canvasAngle) * targetRadius;

      // Draw target indicator glow
      ctx.beginPath();
      ctx.arc(tx, ty, 10, 0, Math.PI * 2);
      ctx.fillStyle = isDark ? 'rgba(34, 211, 238, 0.25)' : 'rgba(234, 88, 12, 0.25)';
      ctx.fill();

      // Pulsing target dot
      const pulseRadius = 5 + Math.abs(Math.sin(Date.now() / 200)) * 3;
      ctx.beginPath();
      ctx.arc(tx, ty, pulseRadius, 0, Math.PI * 2);
      ctx.strokeStyle = isDark ? 'rgb(34, 211, 238)' : 'rgb(234, 88, 12)';
      ctx.lineWidth = 1.5;
      ctx.stroke();

      ctx.beginPath();
      ctx.arc(tx, ty, 3, 0, Math.PI * 2);
      ctx.fillStyle = isDark ? 'rgb(34, 211, 238)' : 'rgb(234, 88, 12)';
      ctx.fill();

      // Center point (Self)
      ctx.beginPath();
      ctx.arc(cx, cy, 5, 0, Math.PI * 2);
      ctx.fillStyle = isDark ? '#10b981' : '#10b981';
      ctx.fill();

      // Self ping pulses
      ctx.beginPath();
      ctx.arc(cx, cy, 10, 0, Math.PI * 2);
      ctx.strokeStyle = 'rgba(16, 185, 129, 0.35)';
      ctx.stroke();

      // Cardinal labels (N, S, E, W)
      ctx.fillStyle = isDark ? '#94a3b8' : '#64748b';
      ctx.font = 'bold 9px monospace';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('N', cx, cy - maxRadius - 6);
      ctx.fillText('S', cx, cy + maxRadius + 6);
      ctx.fillText('E', cx + maxRadius + 6, cy);
      ctx.fillText('W', cx - maxRadius - 6, cy);

      animationFrameId = requestAnimationFrame(draw);
    };

    draw();

    return () => cancelAnimationFrame(animationFrameId);
  }, [activeTab, bearing, isDark]);

  // Embedding paths
  // Type: m = standard roadmap, k = satellite imagery, h = hybrid, p = terrain
  const standardMapEmbedUrl = `https://maps.google.com/maps?q=${latitude},${longitude}&t=m&z=17&ie=UTF8&iwloc=&output=embed`;
  const streetViewEmbedUrl = `https://maps.google.com/maps?q=${latitude},${longitude}&layer=c&cbll=${latitude},${longitude}&cbp=11,0,0,0,0&output=svembed`;

  return (
    <div className={`mt-3.5 rounded-2xl border p-4 ${
      isDark ? 'bg-slate-900/40 border-slate-800/80' : 'bg-slate-50/75 border-slate-150'
    }`}>
      {/* Visual Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-3 mb-3 border-b border-slate-200/50 dark:border-slate-800/60">
        <div className="flex items-center gap-2">
          <Eye className={`w-4 h-4 ${isDark ? 'text-cyan-400' : 'text-amber-800'}`} />
          <span className={`text-[11.5px] font-black ${isDark ? 'text-white' : 'text-slate-800'}`}>
            실시간 주변 관찰 & 로케이션 뷰 🗺️
          </span>
        </div>
        
        {/* Compact Toggle buttons */}
        <div className="flex gap-1">
          {[
            { id: 'map', label: '주변 로드뷰' },
            { id: 'street', label: '거리 스트리트뷰' },
            { id: 'radar', label: '로케이션 레이더' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`text-[9.5px] font-black px-2.5 py-1 rounded-md transition-all cursor-pointer ${
                activeTab === tab.id
                  ? (isDark 
                      ? 'bg-cyan-400 text-slate-950 shadow-sm shadow-cyan-400/10' 
                      : 'bg-slate-900 text-white shadow-inner')
                  : (isDark 
                      ? 'bg-slate-950 text-slate-450 hover:text-slate-200' 
                      : 'bg-white hover:bg-slate-100 border border-slate-200 text-slate-650')
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Screen Frame Container */}
      <div className="relative rounded-xl overflow-hidden aspect-[16/9] w-full min-h-[160px] max-h-[220px] shadow-sm bg-slate-900">
        
        {activeTab === 'map' && (
          <iframe
            src={standardMapEmbedUrl}
            width="100%"
            height="100%"
            style={{ border: 0 }}
            allowFullScreen={false}
            loading="lazy"
            referrerPolicy="no-referrer"
            title={`${spotName} 지도 뷰`}
          />
        )}

        {activeTab === 'street' && (
          <iframe
            src={streetViewEmbedUrl}
            width="100%"
            height="100%"
            style={{ border: 0 }}
            allowFullScreen={false}
            loading="lazy"
            referrerPolicy="no-referrer"
            title={`${spotName} 스트리트뷰`}
          />
        )}

        {activeTab === 'radar' && (
          <div className="absolute inset-0 flex flex-col md:flex-row items-center md:justify-around p-4 gap-4 bg-slate-950">
            {/* Visual HTML Canvas Radar */}
            <div className="relative aspect-square h-full max-h-[140px]">
              <canvas
                ref={canvasRef}
                width={160}
                height={160}
                className="w-full h-full rounded-full"
              />
            </div>

            {/* Micro HUD Dashboard */}
            <div className="flex-1 flex flex-col justify-center text-left space-y-1.5 font-mono text-[10px] text-slate-350 select-none w-full border-t md:border-t-0 md:border-l border-slate-800/80 pt-2.5 md:pt-0 md:pl-4">
              <div className="flex justify-between items-center">
                <span className="text-slate-500 uppercase tracking-widest text-[9px] font-black">목표 탐방처</span>
                <span className="text-white font-extrabold text-right truncate max-w-[130px]">{spotName}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-500 uppercase tracking-widest text-[9px] font-black">현재 거리 (Distance)</span>
                {geoLoading ? (
                  <span className="text-cyan-400 flex items-center gap-1">
                    <Loader className="w-3.5 h-3.5 animate-spin" /> 수신중
                  </span>
                ) : distance !== null ? (
                  <span className="text-green-400 font-extrabold">
                    {distance < 1 ? `${Math.round(distance * 1000)}m` : `${distance.toFixed(2)}km`}
                  </span>
                ) : (
                  <span className="text-slate-500">데이터 없음</span>
                )}
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-500 uppercase tracking-widest text-[9px] font-black">도보 시간 (ETA)</span>
                {distance !== null ? (
                  <span className="text-cyan-300 font-extrabold">
                    {eta && eta < 60 ? `도보 약 ${eta}분` : `도보 약 ${(eta! / 60).toFixed(1)}시간`}
                  </span>
                ) : (
                  <span className="text-slate-500">--:--</span>
                )}
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-500 uppercase tracking-widest text-[9px] font-black">침로 방위각 (Bearing)</span>
                <span className="text-sky-300 font-extrabold flex items-center gap-1">
                  <Compass className="w-3 h-3 text-cyan-400" />
                  {bearing.toFixed(1)}°
                </span>
              </div>

              {/* Geo warning / alert message */}
              {geoError ? (
                <div className="mt-1 text-[8px] text-amber-500 leading-tight flex items-start gap-1 font-sans">
                  <ShieldAlert className="w-3 h-3 shrink-0 text-amber-500 mt-0.5" />
                  <span>{geoError}</span>
                </div>
              ) : (
                <div className="mt-1 text-[8px] text-green-400/80 leading-tight flex items-start gap-1 font-sans">
                  <CheckCircle2 className="w-3 h-3 shrink-0 text-green-500 mt-0.5" />
                  <span>브라우저 GPS 위성을 기반으로 실시간 상대 좌표가 갱신됩니다.</span>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Floating Info Footnote */}
      <p className={`text-[9.5px] mt-2 font-medium leading-relaxed flex items-start gap-1.5 ${
        isDark ? 'text-slate-400' : 'text-slate-500'
      }`}>
        <Info className="w-3.5 h-3.5 shrink-0 text-slate-400 mt-0.5" />
        <span>
          로드뷰 및 스트리트뷰는 구글 스트리트 허브에 수록된 현장 데이터를 활용합니다. 위성 침로 궤적 레이더는 사용자 위치 정보 권한 동의 시 작동하며, 타운 중심부 기준 방위각을 자동 연산합니다.
        </span>
      </p>
    </div>
  );
}
