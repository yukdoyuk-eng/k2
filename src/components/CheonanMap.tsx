import React, { useState, useEffect, useRef, useMemo } from 'react';
import { District } from '../types';
import { Navigation, CheckCircle, Compass, HelpCircle, Plus, Minus, RefreshCw } from 'lucide-react';

interface RouteSpot {
  stepIndex: number;
  spotName: string;
  latitude: number;
  longitude: number;
  id: number;
  guide?: string;
}

interface CheonanMapProps {
  districts: District[];
  selectedDistrictId: number | null;
  onSelectDistrict: (id: number | null) => void;
  activeGu: 'DONGNAM' | 'SEOBUK' | 'ALL';
  spots?: any[];
  routeSpots?: RouteSpot[];
  isDark?: boolean;
  selectedFestivalId?: string | null;
}

// Festival Geo-Proximity Datasets
const FESTIVAL_LOCATIONS_MAP: Record<string, { lat: number; lon: number; label: string }[]> = {
  bongsah: [
    { lat: 36.8045, lon: 127.3015, label: '유관순기념관 광장' },
    { lat: 36.8015, lon: 127.2999, label: '아우내장터 일대' }
  ],
  cherry_blossom: [
    { lat: 36.8200, lon: 127.2400, label: '북면 위례성로 벚꽃길' }
  ],
  bbang_spring: [
    { lat: 36.8151, lon: 127.1138, label: '천안시청 버들광장' },
    { lat: 36.7850, lon: 127.1400, label: '뚜쥬루 빵돌가마마을' }
  ],
  dance_festival: [
    { lat: 36.8228, lon: 127.1215, label: '천안종합운동장' },
    { lat: 36.8115, lon: 127.1495, label: '천안역 원도심 아지트' }
  ],
  bbang_pears: [
    { lat: 36.8242, lon: 127.1195, label: '종합운동장 오륜문 광장' },
    { lat: 36.9150, lon: 127.1280, label: '성환읍 배밭 단지' }
  ],
  arario_sculpture: [
    { lat: 36.8193, lon: 127.1561, label: '아라리오 조각광장' },
    { lat: 36.8145, lon: 127.1852, label: '리각미술관' }
  ],
  univ_fest: [
    { lat: 36.8182, lon: 127.1120, label: '천안시민체육공원' }
  ],
  grape_fest: [
    { lat: 36.9050, lon: 127.2250, label: '서북구 입장면 일대' }
  ],
  k_culture: [
    { lat: 36.7838, lon: 127.2231, label: '독립기념관 야외 행사장' }
  ],
  maple_healing: [
    { lat: 36.7852, lon: 127.2210, label: '독립기념관 단풍나무숲길' }
  ]
};

const FESTIVAL_EMOJIS: Record<string, string> = {
  bongsah: '🔥',
  cherry_blossom: '🌸',
  bbang_spring: '🥐',
  dance_festival: '🕺',
  bbang_pears: '🌾',
  arario_sculpture: '🎨',
  univ_fest: '🍺',
  grape_fest: '🍇',
  k_culture: '🇰🇷',
  maple_healing: '🍁'
};

const FESTIVAL_TITLES: Record<string, string> = {
  bongsah: '3·1운동 기념 아우내 봉화제',
  cherry_blossom: '천안 위례 벚꽃축제',
  bbang_spring: '베리베리 빵빵데이 & 빵지순례',
  dance_festival: '천안흥타령춤축제',
  bbang_pears: '가을 빵빵데이 & 성환배축제',
  arario_sculpture: '아라리오 조각광장 & 리각미술관 공공전',
  univ_fest: '천안 유니브시티 페스티벌',
  grape_fest: '입장거봉포도축제',
  k_culture: '천안 K-컬처 박람회',
  maple_healing: '단풍나무숲길 힐링축제'
};

const FESTIVAL_PARTNERS: Record<string, string[]> = {
  bongsah: ['청화집', '박순자 아우내순대', '충남집', '아우내한방순대', '천안옛날호두과자'],
  cherry_blossom: ['카페 교토리', '카페목천', '풍세커피'],
  bbang_spring: ['뚜쥬루 빵돌가마마을', '뚜쥬루 성정본점', '진스베이커리', '하레브라도', '히트커피'],
  dance_festival: ['킨이로텐', '카와이레시피', '멘야타마시', '그래비티', '피양옥', '광명만두', '장군꼬들살', '교동면옥'],
  bbang_pears: ['이봉원의 봉짬뽕', '정원식당', '학교종이땡땡땡', '이고집 만두'],
  arario_sculpture: ['벤베커', '랜드마크195', '석산장', '정통옥수사', '나정식당', '평양냉면', '일상서재'],
  univ_fest: ['엄가네본가시골집', '킨이로텐', '리무소 커피', '광명만두', '카페더그린 성성점'],
  grape_fest: ['배나무숲 카페', '진주회관 본관', '성환순대 두번째집'],
  k_culture: ['선유원', '소노벨 천안', '아름다운정원 화수목'],
  maple_healing: ['카페목천', '청화집', '옛날호두과자 병천점', '선유원']
};

function getDistance(lat1: number, lon1: number, lat2: number, lon2: number) {
  const R = 6371; // Earth radius in km
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
}

const DISTRICT_COORDS: Record<number, { lat: number; lon: number; name: string; gu: 'DONGNAM' | 'SEOBUK' }> = {
  1: { lat: 36.7831, lon: 127.2230, name: '목천읍', gu: 'DONGNAM' },
  2: { lat: 36.8015, lon: 127.2999, name: '병천면', gu: 'DONGNAM' },
  3: { lat: 36.6853, lon: 127.1120, name: '풍세면', gu: 'DONGNAM' },
  4: { lat: 36.8200, lon: 127.2400, name: '북면', gu: 'DONGNAM' },
  5: { lat: 36.7700, lon: 127.2700, name: '수신면', gu: 'DONGNAM' },
  6: { lat: 36.8150, lon: 127.1650, name: '신안동', gu: 'DONGNAM' },
  7: { lat: 36.7850, lon: 127.1400, name: '청룡동', gu: 'DONGNAM' },
  8: { lat: 36.8156, lon: 127.1062, name: '불당동', gu: 'SEOBUK' },
  9: { lat: 36.8431, lon: 127.1420, name: '부성동', gu: 'SEOBUK' },
  10: { lat: 36.8600, lon: 127.1900, name: '성거읍', gu: 'SEOBUK' },
  11: { lat: 36.9150, lon: 127.1280, name: '성환읍', gu: 'SEOBUK' },
  12: { lat: 36.8250, lon: 127.1350, name: '성정동', gu: 'SEOBUK' },
  13: { lat: 36.8750, lon: 127.1500, name: '직산읍', gu: 'SEOBUK' },
  14: { lat: 36.9050, lon: 127.2250, name: '입장면', gu: 'SEOBUK' },
};

// Coordinate mapping boundaries
const minLon = 127.06;
const maxLon = 127.33;
const minLat = 36.64;
const maxLat = 36.94;

const getXY = (lat: number, lon: number, width: number = 380, height: number = 290) => {
  const paddingX = 35;
  const paddingY = 30;

  const x = paddingX + ((lon - minLon) / (maxLon - minLon)) * (width - 2 * paddingX);
  const y = paddingY + (1 - (lat - minLat) / (maxLat - minLat)) * (height - 2 * paddingY);

  return { x, y };
};

export default function CheonanMap({
  districts,
  selectedDistrictId,
  onSelectDistrict,
  activeGu,
  spots = [],
  routeSpots = [],
  isDark = false,
  selectedFestivalId = null
}: CheonanMapProps) {
  const [hoveredRouteSpot, setHoveredRouteSpot] = useState<RouteSpot | null>(null);
  const [hoveredDistrictId, setHoveredDistrictId] = useState<number | null>(null);
  const [hoveredFestivalLoc, setHoveredFestivalLoc] = useState<{
    lat: number;
    lon: number;
    label: string;
    festivalId: string;
    festivalTitle: string;
  } | null>(null);

  // Zoom & Drag-to-Pan States
  const [zoom, setZoom] = useState<number>(1.0);
  const [center, setCenter] = useState<{ x: number; y: number }>({ x: 190, y: 145 });
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [dragStart, setDragStart] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

  // Hover states for spots & clusters
  const [hoveredSpot, setHoveredSpot] = useState<any | null>(null);
  const [hoveredCluster, setHoveredCluster] = useState<any | null>(null);

  // Math references for zoom center anchor
  const cx = 190;
  const cy = 145;

  // Clamps map center coordinates depending on zoom level to prevent dragging off-screen
  const clampCenter = (x: number, y: number, z: number) => {
    if (z <= 1.0) return { x: 190, y: 145 };
    const paddingX = 190 / z;
    const paddingY = 145 / z;
    const minX = paddingX;
    const maxX = 380 - paddingX;
    const minY = paddingY;
    const maxY = 290 - paddingY;
    return {
      x: Math.max(minX, Math.min(maxX, x)),
      y: Math.max(minY, Math.min(maxY, y))
    };
  };

  const handlePointerDown = (e: React.PointerEvent<SVGSVGElement>) => {
    if (zoom <= 1.0) return;
    setIsDragging(true);
    setDragStart({ x: e.clientX, y: e.clientY });
  };

  const handlePointerMove = (e: React.PointerEvent<SVGSVGElement>) => {
    if (!isDragging || zoom <= 1.0) return;
    const dx = e.clientX - dragStart.x;
    const dy = e.clientY - dragStart.y;
    
    const svgEl = e.currentTarget;
    const rect = svgEl.getBoundingClientRect();
    const scaleX = 380 / rect.width;
    const scaleY = 290 / rect.height;

    const rawNewX = center.x - (dx * scaleX) / zoom;
    const rawNewY = center.y - (dy * scaleY) / zoom;
    
    const clamped = clampCenter(rawNewX, rawNewY, zoom);
    setCenter(clamped);
    setDragStart({ x: e.clientX, y: e.clientY });
  };

  const handlePointerUp = () => {
    setIsDragging(false);
  };

  // Color helper for category styles
  const getColor = (cat: string) => {
    if (cat === 'Taste') return isDark ? '#fbbf24' : '#d97706';
    if (cat === 'Nature') return isDark ? '#34d399' : '#059669';
    return isDark ? '#c084fc' : '#4f46e5';
  };

  // Cluster spots dynamically based on current zoom level
  const clusteredSpots = useMemo(() => {
    const clusters: {
      id: string;
      centroid: { x: number; y: number; lat: number; lon: number };
      spots: any[];
    }[] = [];
    
    // At zoom = 1.0, threshold is 28px on SVG coordinate space.
    // As zoom increases, threshold reduces so clusters split up.
    const baseThreshold = 28;
    const svgThreshold = baseThreshold / zoom;

    (spots || []).forEach((spot) => {
      if (!spot.latitude || !spot.longitude) return;
      const { x, y } = getXY(spot.latitude, spot.longitude);
      
      let foundCluster = false;
      for (const cluster of clusters) {
        const dx = cluster.centroid.x - x;
        const dy = cluster.centroid.y - y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        
        if (dist < svgThreshold) {
          cluster.spots.push(spot);
          const count = cluster.spots.length;
          cluster.centroid.x = (cluster.centroid.x * (count - 1) + x) / count;
          cluster.centroid.y = (cluster.centroid.y * (count - 1) + y) / count;
          cluster.centroid.lat = (cluster.centroid.lat * (count - 1) + spot.latitude) / count;
          cluster.centroid.lon = (cluster.centroid.lon * (count - 1) + spot.longitude) / count;
          foundCluster = true;
          break;
        }
      }

      if (!foundCluster) {
        clusters.push({
          id: `cluster-${spot.id}`,
          centroid: { x, y, lat: spot.latitude, lon: spot.longitude },
          spots: [spot]
        });
      }
    });

    return clusters;
  }, [spots, zoom]);

  // Scroll tracking state for drawing travel routes in real-time
  const [scrollProgress, setScrollProgress] = useState<number>(0);
  const pathRef = useRef<SVGPathElement | null>(null);
  const [pathLength, setPathLength] = useState<number>(1000);

  // Calculate if a specific waypoint index has been reached by the current scroll progress
  const isWaypointReached = (idx: number) => {
    if (routeSpots.length <= 1) return true;
    const targetProgress = idx / (routeSpots.length - 1);
    return scrollProgress >= targetProgress - 0.05; // 5% buffer for snappy responsive activation
  };

  // Scroll event observer to map window scrolling down #planner coordinates to 0.0 ~ 1.0 progress
  useEffect(() => {
    const handleScroll = () => {
      const plannerEl = document.getElementById('planner');
      if (!plannerEl) {
        setScrollProgress(0.5); // Fallback visible line range if element cannot be resolved
        return;
      }

      const rect = plannerEl.getBoundingClientRect();
      const viewportHeight = window.innerHeight;

      // Start drawing when user scrolls to bottom 90% of screen height
      // Complete drawing when user scrolls past top 15% of screen height
      const triggerStart = viewportHeight * 0.90;
      const triggerEnd = viewportHeight * 0.15;
      
      const totalRange = rect.height + (triggerStart - triggerEnd);
      const scrolledRange = triggerStart - rect.top;
      
      const rawProgress = scrolledRange / totalRange;
      const progress = Math.max(0, Math.min(1, rawProgress));
      
      setScrollProgress(progress);
    };

    // Initialize position check
    handleScroll();

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleScroll);
    
    // Quick polling fallback check to resolve layout offsets on slower slow-loading assets
    const intervalId = setInterval(handleScroll, 1000);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
      clearInterval(intervalId);
    };
  }, [routeSpots]);

  // Categorize districts
  const dongnamDistricts = districts.filter(d => d.gu === 'DONGNAM' && (activeGu === 'ALL' || activeGu === 'DONGNAM'));
  const seobukDistricts = districts.filter(d => d.gu === 'SEOBUK' && (activeGu === 'ALL' || activeGu === 'SEOBUK'));

  const getDistrictAccent = (districtName: string) => {
    if (districtName.includes('목천읍')) return '독립기념관 단풍길 • 카페목천 콩크림눌림떡';
    if (districtName.includes('병천면')) return '유관순 사적지 • 한방 아우내 순대거리';
    if (districtName.includes('풍세면')) return '태학산 치유의숲 • 풍세커피 한옥고택 베이커리';
    if (districtName.includes('북면')) return '알프스 벚꽃 드라이브 • 일본가옥 카페 교토리';
    if (districtName.includes('수신면')) return '홍대용과학관 은하수 망원경 • 수신 멜론농가 맛집';
    if (districtName.includes('신안동')) return '호수송 버스커 꽃송이가 단대호수 • 아라리오 조각광장 • 책방 허송세월';
    if (districtName.includes('청룡동')) return '동화 속 오두막 뚜쥬루 빵돌가마마을 테마파크';
    if (districtName.includes('불당동')) return '지브리 소품 카와이레시피 고양이 스프카레 • 심야 드립커피 그래비티';
    if (districtName.includes('부성동')) return '야경 순환데크 성성호수공원 수변 브런치 카페거리';
    if (districtName.includes('성거읍')) return '금계국 천흥저수지 • 데이지정원 핑크뮬리 카페 이숲';
    if (districtName.includes('성환읍')) return '국보 갈기비 • 배밭 하얀 꽃밭 조망 과수원 카페 하레브라도';
    if (districtName.includes('성정동')) return '대디디천안축구센터 • 뚜쥬루 성정본점 과자점';
    if (districtName.includes('직산읍')) return '직산향교 명륜당 • 직산현관아 벽화마을 • 배나무숲 과수원 뷰';
    if (districtName.includes('입장면')) return '거봉포도 수확체험 정겨운 농가 풍경';
    return '지역 대표 공간';
  };

  // Build both straight and curved route path coordinate strings
  let routePathD = '';
  let curvedRoutePathD = '';
  if (routeSpots.length > 1) {
    routeSpots.forEach((spot, idx) => {
      const { x, y } = getXY(spot.latitude, spot.longitude);
      if (idx === 0) {
        routePathD = `M ${x.toFixed(1)} ${y.toFixed(1)}`;
        curvedRoutePathD = `M ${x.toFixed(1)} ${y.toFixed(1)}`;
      } else {
        routePathD += ` L ${x.toFixed(1)} ${y.toFixed(1)}`;
        
        // Let's create beautiful soft curved bezier segments to simulate smooth travel!
        const prevSpot = routeSpots[idx - 1];
        const prevXY = getXY(prevSpot.latitude, prevSpot.longitude);
        
        const dx = x - prevXY.x;
        const dy = y - prevXY.y;
        
        // Control points offset slightly perpendicular to create a sweeping aesthetic arc
        const cx = prevXY.x + dx * 0.5 - dy * 0.15;
        const cy = prevXY.y + dy * 0.5 + dx * 0.15;
        
        curvedRoutePathD += ` Q ${cx.toFixed(1)} ${cy.toFixed(1)}, ${x.toFixed(1)} ${y.toFixed(1)}`;
      }
    });
  }

  // Measure dynamic path length to align stroke dash arrays exactly with physical pixels
  useEffect(() => {
    if (pathRef.current) {
      try {
        const length = pathRef.current.getTotalLength();
        if (length > 0) {
          setPathLength(length);
        }
      } catch (err) {
        console.warn('Unable to retrieve SVG path length dynamically:', err);
      }
    }
  }, [curvedRoutePathD]);

  return (
    <div className={`relative transition-all duration-500 rounded-3xl p-6 border shadow-xl overflow-hidden ${
      isDark ? 'bg-slate-900 border-slate-800 text-slate-100' : 'bg-white border-slate-100 text-slate-900'
    }`}>
      {/* Highly immersive route and pathway sequential animations */}
      <style>{`
        @keyframes draw-path {
          from {
            stroke-dashoffset: 1000;
          }
          to {
            stroke-dashoffset: 0;
          }
        }
        @keyframes route-glow {
          0% { stroke-dashoffset: 0; }
          100% { stroke-dashoffset: -32; }
        }
        @keyframes subtle-bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-3px); }
        }
        .animate-draw-route {
          stroke-dasharray: 1000;
          stroke-dashoffset: 1000;
          animation: draw-path 2.2s cubic-bezier(0.25, 1, 0.5, 1) forwards;
        }
        .animate-route-pulse-flow {
          stroke-dasharray: 10, 15;
          animation: route-glow 1.5s linear infinite;
        }
        .animate-route-backglow {
          stroke-dasharray: 30, 30;
          animation: route-glow 6s linear infinite;
        }
      `}</style>

      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-5 border-b pb-4 border-slate-100/50 dark:border-slate-800/80">
        <div>
          <h4 className="text-base font-black tracking-tight flex items-center gap-1.5 font-sans">
            <Navigation className="w-5 h-5 text-amber-700 dark:text-cyan-400 animate-bounce" />
            천안시 실시간 탐방 노선도 & 큐레이션
          </h4>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 font-sans font-medium">
            코스 도우미에서 선택하신 여정의 동선 경로선이 지도 상에 기가막히게 그려집니다.
          </p>
        </div>
        <div className="shrink-0">
          {selectedDistrictId && (
            <button
              onClick={() => onSelectDistrict(null)}
              className={`text-xs font-bold px-3 py-1.5 rounded-full transition-all border cursor-pointer border-slate-200/50 ${
                isDark ? 'bg-cyan-950/20 text-cyan-300 border-cyan-800' : 'bg-slate-900 text-white hover:bg-slate-800'
              } font-sans`}
            >
              전체 구역 탐색 ×
            </button>
          )}
        </div>
      </div>

      {/* SVG Interactive Geo Visualizer Canvas */}
      <div className={`relative mb-6 rounded-2xl border p-3 flex flex-col items-center justify-center overflow-hidden ${
        isDark ? 'bg-slate-950/60 border-slate-850' : 'bg-slate-50/50 border-slate-100'
      }`}>
        <div className="absolute top-3.5 left-4 flex items-center gap-2 z-10">
          <span className={`w-2 h-2 rounded-full bg-emerald-500 animate-ping`} />
          <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
            {routeSpots.length > 0 ? '순차적 여정 경로선 (Active Itinerary Routing)' : '행정 구역 레이어'}
          </span>
        </div>

        {hoveredFestivalLoc && (
          <div className={`absolute top-2 left-1/2 transform -translate-x-1/2 rounded-xl px-3.5 py-2 shadow-2xl text-[10.5px] z-30 pointer-events-none whitespace-normal max-w-[280px] border leading-normal transition-all duration-300 ${
            isDark ? 'bg-slate-900 border-pink-800 text-white shadow-pink-900/10' : 'bg-slate-900 text-white border-slate-850 shadow-slate-900/45'
          }`}>
            <div className="text-pink-400 dark:text-pink-300 font-black mb-0.5 flex items-center gap-1.5">
              <span>🎉 천안 축제 거점</span>
              <span className={`px-1.5 py-0.2 text-[8px] rounded uppercase ${isDark ? 'bg-pink-950 text-pink-400 font-extrabold' : 'bg-pink-900 text-pink-100'}`}>축제</span>
            </div>
            <div className="font-extrabold text-xs text-white mb-1">{hoveredFestivalLoc.festivalTitle}</div>
            <div className={`text-[10px] ${isDark ? 'text-slate-300' : 'text-slate-200'} font-medium`}>{hoveredFestivalLoc.label} 일대의 축제 관련 지정 명소입니다.</div>
          </div>
        )}

        {hoveredRouteSpot && (
          <div className={`absolute top-2 left-1/2 transform -translate-x-1/2 rounded-xl px-3.5 py-2 shadow-2xl text-[10.5px] z-30 pointer-events-none whitespace-normal max-w-[280px] border leading-normal transition-all duration-300 ${
            isDark ? 'bg-slate-900 border-cyan-850 text-white shadow-cyan-950/10' : 'bg-slate-900 text-white border-slate-850 shadow-slate-900/40'
          }`}>
            <div className="text-amber-400 dark:text-cyan-400 font-black mb-0.5 flex items-center gap-1.5">
              <span>📍 {hoveredRouteSpot.stepIndex}단계 여정선 지표</span>
              <span className={`px-1.5 py-0.2 text-[8px] rounded uppercase ${isDark ? 'bg-cyan-950 text-cyan-400 font-extrabold' : 'bg-amber-900 text-amber-100'}`}>여정</span>
            </div>
            <div className="font-extrabold text-xs text-white mb-1.5">{hoveredRouteSpot.spotName}</div>
            <div className={`text-[10px] ${isDark ? 'text-slate-300' : 'text-slate-200'} font-medium`}>{hoveredRouteSpot.guide}</div>
          </div>
        )}

        {hoveredSpot && (
          <div className={`absolute top-2 left-1/2 transform -translate-x-1/2 rounded-xl px-3.5 py-2 shadow-2xl text-[10.5px] z-30 pointer-events-none whitespace-normal max-w-[280px] border leading-normal transition-all duration-300 ${
            isDark ? 'bg-slate-900 border-cyan-850 text-white shadow-cyan-950/10' : 'bg-slate-900 text-white border-slate-850 shadow-slate-900/40'
          }`}>
            <div className="text-amber-400 dark:text-cyan-400 font-black mb-0.5 flex items-center gap-1.5">
              <span>📍 {hoveredSpot.category === 'Taste' ? '식도락·F&B' : hoveredSpot.category === 'Nature' ? '자연·공원' : '역사·유산'}</span>
              <span className={`px-1.5 py-0.2 text-[8px] rounded uppercase ${isDark ? 'bg-cyan-950 text-cyan-400 font-extrabold' : 'bg-amber-900 text-amber-100'}`}>★ {hoveredSpot.ratingRaw}</span>
            </div>
            <div className="font-extrabold text-xs text-white mb-1">{hoveredSpot.spotName}</div>
            <div className={`text-[10px] ${isDark ? 'text-slate-300' : 'text-slate-200'} font-medium`}>{hoveredSpot.curatorDescription}</div>
          </div>
        )}

        {hoveredCluster && (
          <div className={`absolute top-2 left-1/2 transform -translate-x-1/2 rounded-xl px-3.5 py-2 shadow-2xl text-[10.5px] z-30 pointer-events-none whitespace-normal max-w-[280px] border leading-normal transition-all duration-300 ${
            isDark ? 'bg-slate-900 border-indigo-800 text-white shadow-indigo-950/10' : 'bg-slate-900 text-white border-slate-850 shadow-slate-900/40'
          }`}>
            <div className="text-indigo-400 dark:text-purple-300 font-black mb-1 flex items-center gap-1.5">
              <span>🔍 {hoveredCluster.spots.length}개 명소 군집</span>
              <span className="px-1.5 py-0.2 text-[8px] rounded bg-indigo-950 text-indigo-300 font-extrabold uppercase">군집</span>
            </div>
            <div className="space-y-1 text-[10px] mb-1.5 max-h-[80px] overflow-y-auto pr-1">
              {hoveredCluster.spots.slice(0, 3).map((s: any, sIdx: number) => (
                <div key={s.id} className="text-white font-bold flex items-center gap-1">
                  <span className="text-indigo-400">•</span> {s.spotName} <span className="text-slate-450 text-[8.5px]">({s.category === 'Taste' ? '식도락' : s.category === 'Nature' ? '자연' : '역사'})</span>
                </div>
              ))}
              {hoveredCluster.spots.length > 3 && (
                <div className="text-slate-400 font-medium text-[9px] pl-2">외 {hoveredCluster.spots.length - 3}곳 더 보기</div>
              )}
            </div>
            <div className="text-[9px] text-slate-450 dark:text-slate-400 border-t border-slate-800/80 pt-1 flex items-center gap-1">
              <Compass className="w-2.5 h-2.5 text-indigo-400 animate-spin" style={{ animationDuration: '4s' }} />
              클릭하면 정밀하게 확대하여 명소를 분석합니다.
            </div>
          </div>
        )}

        {routeSpots.length === 0 && (
          <div className="absolute inset-0 bg-transparent flex flex-col items-center justify-center p-6 text-center select-none pointer-events-none z-10">
            <div className={`p-3.5 rounded-full mb-2 bg-white/20 dark:bg-slate-900/60 backdrop-blur-md shadow-inner border border-white/25 dark:border-slate-800`}>
              <Compass className={`w-6 h-6 text-slate-400 dark:text-cyan-500 animate-spin`} style={{ animationDuration: '8s' }} />
            </div>
            <h5 className={`text-xs font-black tracking-tight mb-2 ${isDark ? 'text-slate-300' : 'text-slate-800'}`}>비활성 경로선 상태</h5>
            <p className={`text-[10px] leading-relaxed max-w-[260px] font-medium ${isDark ? 'text-slate-450' : 'text-slate-450'}`}>
              하단의 <strong>코스 도우미</strong> 탭에서 <strong>원하는 일정 테마</strong>를 선택하시면 가시적인 경로선이 지도 상에 활성화됩니다.
            </p>
          </div>
        )}

        {/* SVG Interactive Map Geometry Rendering */}
        <svg 
          viewBox="0 0 380 290" 
          className="w-full h-auto max-h-[300px] select-none touch-none cursor-grab active:cursor-grabbing"
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerLeave={handlePointerUp}
        >
          {/* Subtle Grid dots */}
          <defs>
            <pattern id="dotGrid" width="20" height="20" patternUnits="userSpaceOnUse">
              <circle cx="2px" cy="2px" r="1px" fill={isDark ? '#334155/60' : '#cbd5e1/70'} />
            </pattern>
            {routeSpots.length > 1 && (
              <mask id="route-scroll-mask">
                <path
                  ref={pathRef}
                  d={curvedRoutePathD}
                  fill="none"
                  stroke="#ffffff"
                  strokeWidth="14"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeDasharray={pathLength}
                  strokeDashoffset={pathLength * (1 - scrollProgress)}
                  style={{ transition: 'stroke-dashoffset 0.15s cubic-bezier(0.16, 1, 0.3, 1)' }}
                />
              </mask>
            )}
          </defs>
          <rect width="100%" height="100%" fill="url(#dotGrid)" rx="12" />

          {/* Zoom and Translate Group */}
          <g 
            transform={`translate(${cx - center.x * zoom}, ${cy - center.y * zoom}) scale(${zoom})`}
            style={{ transition: isDragging ? 'none' : 'transform 350ms cubic-bezier(0.16, 1, 0.3, 1)' }}
          >
            {/* District boundary connection paths (styled network mesh topology) */}
            <g opacity={isDark ? '0.25' : '0.4'} stroke={isDark ? '#475569' : '#cbd5e1'} strokeWidth={1 / zoom} strokeDasharray="3,3">
              {/* Draw schematic topology wires representing neighboring geographical sectors */}
              {[[1, 2], [1, 4], [1, 5], [1, 6], [1, 7], [2, 4], [2, 5], [6, 7], [6, 12], [8, 12], [8, 9], [9, 12], [9, 10], [10, 12], [11, 10], [3, 7], [9, 13], [10, 13], [11, 14], [10, 14]].map(([fromId, toId], idx) => {
                const fromC = DISTRICT_COORDS[fromId];
                const toC = DISTRICT_COORDS[toId];
                if (fromC && toC) {
                  const p1 = getXY(fromC.lat, fromC.lon);
                  const p2 = getXY(toC.lat, toC.lon);
                  return (
                    <line 
                      key={idx} 
                      x1={p1.x} 
                      y1={p1.y} 
                      x2={p2.x} 
                      y2={p2.y} 
                    />
                  );
                }
                return null;
              })}
            </g>

            {/* Render East-West administrative zones visual glowing regions background */}
            <path 
              d="M 120 20 C 130 110, 110 180, 100 270" 
              fill="none" 
              stroke={isDark ? '#1e293b' : '#f1f5f9'} 
              strokeWidth={4 / zoom} 
              strokeDasharray="5,5" 
              opacity="0.6"
            />

            {/* Sequential itinerary route path representation with advanced layered path animations */}
            {routeSpots.length > 1 && (
              <g key={curvedRoutePathD}>
                {/* Subtle guide rail (NOT masked) so the user sees the future path with beautiful light contrast */}
                <path 
                  d={curvedRoutePathD} 
                  fill="none" 
                  stroke={isDark ? '#334155' : '#cbd5e1'} 
                  strokeWidth={2.2 / zoom} 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  opacity={isDark ? 0.35 : 0.5}
                  strokeDasharray="4, 4"
                />

                {/* Scroll-masked path drawing group */}
                <g mask="url(#route-scroll-mask)">
                  {/* Backglow heavy styling path (Curved) */}
                  <path 
                    d={curvedRoutePathD} 
                    fill="none" 
                    stroke={isDark ? '#22d3ee' : '#f97316'} 
                    strokeWidth={8 / zoom} 
                    opacity="0.25" 
                    className="blur-sm"
                  />
                  {/* Layer 1: Full-route static under-rail showing the completed itinerary footprint gently */}
                  <path 
                    d={curvedRoutePathD} 
                    fill="none" 
                    stroke={isDark ? '#1e293b' : '#ffedd5'} 
                    strokeWidth={4.5 / zoom} 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    opacity="0.8"
                  />
                  {/* Layer 2: Main Sequential Drawing Core (simulates the pen sketch flow in real-time) */}
                  <path 
                    d={curvedRoutePathD} 
                    fill="none" 
                    stroke={isDark ? '#22d3ee' : '#ea580c'} 
                    strokeWidth={2.8 / zoom} 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                  />
                  {/* Layer 3: Marching dynamic particle pulses (flows iteratively across the lines) */}
                  <path 
                    d={curvedRoutePathD} 
                    fill="none" 
                    stroke={isDark ? '#ffffff' : '#7c2d12'} 
                    strokeWidth={1.6 / zoom} 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    className="animate-route-pulse-flow"
                    opacity="0.9"
                  />
                </g>
              </g>
            )}

            {/* Distinct Administrative centroid circles */}
            {Object.entries(DISTRICT_COORDS).map(([idStr, coord]) => {
              const id = Number(idStr);
              const isSelected = selectedDistrictId === id;
              const { x, y } = getXY(coord.lat, coord.lon);
              const isDongnam = coord.gu === 'DONGNAM';

              return (
                <g 
                  key={id} 
                  className="cursor-pointer group/node"
                  onClick={() => onSelectDistrict(isSelected ? null : id)}
                  onMouseEnter={() => setHoveredDistrictId(id)}
                  onMouseLeave={() => setHoveredDistrictId(null)}
                >
                  {/* Glowing ring under selection node */}
                  {isSelected && (
                    <circle 
                      cx={x} 
                      cy={y} 
                      r={15 / Math.sqrt(zoom)} 
                      fill="none" 
                      stroke={isDongnam ? '#ea580c' : '#0284c7'} 
                      strokeWidth={1.5 / zoom} 
                      strokeDasharray="4,2" 
                      className="animate-spin"
                      style={{ animationDuration: '6s' }}
                    />
                  )}

                  {/* Outer ring on hover */}
                  <circle 
                    cx={x} 
                    cy={y} 
                    r={10 / Math.sqrt(zoom)} 
                    fill={isDongnam 
                      ? (isSelected ? 'rgba(234, 88, 12, 0.2)' : 'rgba(234, 88, 12, 0.05)') 
                      : (isSelected ? 'rgba(2, 132, 199, 0.2)' : 'rgba(2, 132, 199, 0.05)')
                    } 
                    className="transition-all duration-300 group-hover/node:scale-150"
                  />

                  {/* Centroid core dot */}
                  <circle 
                    cx={x} 
                    cy={y} 
                    r={isSelected ? (5.5 / Math.sqrt(zoom)) : (4 / Math.sqrt(zoom))} 
                    fill={isDongnam 
                      ? (isDark ? '#f97316' : '#c2410c') 
                      : (isDark ? '#38bdf8' : '#0369a1')
                    }
                    className="transition-all duration-300 group-hover/node:r-6"
                  />

                  {/* Micro text tag under coordinate */}
                  <text 
                    x={x} 
                    y={y - 8 / zoom} 
                    textAnchor="middle" 
                    style={{ fontSize: `${8.5 / zoom}px` }}
                    className={`font-black transition-all ${
                      isSelected 
                        ? (isDark ? 'fill-white text-xs scale-105' : 'fill-slate-900') 
                        : (isDark ? 'fill-slate-450 group-hover/node:fill-slate-200' : 'fill-slate-500 group-hover/node:fill-slate-800')
                    }`}
                  >
                    {coord.name}
                  </text>
                </g>
              );
            })}

            {/* Sequential Waypoint Nodes overlayed specifically over the tour path points */}
            {routeSpots.map((spot, sIdx) => {
              const { x, y } = getXY(spot.latitude, spot.longitude);
              const isReached = isWaypointReached(sIdx);
              return (
                <g 
                  key={`route-wp-${spot.stepIndex}`}
                  className="cursor-help"
                  onMouseEnter={() => setHoveredRouteSpot(spot)}
                  onMouseLeave={() => setHoveredRouteSpot(null)}
                >
                  {/* Neon Ping Pulse element */}
                  {isReached && (
                    <circle 
                      cx={x} 
                      cy={y} 
                      r={13 / Math.sqrt(zoom)} 
                      fill="none" 
                      stroke={isDark ? '#22d3ee' : '#d97706'} 
                      strokeWidth={1.5 / zoom} 
                      opacity="0.8"
                      className="animate-ping"
                    />
                  )}
                  
                  {/* Waypoint Base Ring */}
                  <circle 
                    cx={x} 
                    cy={y} 
                    r={9.5 / Math.sqrt(zoom)} 
                    fill={isReached 
                      ? (isDark ? '#083344' : '#ffedd5') 
                      : (isDark ? '#1e293b' : '#f1f5f9')
                    } 
                    stroke={isReached 
                      ? (isDark ? '#22d3ee' : '#b45309') 
                      : (isDark ? '#475569' : '#cbd5e1')
                    } 
                    strokeWidth={2 / zoom} 
                  />

                  {/* Step order index text */}
                  <text 
                    x={x} 
                    y={y + 3.2 / zoom} 
                    textAnchor="middle" 
                    style={{ fontSize: `${9.5 / zoom}px` }}
                    className={`font-black transition-all duration-300 ${
                      isReached 
                        ? (isDark ? 'fill-cyan-400 font-extrabold' : 'fill-amber-950') 
                        : (isDark ? 'fill-slate-500' : 'fill-slate-400')
                    }`}
                  >
                    {spot.stepIndex}
                  </text>
                </g>
              );
            })}

            {/* Selected Festival Proximity and Location Indicators */}
            {(() => {
              if (!selectedFestivalId) return null;
              const festivalLocations = FESTIVAL_LOCATIONS_MAP[selectedFestivalId] || [];
              
              // Build proximity connection lines to curated spots
              const connectionLines: {
                from: { x: number; y: number; lat: number; lon: number };
                to: { x: number; y: number; name: string };
                type: 'partner' | 'closest';
                distance: number;
              }[] = [];

              festivalLocations.forEach(loc => {
                const locXY = getXY(loc.lat, loc.lon);
                
                // 1. Partners
                const partnersNames = FESTIVAL_PARTNERS[selectedFestivalId] || [];
                const partners = (spots || []).filter(spot => 
                  partnersNames.some(pName => spot.spotName.includes(pName) || pName.includes(spot.spotName))
                );

                partners.forEach(spot => {
                  const spotXY = getXY(spot.latitude, spot.longitude);
                  const dist = getDistance(loc.lat, loc.lon, spot.latitude, spot.longitude);
                  connectionLines.push({
                    from: { x: locXY.x, y: locXY.y, lat: loc.lat, lon: loc.lon },
                    to: { x: spotXY.x, y: spotXY.y, name: spot.spotName },
                    type: 'partner',
                    distance: dist
                  });
                });

                // 2. Closest spot
                let closestSpot: any = null;
                let minD = Infinity;
                (spots || []).forEach(spot => {
                  const d = getDistance(loc.lat, loc.lon, spot.latitude, spot.longitude);
                  if (d < minD) {
                    minD = d;
                    closestSpot = spot;
                  }
                });

                if (closestSpot) {
                  const isAlreadyAdded = connectionLines.some(line => line.to.name === closestSpot.spotName);
                  if (!isAlreadyAdded) {
                    const spotXY = getXY(closestSpot.latitude, closestSpot.longitude);
                    connectionLines.push({
                      from: { x: locXY.x, y: locXY.y, lat: loc.lat, lon: loc.lon },
                      to: { x: spotXY.x, y: spotXY.y, name: closestSpot.spotName },
                      type: 'closest',
                      distance: minD
                    });
                  }
                }
              });

              return (
                <g id="festival-proximity-layer">
                  {/* 1. Proximity Connection Lines */}
                  {connectionLines.map((line, idx) => {
                    const isPartner = line.type === 'partner';
                    const strokeColor = isPartner 
                      ? (isDark ? '#ec4899' : '#db2777') 
                      : (isDark ? '#38bdf8' : '#0284c7'); 
                    
                    const midX = (line.from.x + line.to.x) / 2;
                    const midY = (line.from.y + line.to.y) / 2;

                    return (
                      <g key={`prox-line-${idx}`}>
                        {/* Glow line */}
                        <line
                          x1={line.from.x}
                          y1={line.from.y}
                          x2={line.to.x}
                          y2={line.to.y}
                          stroke={strokeColor}
                          strokeWidth={isPartner ? (3.5 / zoom) : (2 / zoom)}
                          opacity="0.15"
                          className="blur-[1px]"
                        />
                        {/* Main dashed line */}
                        <line
                          x1={line.from.x}
                          y1={line.from.y}
                          x2={line.to.x}
                          y2={line.to.y}
                          stroke={strokeColor}
                          strokeWidth={isPartner ? (1.4 / zoom) : (1 / zoom)}
                          strokeDasharray={isPartner ? "3, 3" : "2, 3"}
                          opacity="0.75"
                        />
                        {/* Distance pill */}
                        <g>
                          <rect
                            x={midX - 12 / zoom}
                            y={midY - 5 / zoom}
                            width={24 / zoom}
                            height={10 / zoom}
                            rx={3 / zoom}
                            fill={isDark ? '#0f172a' : '#ffffff'}
                            stroke={strokeColor}
                            strokeWidth={0.5 / zoom}
                            opacity="0.9"
                          />
                          <text
                            x={midX}
                            y={midY + 2.5 / zoom}
                            textAnchor="middle"
                            style={{ fontSize: `${6.5 / zoom}px` }}
                            className={`font-black ${isDark ? 'fill-pink-300' : 'fill-pink-700'}`}
                          >
                            {line.distance.toFixed(1)}km
                          </text>
                        </g>
                      </g>
                    );
                  })}

                  {/* 2. Festival Markers */}
                  {festivalLocations.map((loc, lIdx) => {
                    const { x, y } = getXY(loc.lat, loc.lon);
                    const emoji = FESTIVAL_EMOJIS[selectedFestivalId] || '🎉';
                    const title = FESTIVAL_TITLES[selectedFestivalId] || '천안 축제';
                    
                    return (
                      <g
                        key={`fest-loc-${lIdx}`}
                        className="cursor-pointer group/fest"
                        onMouseEnter={() => setHoveredFestivalLoc({
                          lat: loc.lat,
                          lon: loc.lon,
                          label: loc.label,
                          festivalId: selectedFestivalId,
                          festivalTitle: title
                        })}
                        onMouseLeave={() => setHoveredFestivalLoc(null)}
                      >
                        {/* Pulsating outer ring */}
                        <circle
                          cx={x}
                          cy={y}
                          r={14 / Math.sqrt(zoom)}
                          fill="none"
                          stroke={isDark ? '#f472b6' : '#ec4899'}
                          strokeWidth={2 / zoom}
                          className="animate-ping"
                          opacity="0.6"
                          style={{ animationDuration: '2s' }}
                        />

                        {/* Floating background circle */}
                        <circle
                          cx={x}
                          cy={y}
                          r={10 / Math.sqrt(zoom)}
                          fill={isDark ? '#4c0519' : '#fce7f3'}
                          stroke={isDark ? '#ec4899' : '#db2777'}
                          strokeWidth={1.8 / zoom}
                          className="transition-all duration-300 group-hover/fest:scale-125"
                        />

                        {/* Emoji text */}
                        <text
                          x={x}
                          y={y + 3.2 / zoom}
                          textAnchor="middle"
                          style={{ fontSize: `${9 / zoom}px` }}
                          className="select-none"
                        >
                          {emoji}
                        </text>

                        {/* Text label */}
                        {(() => {
                          const labelWidth = (loc.label.length * 5.4 + 10) / zoom;
                          const labelHeight = 11 / zoom;
                          const labelY = y - 13 / zoom;
                          return (
                            <g className="transition-all duration-300 group-hover/fest:translate-y-[-2px]">
                              <rect
                                x={x - labelWidth / 2}
                                y={labelY - 5.5 / zoom}
                                width={labelWidth}
                                height={labelHeight}
                                rx={3 / zoom}
                                fill={isDark ? '#1f1625' : '#fdf2f8'}
                                stroke={isDark ? '#f472b6' : '#ec4899'}
                                strokeWidth={0.8 / zoom}
                                opacity="0.95"
                              />
                              <text
                                x={x}
                                y={labelY + 2.5 / zoom}
                                textAnchor="middle"
                                style={{ fontSize: `${7 / zoom}px` }}
                                className={`font-black tracking-tight ${
                                  isDark ? 'fill-pink-300' : 'fill-pink-700'
                                }`}
                              >
                                {loc.label}
                              </text>
                            </g>
                          );
                        })()}
                      </g>
                    );
                  })}
                </g>
              );
            })()}

            {/* Clustered Spots Markers Layer */}
            <g id="clustered-spots-layer">
              {clusteredSpots.map((cluster) => {
                const { x, y } = cluster.centroid;
                const isCluster = cluster.spots.length > 1;

                if (isCluster) {
                  const spotCount = cluster.spots.length;
                  const counts = cluster.spots.reduce((acc: any, s: any) => {
                    acc[s.category] = (acc[s.category] || 0) + 1;
                    return acc;
                  }, {});
                  let dominantCat = 'Taste';
                  if ((counts['Nature'] || 0) > (counts[dominantCat] || 0)) dominantCat = 'Nature';
                  if ((counts['Heritage'] || 0) > (counts[dominantCat] || 0)) dominantCat = 'Heritage';

                  const getClusterColor = (cat: string) => {
                    if (cat === 'Taste') return isDark ? '#fbbf24' : '#d97706';
                    if (cat === 'Nature') return isDark ? '#34d399' : '#059669';
                    return isDark ? '#c084fc' : '#4f46e5';
                  };
                  
                  const themeColor = getClusterColor(dominantCat);
                  const radius = (11 + Math.min(spotCount * 0.8, 7)) / zoom;

                  return (
                    <g
                      key={cluster.id}
                      className="cursor-pointer group/cluster"
                      onClick={(e) => {
                        e.stopPropagation();
                        const nextZoom = Math.min(zoom + 1.2, 4.0);
                        setCenter({ x, y });
                        setZoom(nextZoom);
                      }}
                      onMouseEnter={() => setHoveredCluster(cluster)}
                      onMouseLeave={() => setHoveredCluster(null)}
                    >
                      {/* Pulsing outer glow */}
                      <circle
                        cx={x}
                        cy={y}
                        r={radius + 3 / zoom}
                        fill="none"
                        stroke={themeColor}
                        strokeWidth={1.5 / zoom}
                        className="animate-ping"
                        opacity="0.4"
                        style={{ animationDuration: '3s' }}
                      />
                      
                      {/* Main cluster circle */}
                      <circle
                        cx={x}
                        cy={y}
                        r={radius}
                        fill={isDark ? 'rgba(15, 23, 42, 0.9)' : '#ffffff'}
                        stroke={themeColor}
                        strokeWidth={2.2 / zoom}
                        className="transition-all duration-300 group-hover/cluster:opacity-90"
                      />

                      {/* Category color center dot */}
                      <circle
                        cx={x}
                        cy={y}
                        r={radius - 2.5 / zoom}
                        fill={themeColor}
                        opacity="0.15"
                      />

                      {/* Count Text */}
                      <text
                        x={x}
                        y={y + 3.0 / zoom}
                        textAnchor="middle"
                        fill={isDark ? '#f8fafc' : '#0f172a'}
                        fontWeight="900"
                        style={{ fontSize: `${(8.5 + Math.min(spotCount * 0.2, 3)) / zoom}px` }}
                        className="font-sans select-none pointer-events-none"
                      >
                        {spotCount}
                      </text>
                    </g>
                  );
                } else {
                  const spot = cluster.spots[0];
                  const spotColor = getColor(spot.category);
                  const emoji = spot.category === 'Taste' ? '☕' : spot.category === 'Nature' ? '🌲' : '🏛️';

                  return (
                    <g
                      key={`single-${spot.id}`}
                      className="cursor-pointer group/spot"
                      onClick={(e) => {
                        e.stopPropagation();
                        setCenter({ x, y });
                        if (zoom < 2.0) setZoom(2.0);
                        const spotEl = document.getElementById(`spot-card-${spot.id}`);
                        if (spotEl) {
                          spotEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
                        }
                      }}
                      onMouseEnter={() => setHoveredSpot(spot)}
                      onMouseLeave={() => setHoveredSpot(null)}
                    >
                      {/* Ring highlight on hover */}
                      <circle
                        cx={x}
                        cy={y}
                        r={8.5 / zoom}
                        fill="none"
                        stroke={spotColor}
                        strokeWidth={1 / zoom}
                        opacity="0"
                        className="transition-all duration-300 group-hover/spot:opacity-100 group-hover/spot:scale-125"
                      />

                      {/* Outer marker pin circle */}
                      <circle
                        cx={x}
                        cy={y}
                        r={6.2 / zoom}
                        fill={spotColor}
                        stroke={isDark ? '#0f172a' : '#ffffff'}
                        strokeWidth={1.2 / zoom}
                        className="transition-all duration-200 group-hover/spot:scale-110"
                      />

                      {/* Micro dot */}
                      <circle
                        cx={x}
                        cy={y}
                        r={1.8 / zoom}
                        fill={isDark ? '#0f172a' : '#ffffff'}
                      />

                      {/* Category icon label on zoom */}
                      {zoom >= 2.0 && (
                        <g className="transition-all duration-300 transform translate-y-[-1px]">
                          <rect
                            x={x - 4 / zoom}
                            y={y - 12 / zoom}
                            width={8 / zoom}
                            height={8 / zoom}
                            rx={1.5 / zoom}
                            fill={isDark ? '#1e293b' : '#ffffff'}
                            stroke={spotColor}
                            strokeWidth={0.5 / zoom}
                          />
                          <text
                            x={x}
                            y={y - 6 / zoom}
                            textAnchor="middle"
                            style={{ fontSize: `${5.5 / zoom}px` }}
                            className="select-none font-sans"
                          >
                            {emoji}
                          </text>
                        </g>
                      )}
                    </g>
                  );
                }
              })}
            </g>
          </g>
        </svg>

        {/* HUD Glassmorphism Zoom & Pan Controls */}
        <div className="absolute bottom-3 left-4 flex flex-col gap-1.5 z-20 pointer-events-auto">
          <div className={`flex items-center gap-1 p-1 rounded-xl shadow-lg border backdrop-blur-md transition-all duration-300 ${
            isDark ? 'bg-slate-900/90 border-slate-800 text-white' : 'bg-white/90 border-slate-200 text-slate-800'
          }`}>
            <button
              onClick={() => setZoom(prev => Math.min(prev + 0.5, 4.0))}
              className={`p-1.5 rounded-lg transition-all hover:scale-105 active:scale-95 cursor-pointer ${
                isDark ? 'hover:bg-slate-800 text-cyan-400' : 'hover:bg-slate-100 text-amber-700'
              }`}
              title="지도 확대"
            >
              <Plus className="w-3.5 h-3.5" />
            </button>
            
            <span className="text-[10px] font-black px-1.5 font-mono min-w-[34px] text-center select-none">
              {Math.round(zoom * 100)}%
            </span>

            <button
              onClick={() => {
                const nextZoom = Math.max(zoom - 0.5, 1.0);
                setZoom(nextZoom);
                if (nextZoom <= 1.0) {
                  setCenter({ x: 190, y: 145 });
                }
              }}
              className={`p-1.5 rounded-lg transition-all hover:scale-105 active:scale-95 cursor-pointer ${
                isDark ? 'hover:bg-slate-800 text-cyan-400' : 'hover:bg-slate-100 text-amber-700'
              }`}
              disabled={zoom <= 1.0}
              title="지도 축소"
            >
              <Minus className="w-3.5 h-3.5 opacity-80" />
            </button>

            <button
              onClick={() => {
                setZoom(1.0);
                setCenter({ x: 190, y: 145 });
              }}
              className={`p-1.5 rounded-lg transition-all hover:scale-105 active:scale-95 cursor-pointer border-l ${
                isDark ? 'border-slate-800 hover:bg-slate-800 text-slate-400' : 'border-slate-200 hover:bg-slate-100 text-slate-500'
              }`}
              title="배율 초기화"
            >
              <RefreshCw className="w-3 h-3" />
            </button>
          </div>
          
          {zoom > 1.0 && (
            <div className="text-[8px] font-bold text-slate-400 font-sans tracking-wide animate-pulse flex items-center gap-1 select-none pointer-events-none bg-slate-900/30 dark:bg-slate-950/40 px-2 py-0.5 rounded-md backdrop-blur-xs w-fit">
              <span>👉</span> 마우스 드래그 / 터치로 지도를 이동할 수 있습니다.
            </div>
          )}
        </div>
      </div>

      <div className="space-y-6">
        {/* DONGNAM GU GROUP */}
        {dongnamDistricts.length > 0 && (
          <div className="space-y-3">
            <div className="flex items-center gap-2 px-1">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
              <span className="text-xs font-black text-amber-950 dark:text-amber-400 uppercase tracking-widest font-mono block">동남 헤리티지 구역 (동남구)</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {dongnamDistricts.map((d) => {
                const isSelected = selectedDistrictId === d.id;
                return (
                  <button
                    key={d.id}
                    onClick={() => onSelectDistrict(isSelected ? null : d.id)}
                    className={`text-left p-4 rounded-2xl border transition-all duration-300 relative cursor-pointer group flex flex-col justify-between h-[105px] font-sans ${
                      isSelected 
                        ? (isDark 
                            ? 'bg-slate-900/60 border-amber-600 shadow-md ring-1 ring-amber-600/30' 
                            : 'bg-[#FAF5EE] border-amber-500/80 shadow-md ring-1 ring-amber-500/30'
                          )
                        : (isDark 
                            ? 'bg-slate-950 border-slate-850 hover:border-amber-900/40 hover:bg-[#1C160F]' 
                            : 'bg-slate-50/40 hover:bg-[#FAF8F5]/80 border-slate-100 hover:border-amber-350 shadow-sm'
                          )
                    }`}
                  >
                    <div className="w-full">
                      <div className="flex justify-between items-start">
                        <span className={`font-extrabold text-sm transition-colors ${
                          isSelected ? 'text-amber-900 dark:text-amber-350' : 'text-slate-800 dark:text-slate-200 group-hover:text-amber-900 dark:group-hover:text-amber-400'
                        }`}>
                          {d.subName}
                        </span>
                        {isSelected && (
                          <CheckCircle className="w-4 h-4 text-amber-700 dark:text-amber-400 shrink-0 ml-1" />
                        )}
                      </div>
                      <p className="text-[11px] text-slate-400 group-hover:text-slate-500 font-medium line-clamp-1 mt-1 leading-normal w-full">
                        {d.description}
                      </p>
                    </div>
                    <div className="text-[10px] font-bold text-amber-800/80 dark:text-amber-400 tracking-tight block truncate w-full mt-2 border-t border-amber-100/30 dark:border-amber-900/20 pt-1">
                      ✨ {getDistrictAccent(d.subName)}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* SEOBUK GU GROUP */}
        {seobukDistricts.length > 0 && (
          <div className="space-y-3">
            <div className="flex items-center gap-2 px-1">
              <span className="w-2.5 h-2.5 rounded-full bg-cyan-500" />
              <span className="text-xs font-black text-sky-950 dark:text-cyan-450 uppercase tracking-widest font-mono block">서북 얼반 트렌디 구역 (서북구)</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {seobukDistricts.map((d) => {
                const isSelected = selectedDistrictId === d.id;
                return (
                  <button
                    key={d.id}
                    onClick={() => onSelectDistrict(isSelected ? null : d.id)}
                    className={`text-left p-4 rounded-2xl border transition-all duration-300 relative cursor-pointer group flex flex-col justify-between h-[105px] font-sans ${
                      isSelected 
                        ? (isDark 
                            ? 'bg-slate-900/60 border-cyan-500 shadow-md ring-1 ring-cyan-500/30' 
                            : 'bg-[#F0F9FF] border-sky-450 shadow-md ring-1 ring-sky-400/30'
                          )
                        : (isDark 
                            ? 'bg-slate-950 border-slate-850 hover:border-cyan-900/45 hover:bg-[#101923]' 
                            : 'bg-slate-50/40 hover:bg-sky-50/40 border-slate-100 hover:border-sky-350 shadow-sm'
                          )
                    }`}
                  >
                    <div className="w-full">
                      <div className="flex justify-between items-start">
                        <span className={`font-extrabold text-sm transition-colors ${
                          isSelected ? 'text-sky-900 dark:text-cyan-300' : 'text-slate-800 dark:text-slate-200 group-hover:text-sky-850 dark:group-hover:text-cyan-455'
                        }`}>
                          {d.subName}
                        </span>
                        {isSelected && (
                          <CheckCircle className={`w-4 h-4 shrink-0 ml-1 ${isDark ? 'text-cyan-400' : 'text-sky-600'}`} />
                        )}
                      </div>
                      <p className="text-[11px] text-slate-400 group-hover:text-slate-500 font-medium line-clamp-1 mt-1 leading-normal w-full">
                        {d.description}
                      </p>
                    </div>
                    <div className="text-[10px] font-bold text-sky-700/85 dark:text-cyan-400 tracking-tight block truncate w-full mt-2 border-t border-sky-100/30 dark:border-slate-800/80 pt-1">
                      ✨ {getDistrictAccent(d.subName)}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
