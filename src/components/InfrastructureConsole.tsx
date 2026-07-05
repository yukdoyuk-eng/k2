import React, { useState, useEffect } from 'react';
import {
  Server,
  Shield,
  Activity,
  Terminal,
  Database,
  Lock,
  Cpu,
  RefreshCw,
  Sliders,
  CheckCircle,
  AlertTriangle,
  Play,
  FileText,
  Code,
  Zap,
  Layers,
  ArrowRight,
  TrendingUp,
  SlidersHorizontal,
  ChevronRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

// Static documentation contents to assure rigorous depth of analysis
interface ApiDoc {
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
  path: string;
  summary: string;
  requestHeader?: string;
  requestBody?: string;
  responseBody: string;
}

const API_SPECS: ApiDoc[] = [
  {
    method: 'GET',
    path: '/api/spots',
    summary: '천안시 통합 미학 명소 및 가중 평점 목록 조회',
    requestHeader: 'Authorization: Bearer <JWT_TOKEN>\nAccept-Encoding: gzip, deflate, br',
    responseBody: `[
  {
    "id": 1,
    "spotName": "독립기념관 단풍나무 숲길",
    "category": "Heritage",
    "districtId": 101,
    "ratingRaw": 4.8,
    "reviewsCount": 352,
    "weightedScore": 4.78,
    "imageUrl": "https://images.unsplash.com...",
    "mzTags": ["사색", "단풍터널", "가을정취"]
  }
]`
  },
  {
    method: 'POST',
    path: '/api/spots/:id/reviews',
    summary: '특정 명소에 대한 실시간 유저 후기 및 가점 평점 등록',
    requestHeader: 'Content-Type: application/json\nX-Client-IP: 211.233.12.11',
    requestBody: `{
  "username": "조선미학자",
  "rating": 5,
  "comment": "한옥과 숲 뷰가 마음의 미세먼지를 깨끗하게 씻어줍니다.",
  "mzKeywords": ["여유로움", "인생샷"]
}`,
    responseBody: `{
  "success": true,
  "updatedSpot": {
    "id": 2,
    "spotName": "카페목천",
    "reviewsCount": 241,
    "weightedScore": 4.63
  }
}`
  },
  {
    method: 'POST',
    path: '/api/curate',
    summary: '사용자 시간 및 상황별 지능형 1분 단위 맞춤 동선 설계 요청',
    requestHeader: 'Content-Type: application/json',
    requestBody: `{
  "userPrompt": "부모님 모시고 걷기 편하고 보양식 포함된 일일 코스 짜줘",
  "targetGu": "DONGNAM",
  "currentRatingList": [{"id": 1, "score": 4.78}]
}`,
    responseBody: `{
  "success": true,
  "curation": "🧭 [천안시 코스 도우미] 맞춤 일정이 정밀 설계되었습니다...\\n\\n### 🗺️ 맞춤형 일정표\\n| 시간대 | 장소명 | 활동지침..."
}`
  }
];

export default function InfrastructureConsole() {
  const [activeTab, setActiveTab] = useState<'arch' | 'api' | 'stress' | 'dr' | 'consult'>('arch');
  const [selectedNode, setSelectedNode] = useState<string>('lb');
  const [selectedApi, setSelectedApi] = useState<number>(0);
  
  // API Caller simulation state
  const [apiSimulating, setApiSimulating] = useState(false);
  const [apiSimResult, setApiSimResult] = useState<string | null>(null);

  // Traffic Simulator states
  const [virtualUsers, setVirtualUsers] = useState<number>(5000);
  const [isStressRunning, setIsStressRunning] = useState<boolean>(false);
  const [stressMetrics, setStressMetrics] = useState({
    tps: 0,
    latency: 18,
    cpu: 10,
    memory: 24,
    redisHit: 98.2,
    packetLoss: 0.00,
    serverCount: 2
  });

  // Dynamic values during stress simulation
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isStressRunning) {
      interval = setInterval(() => {
        const ratio = virtualUsers / 10000;
        // Introduce small fluctuations to make it live and realistic
        const fl = () => (Math.random() - 0.5) * 5;
        const flSmall = () => (Math.random() - 0.5) * 0.2;

        setStressMetrics(prev => {
          const tpsValue = Math.round(virtualUsers * 1.8 + fl() * 50);
          const latencyValue = Math.round(15 + ratio * 85 + (Math.random() * 8));
          const cpuValue = Math.min(99, Math.round(8 + ratio * 72 + fl()));
          const memoryValue = Math.min(95, Math.round(20 + ratio * 55 + flSmall() * 10));
          const redisHitValue = Math.max(80, parseFloat((99.1 - ratio * 8 + flSmall()).toFixed(1)));
          const packetValue = virtualUsers > 8000 ? parseFloat((0.00 + (virtualUsers - 8000) * 0.0002).toFixed(3)) : 0.00;
          const servers = Math.max(2, Math.ceil(virtualUsers / 3000));

          return {
            tps: tpsValue,
            latency: latencyValue,
            cpu: cpuValue,
            memory: memoryValue,
            redisHit: redisHitValue,
            packetLoss: packetValue,
            serverCount: servers
          };
        });
      }, 800);
    } else {
      // Resting states
      setStressMetrics({
        tps: 0,
        latency: 8,
        cpu: 5,
        memory: 18,
        redisHit: 99.8,
        packetLoss: 0.00,
        serverCount: 2
      });
    }
    return () => clearInterval(interval);
  }, [isStressRunning, virtualUsers]);

  const handleRunApiSimulation = () => {
    setApiSimulating(true);
    setApiSimResult(null);
    setTimeout(() => {
      setApiSimulating(false);
      setApiSimResult(`HTTP/1.1 200 OK
Content-Type: application/json; charset=utf-8
Transfer-Encoding: chunked
Connection: keep-alive
Server: Express-Cluster/v4.2
TLS-Version: TLS 1.3 (Cipher Suite: Chacha20-Poly1305)
X-Response-Time-Ms: 14.5ms
Cache-Control: public, max-age=60

${API_SPECS[selectedApi].responseBody}`);
    }, 1200);
  };

  // Node information map for Interactive Architecture
  const ARCH_NODES: Record<string, { title: string; subtitle: string; desc: string; specs: string[]; icon: any }> = {
    waf: {
      title: 'Shield WAF & API Gateway',
      subtitle: '웹 보안 정기 차단 및 인접 레이지 유입 필터링',
      desc: 'ISMS-P 인증 가이드를 준수하는 최고 레벨의 방화벽 레이어입니다. 모든 외부 HTTP/S 공격(SQL Injection, XSS, CSRF)을 패킷 분석 단계에서 완전 무력화시키고, API 게이트웨이에서 속도 제한(Rate Limiting - 1IP당 1초 최대 30회 제한)을 엄격히 집행합니다.',
      specs: [
        'SSL/TLS 1.3 암호화 가속 패킷 오프로딩 지원',
        'DDoS 수문장 IP 평판 실시간 블랙리스트(Threat Intel) 연동',
        '상태 검사 주기: SLA 99.999% 게이트 가용성 확보'
      ],
      icon: Shield
    },
    lb: {
      title: 'L7 Load Balancer (ALB)',
      subtitle: '다중 가용영역 통합 백엔드 트래픽 정밀 라우팅',
      desc: '사용자 세션을 추적하여 트래픽 편차 없이 고성능 프론트와 API 웹서버 클러스터로 실시간 분산해 줍니다. 백엔드 상태 검사(Health-Check)를 지속 수행해, 비정상 서버 감지 시 단 1초의 중단 없이 정상 컨테이너로 리라우팅합니다.',
      specs: [
        '최대 동시 세션 500,000 Elastic 세션 홀딩',
        '경로 기반 라우팅 (/api/* -> API Server, /* -> Web Server)',
        'Multi-AZ 다중 가용구역 전체 데이터 무제한 파이프 연계'
      ],
      icon: Server
    },
    web: {
      title: 'Web/API Auto-scaled Cluster',
      subtitle: 'NestJS / Express 기반 실시간 무중단 배포 서버',
      desc: '사용자가 몰려 CPU 임계값(60%)이 충족되면 클라우드 오토스케일링이 트리거되며, 격리 도커 컨테이너를 가로로 즉각 증설(Scale-out)합니다. Docker 이미지와 CI/CD Blue/Green 무중단 배포 시스템으로 트래픽 중독 현상을 실시간 예방합니다.',
      specs: [
        'CPU 및 메모리 부하 기반 자동 Auto-scale-out 가동',
        'Zero-downtime Blue/Green 빌드 및 롤백 자동화',
        '경량화된 JSON 직렬화 구조 채택으로 API 패킷 페이로드 65% 경량화 완료'
      ],
      icon: Cpu
    },
    cdn: {
      title: 'Edge CDN & WebP Media Engine',
      subtitle: '글로벌 초고속 콘텐츠 전송 및 유동 형변환 시스템',
      desc: '고밀도 천안 축제 사진 및 명소 메타 이미지를 캐싱하여 전 세계 엣지 서버(Edge Location)에서 초저지연으로 상영합니다. 방문객 단말 해상도에 맞춤화하여 JPG/PNG를 초경량 고유 미학 무손실 WebP 형식으로 즉각 전환/리사이징 지원합니다.',
      specs: [
        '글로벌 엣지 로케이션 응답 속도 평균 12ms 이내 최적화',
        'WebP 원클릭 필터 및 동적 크기 변환(On-the-fly Image Resizing)',
        '브라우저 Cache-Control Max-Age 1년(31,536,000초) 압축 적용'
      ],
      icon: Zap
    },
    cache: {
      title: 'High-Perf Cache (Redis Cluster)',
      subtitle: '데이터베이스 쿼리 부하 최소화 및 실시간 동기화',
      desc: '자주 쓰이는 천안시 31개 행정구역 공간 데이터, 평균 평점 정보, 상시 축제 가이드를 고성능 분산 인메모리 스토리지인 Redis에 캐시로 상주시켜, 하부 DB 입출력 병목 현상을 완벽히 방지합니다.',
      specs: [
        '자주 호출되는 가중치 미학 평점 쿼리 응답 2ms',
        'Cache Hit Ratio 평균 98% 이상 고품격 관리 규격',
        'Master-Slave 클러스터링으로 고가용성 캐시 백업 동기화'
      ],
      icon: RefreshCw
    },
    db: {
      title: 'PostgreSQL Hybrid Relational Database',
      subtitle: '관계형 데이터 신뢰성 및 다중 가용구역 복제',
      desc: '관광지의 메타 관계, 사용자 생성 피드백, 실시간 평점 및 마스터 테이블을 일관성 있고 강력무쌍하게 관리하는 RDB입니다. 다중 가용구역(Primary/Standby) 동기 복제 아키텍처로 만일에 대비한 단 한 명의 시민 기록도 유실을 방지합니다.',
      specs: [
        'Multi-AZ Failover (장애 방지 즉시 자동 승격 가동 수 20초 이내)',
        '정기 Point-in-Time Recovery (PITR) 매 5분 서브 백업 아카이빙',
        '시민/방문객들의 솔직 후기 저장을 위한 지표 최적 유기 스키마'
      ],
      icon: Database
    }
  };

  return (
    <div id="infrastructure-console-root" className="w-full bg-slate-950 text-slate-100 rounded-3xl border border-slate-800 shadow-2xl p-6 md:p-8 space-y-8 font-sans">
      
      {/* 1. Header with admin theme */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-slate-900 pb-5 gap-4">
        <div className="space-y-1.5 text-left">
          <div className="flex items-center gap-1.5 text-cyan-400 font-mono text-[10px] font-black tracking-widest uppercase">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping inline-block" />
            <span>ENTERPRISE MIL-SPEC GLOBAL PORTAL</span>
          </div>
          <h3 className="text-2xl font-black tracking-tight flex items-center gap-2">
            <Server className="w-6 h-6 text-cyan-400" />
            천안시 글로벌 인프라 & API 통합 관제 콘솔
          </h3>
          <p className="text-xs text-slate-400 leading-relaxed max-w-2xl">
            SLA 99.99% 고가용성 인프라 규격, Swagger 연동 모의 API 테스트 베드, 1만 동시 동적 스트레스 시뮬레이션, 
            그리고 긴급 장애 복구 표준 및 공공 기술 설계를 총체적으로 통제하는 핵심 센터입니다.
          </p>
        </div>

        {/* Tab Navigator */}
        <div className="flex flex-wrap gap-1 bg-slate-900/60 p-1.5 rounded-2xl border border-slate-800/80">
          {[
            { id: 'arch', label: '인프라 계층도', icon: Layers },
            { id: 'api', label: 'API 명세서 테스트', icon: Code },
            { id: 'stress', label: '스트레스 시뮬레이터', icon: Activity },
            { id: 'dr', label: '장애 재고 복구 매뉴얼', icon: Terminal },
            { id: 'consult', label: '기술 스택 제안서', icon: FileText }
          ].map(tab => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-black cursor-pointer transition-all ${
                  activeTab === tab.id
                    ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-400/20'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. Content Sections depending on active tab */}
      <div className="min-h-[480px]">
        <AnimatePresence mode="wait">
          
          {/* TAB 1: INTERACTIVE SYSTEM ARCHITECTURE */}
          {activeTab === 'arch' && (
            <motion.div
              key="arch"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="grid grid-cols-1 lg:grid-cols-12 gap-8 text-left"
            >
              {/* Vertical Blueprint Layout representing Multi-AZ VPC flow */}
              <div className="lg:col-span-7 space-y-4">
                <div className="flex items-center justify-between border-b border-slate-900 pb-2.5">
                  <span className="text-[10px] font-black text-cyan-400 uppercase tracking-widest font-mono">
                    High-Availability Multi-AZ VPC Architecture Scheme
                  </span>
                  <span className="text-[9px] px-2 py-0.5 rounded bg-slate-900 text-slate-400 font-mono">
                    Cloud Tier Virtual Map
                  </span>
                </div>

                <div className="p-6 bg-slate-950/60 rounded-3xl border border-slate-900 flex flex-col items-center gap-4 relative overflow-hidden">
                  {/* Decorative guide grid lines */}
                  <div className="absolute inset-0 bg-[radial-gradient(#1e293b_1.2px,transparent_1.2px)] [background-size:16px_16px] opacity-20 pointer-events-none" />

                  {/* Flow chart representing full redundant routing path */}
                  {/* Step 1: Users & CDN */}
                  <div className="flex gap-4 items-center w-full justify-center">
                    <div className="px-4 py-2 bg-slate-900 rounded-xl border border-slate-800 text-[10px] font-black tracking-widest text-[#94a3b8] uppercase font-mono shadow-sm">
                      Public Internet User (HTTP/S TLS 1.3)
                    </div>
                    <ArrowRight className="w-4 h-4 text-cyan-400/50" />
                    <button
                      onClick={() => setSelectedNode('cdn')}
                      className={`px-4 py-2.5 rounded-xl border font-black text-xs transition-all flex items-center gap-2 cursor-pointer ${
                        selectedNode === 'cdn'
                          ? 'bg-cyan-950/50 border-cyan-400 text-cyan-400 shadow-md shadow-cyan-400/10 scale-105'
                          : 'bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-705'
                      }`}
                    >
                      <Zap className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
                      Global Edge CDN
                    </button>
                  </div>

                  <div className="w-0.5 h-6 bg-gradient-to-b from-cyan-400/40 to-cyan-400/80" />

                  {/* Step 2: Shield WAF & Gateway */}
                  <button
                    onClick={() => setSelectedNode('waf')}
                    className={`px-6 py-3.5 rounded-2xl border font-black text-xs tracking-tight transition-all flex items-center gap-2.5 max-w-sm w-full justify-center cursor-pointer ${
                      selectedNode === 'waf'
                        ? 'bg-cyan-950/50 border-cyan-400 text-cyan-400 shadow-md shadow-cyan-400/15 scale-105'
                        : 'bg-slate-900 border-slate-800 text-slate-200'
                    }`}
                  >
                    <Shield className="w-4 h-4 text-red-500" />
                    WAF 웹 방화벽 & 보안 API 게이트웨이
                  </button>

                  <div className="w-0.5 h-6 bg-cyan-400/80" />

                  {/* Step 3: L7 ALB */}
                  <button
                    onClick={() => setSelectedNode('lb')}
                    className={`px-6 py-3.5 rounded-2xl border font-black text-xs tracking-tight transition-all flex items-center gap-2.5 max-w-sm w-full justify-center cursor-pointer ${
                      selectedNode === 'lb'
                        ? 'bg-cyan-950/50 border-cyan-400 text-cyan-400 shadow-md shadow-cyan-400/15 scale-105'
                        : 'bg-slate-900 border-slate-800 text-slate-200'
                    }`}
                  >
                    <Server className="w-4 h-4 text-cyan-400" />
                    L7 Elastic Load Balancer (ALB)
                  </button>

                  <div className="w-0.5 h-6 bg-cyan-400/80" />

                  {/* Double Split Multi-AZ Core Virtual Border */}
                  <div className="w-full border-t border-slate-900 border-dashed py-1 text-center">
                    <span className="bg-slate-950 px-3 text-[8.5px] font-black text-slate-500 font-mono tracking-widest uppercase">
                      ⚓ Multi-AZ Private Subnet boundary line
                    </span>
                  </div>

                  {/* REDUNDANT AZ TIERS */}
                  <div className="grid grid-cols-2 gap-4 w-full">
                    {/* Zone A */}
                    <div className="p-4 rounded-2xl border border-slate-900 bg-slate-950/40 space-y-3">
                      <div className="text-[8.5px] font-extrabold text-slate-500 font-mono tracking-wider text-center bg-slate-900 py-0.5 rounded">
                        Availability Zone 1 (Primary)
                      </div>
                      
                      <button
                        onClick={() => setSelectedNode('web')}
                        className={`w-full p-2.5 rounded-xl border text-[10px] font-black transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                          selectedNode === 'web'
                            ? 'bg-cyan-950/50 border-cyan-400 text-cyan-400'
                            : 'bg-slate-900 border-slate-850 text-slate-300'
                        }`}
                      >
                        <Cpu className="w-3.5 h-3.5 text-cyan-400" /> Web/API App Server 1
                      </button>

                      <button
                        onClick={() => setSelectedNode('cache')}
                        className={`w-full p-2.5 rounded-xl border text-[10px] font-black transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                          selectedNode === 'cache'
                            ? 'bg-cyan-950/50 border-cyan-400 text-cyan-400'
                            : 'bg-slate-900 border-slate-850 text-slate-300'
                        }`}
                      >
                        <RefreshCw className="w-3.5 h-3.5 text-emerald-400 animate-spin" /> Redis Cache Cluster (Master)
                      </button>

                      <button
                        onClick={() => setSelectedNode('db')}
                        className={`w-full p-2.5 rounded-xl border text-[10px] font-black transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                          selectedNode === 'db'
                            ? 'bg-cyan-950/50 border-cyan-400 text-cyan-400'
                            : 'bg-slate-900 border-slate-850 text-slate-300'
                        }`}
                      >
                        <Database className="w-3.5 h-3.5 text-cyan-400" /> PostgreSQL (RW-Primary)
                      </button>
                    </div>

                    {/* Zone B */}
                    <div className="p-4 rounded-2xl border border-slate-900 bg-slate-950/40 space-y-3">
                      <div className="text-[8.5px] font-extrabold text-slate-500 font-mono tracking-wider text-center bg-slate-900 py-0.5 rounded">
                        Availability Zone 2 (Secondary)
                      </div>

                      <button
                        onClick={() => setSelectedNode('web')}
                        className={`w-full p-2.5 rounded-xl border text-[10px] font-black transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                          selectedNode === 'web'
                            ? 'bg-cyan-950/50 border-cyan-400 text-cyan-400'
                            : 'bg-slate-900 border-slate-850 text-slate-300'
                        }`}
                      >
                        <Cpu className="w-3.5 h-3.5 text-cyan-400 animate-pulse" /> Web/API App Server 2
                      </button>

                      <button
                        onClick={() => setSelectedNode('cache')}
                        className={`w-full p-2.5 rounded-xl border text-[10px] font-black transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                          selectedNode === 'cache'
                            ? 'bg-cyan-950/50 border-cyan-400 text-cyan-400'
                            : 'bg-slate-900 border-slate-850 text-slate-300'
                        }`}
                      >
                        <RefreshCw className="w-3.5 h-3.5 text-emerald-400" /> Redis Cache (Slave)
                      </button>

                      <button
                        onClick={() => setSelectedNode('db')}
                        className={`w-full p-2.5 rounded-xl border text-[10px] font-black transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                          selectedNode === 'db'
                            ? 'bg-cyan-950/50 border-cyan-400 text-cyan-400'
                            : 'bg-slate-900 border-slate-850 text-slate-300'
                        }`}
                      >
                        <Database className="w-3.5 h-3.5 text-slate-500" /> PostgreSQL (RO-Standby Failover)
                      </button>
                    </div>
                  </div>
                </div>
                <p className="text-[10px] text-slate-500 leading-relaxed text-center italic">
                  💡 네트워크 블록을 클릭하시면, 고가용 가이드라인 스펙과 기술 상세 정보를 오른쪽에 정독 표기합니다.
                </p>
              </div>

              {/* Node Detail Readout */}
              <div className="lg:col-span-5 space-y-4">
                <div className="flex items-center gap-2 border-b border-slate-900 pb-2.5">
                  <SlidersHorizontal className="w-4 h-4 text-cyan-400" />
                  <span className="text-xs font-black uppercase tracking-wider text-slate-200">
                    인프라 개체 정보 및 클라우드 검증 수치
                  </span>
                </div>

                <div className={`p-6 rounded-3xl bg-slate-900/40 border border-slate-800/80 min-h-[380px] space-y-5 transition-all text-left animate-fade-in`}>
                  {(() => {
                    const node = ARCH_NODES[selectedNode];
                    if (!node) return null;
                    const NodeIcon = node.icon;
                    return (
                      <>
                        <div className="flex items-center gap-3">
                          <div className="p-3 rounded-2xl bg-cyan-950 border border-cyan-400/20 text-cyan-400">
                            <NodeIcon className="w-5 h-5 shadow-lg" />
                          </div>
                          <div>
                            <h4 className="text-sm font-black text-white">{node.title}</h4>
                            <p className="text-[10px] text-cyan-400 font-bold">{node.subtitle}</p>
                          </div>
                        </div>

                        <div className="space-y-1.5 text-xs text-slate-300 leading-relaxed font-medium">
                          <p>{node.desc}</p>
                        </div>

                        <div className="space-y-2 border-t border-slate-900 pt-4">
                          <h5 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                            ⚡ 엔터프라이즈 기술 검증 명세 (SLA & Target)
                          </h5>
                          
                          <div className="space-y-1.5">
                            {node.specs.map((spec, sIdx) => (
                              <div key={sIdx} className="flex items-start gap-1.5 text-xs text-slate-300 font-medium">
                                <CheckCircle className="w-3.5 h-3.5 text-cyan-400 shrink-0 mt-0.5" />
                                <span>{spec}</span>
                              </div>
                            ))}
                          </div>
                        </div>

                        <div className="p-3.5 rounded-2xl bg-slate-950/60 border border-slate-900 text-[10.5px] leading-relaxed text-slate-400">
                          <strong>🛡️ ISMS-P 준수 기준:</strong> 상기 구성은 한국 특수 공공기관 웹 서비스 규격과 다중 가용구역 전체 데이터 무제한 암호화를 자동 집행하여, 행정안전부 및 KISA 주관 고가용 평가를 퍼펙트 통과하는 설계안입니다.
                        </div>
                      </>
                    );
                  })()}
                </div>
              </div>
            </motion.div>
          )}

          {/* TAB 2: SWAGGER STYLE API DOCUMENT & RUNNER */}
          {activeTab === 'api' && (
            <motion.div
              key="api"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="grid grid-cols-1 lg:grid-cols-12 gap-8 text-left"
            >
              {/* API list left */}
              <div className="lg:col-span-5 space-y-3">
                <span className="text-[10px] font-black text-cyan-400 uppercase tracking-widest font-mono block pb-1 border-b border-slate-900">
                  Cheonan Tour API Explorer (REST)
                </span>
                
                <div className="space-y-2">
                  {API_SPECS.map((spec, idx) => (
                    <button
                      key={idx}
                      onClick={() => {
                        setSelectedApi(idx);
                        setApiSimResult(null);
                      }}
                      className={`w-full p-4 rounded-2xl border text-left transition-all cursor-pointer ${
                        selectedApi === idx
                          ? 'bg-slate-900 border-cyan-500/80 ring-1 ring-cyan-500/10 shadow-lg shadow-cyan-500/5'
                          : 'bg-slate-950 border-slate-900 hover:border-slate-800'
                      }`}
                    >
                      <div className="flex items-center gap-2 mb-1.5">
                        <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded font-mono ${
                          spec.method === 'GET' ? 'bg-emerald-500/15 text-emerald-400' : 'bg-blue-500/15 text-blue-400'
                        }`}>
                          {spec.method}
                        </span>
                        <code className="text-[10.5px] font-black font-mono text-slate-200">{spec.path}</code>
                      </div>
                      <h5 className="text-xs font-bold leading-snug text-slate-400">{spec.summary}</h5>
                    </button>
                  ))}
                </div>

                <div className="p-4 rounded-2xl bg-slate-900/30 border border-slate-900 text-[10.5px] leading-relaxed text-slate-400 space-y-1.5">
                  <p className="font-bold text-white flex items-center gap-1.5">
                    <Lock className="w-3 h-3 text-cyan-400" /> API 전구간 전송 암호 규격
                  </p>
                  <p>
                    모든 통신 헤더에는 <strong>HMAC Signature</strong> 와 <strong>Bearer JWT 토큰</strong>이 의무이며, 
                    비정상 IP 세션은 WAF를 통해 실시간 차단 처리됩니다.
                  </p>
                </div>
              </div>

              {/* API Sandbox Details & Live caller */}
              <div className="lg:col-span-7 space-y-4">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest font-mono block pb-1 border-b border-slate-900">
                  Interactive API Request Execution Tool Sandbox
                </span>

                <div className="space-y-4">
                  {/* Endpoint detail box */}
                  <div className="p-5 rounded-2xl bg-[#0B0F19] border border-slate-900 space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-black text-white flex items-center gap-1.5">
                        <Code className="w-4 h-4 text-cyan-450" /> 통신 헤더 및 요청 바디 규격
                      </span>
                      <button
                        onClick={handleRunApiSimulation}
                        disabled={apiSimulating}
                        className={`px-3 py-1.5 rounded-xl text-[10px] font-black cursor-pointer flex items-center gap-1.5 transition-all ${
                          apiSimulating 
                            ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                            : 'bg-cyan-500 text-slate-950 hover:bg-cyan-400 shadow-md shadow-cyan-400/20'
                        }`}
                      >
                        {apiSimulating ? (
                          <>
                            <RefreshCw className="w-3.5 h-3.5 animate-spin" /> API 호출 실행 중
                          </>
                        ) : (
                          <>
                            <Play className="w-3.5 h-3.5 fill-current" /> 요청 전송 (Simulate)
                          </>
                        )}
                      </button>
                    </div>

                    {/* Headers & Body */}
                    <div className="space-y-3 font-mono text-[10.5px]">
                      <div className="space-y-1">
                        <span className="text-[9px] text-slate-500 font-extrabold uppercase tracking-widest">HTTP Headers</span>
                        <pre className="p-2.5 rounded-xl bg-slate-950 text-slate-400 border border-slate-900 overflow-x-auto leading-relaxed">
                          {API_SPECS[selectedApi].requestHeader}
                        </pre>
                      </div>

                      {API_SPECS[selectedApi].requestBody && (
                        <div className="space-y-1">
                          <span className="text-[9px] text-slate-500 font-extrabold uppercase tracking-widest">JSON Payload (Request Body)</span>
                          <pre className="p-2.5 rounded-xl bg-slate-950 text-cyan-300 border border-slate-900 overflow-x-auto leading-relaxed">
                            {API_SPECS[selectedApi].requestBody}
                          </pre>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Sandbox Run result console */}
                  <div className="p-5 rounded-2xl bg-[#090C15] border border-slate-900 space-y-2">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest font-mono block">
                      📡 API 수신 및 통신 패킷 리턴 로그 (Response Package)
                    </span>

                    <div className="min-h-[140px] bg-slate-950 rounded-xl border border-slate-900 p-3 font-mono text-[10.5px] leading-relaxed overflow-x-auto max-h-[250px] relative">
                      {apiSimulating ? (
                        <div className="absolute inset-0 bg-slate-950/80 flex flex-col items-center justify-center gap-2">
                          <div className="w-6 h-6 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin" />
                          <span className="text-slate-400 animate-pulse">SSL/TLS 1.3 핸드셰이크 협상 및 데이터 패킷 수신 중...</span>
                        </div>
                      ) : null}

                      {apiSimResult ? (
                        <pre className="text-emerald-400 font-medium whitespace-pre-wrap">{apiSimResult}</pre>
                      ) : (
                        <div className="text-slate-500 italic h-full flex items-center justify-center pt-8">
                          요청 전송(Simulate) 버튼을 누르면 실시간 SSL/TLS 응답 속도 및 원천 JSON 통품 결과를 이 자리에 출력합니다.
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* TAB 3: CONCURRENT TRAFFIC STRESS RUNNER */}
          {activeTab === 'stress' && (
            <motion.div
              key="stress"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="space-y-6 text-left"
            >
              <div className="border-b border-slate-900 pb-3 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                <div className="space-y-0.5">
                  <span className="text-[10px] font-black text-cyan-400 uppercase tracking-widest font-mono select-none">
                    High Volume Concurrent User Virtual stress test
                  </span>
                  <h4 className="text-base font-black text-white">가상 동시 접속자 무제한 부하 임계 테스트 시뮬레이터</h4>
                </div>

                <button
                  onClick={() => setIsStressRunning(!isStressRunning)}
                  className={`px-4 py-2.5 rounded-2xl text-xs font-black cursor-pointer flex items-center gap-1.5 transition-all ${
                    isStressRunning
                      ? 'bg-red-500 text-white shadow-lg shadow-red-500/20 hover:bg-red-600'
                      : 'bg-cyan-500 text-slate-950 shadow-lg shadow-cyan-400/20 hover:bg-cyan-405'
                  }`}
                >
                  <Activity className={`w-4 h-4 ${isStressRunning ? 'animate-pulse' : ''}`} />
                  {isStressRunning ? '🔴 부하 시뮬레이터 가동 정지' : '⚡ 부하 스트레스 테스트 시작'}
                </button>
              </div>

              {/* Control panel and quick summary */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                
                {/* Visualizer range selector slider */}
                <div className="lg:col-span-5 p-5 bg-[#0C101B] border border-slate-900 rounded-3xl space-y-5">
                  <div className="space-y-1">
                    <label className="text-xs font-black text-white flex justify-between items-center">
                      <span>가상 동시 접속자 수 (Virtual Users)</span>
                      <span className="text-cyan-400 font-mono text-sm font-extrabold">{virtualUsers.toLocaleString()} 명</span>
                    </label>
                    <p className="text-[11px] text-slate-450 leading-relaxed">
                      L7 로드밸런서 및 게이트웨이 임계점 측정을 위해 초당 가상 트래픽 발생 장치를 조절합니다 (최대 10,000명 동시성 인가 가능).
                    </p>
                  </div>

                  <input
                    type="range"
                    min="100"
                    max="10000"
                    step="100"
                    value={virtualUsers}
                    onChange={(e) => setVirtualUsers(parseInt(e.target.value))}
                    disabled={isStressRunning}
                    className="w-full h-1.5 bg-slate-900 rounded-lg appearance-none cursor-pointer accent-cyan-400"
                  />

                  <div className="flex justify-between text-[9px] text-slate-500 font-mono font-bold">
                    <span>100 명 (동네 소기업 수준)</span>
                    <span>5,000 명 (축제 당일 동시 접속)</span>
                    <span>10,000 명 (DDoS 유사 극한 한계)</span>
                  </div>

                  {/* High Quality Informational block */}
                  <div className="p-3 bg-slate-950 rounded-2xl border border-slate-900 space-y-1">
                    <span className="text-[9.5px] font-black text-slate-300">💡 부하 연산 기술 비고 (Redis-Cache & Hybrid Layer):</span>
                    <p className="text-[10px] text-slate-400 leading-relaxed">
                      캐시 히트율이 98%에 도달해, 1만 동시 접속 인가에도 CPU 부하는 고르게 Auto-scaled 가상 컨테이너 4대로 균등 가중 분할되어 메모리 피크 정체를 원천 해결합니다.
                    </p>
                  </div>
                </div>

                {/* Live Real-time KPI Gauges dashboard */}
                <div className="lg:col-span-7 grid grid-cols-2 md:grid-cols-3 gap-4">
                  {/* Gauge 1 */}
                  <div className="p-4 bg-slate-900/40 border border-slate-800 rounded-2xl space-y-1 flex flex-col justify-between">
                    <span className="text-[9px] font-extrabold text-slate-400 uppercase tracking-wider font-mono">
                      Throughput (TPS)
                    </span>
                    <span className={`text-2xl font-black font-mono tracking-tight my-1.5 ${isStressRunning ? 'text-[#00E8C6]' : 'text-slate-400'}`}>
                      {stressMetrics.tps.toLocaleString()} <span className="text-xs font-bold text-slate-500">req/s</span>
                    </span>
                    <p className="text-[9.5px] text-slate-500 leading-normal">초당 검증 처리 트랜잭션 개수</p>
                  </div>

                  {/* Gauge 2 */}
                  <div className="p-4 bg-slate-900/40 border border-slate-800 rounded-2xl space-y-1 flex flex-col justify-between">
                    <span className="text-[9px] font-extrabold text-slate-400 uppercase tracking-wider font-mono">
                      Average Latency
                    </span>
                    <span className={`text-2xl font-black font-mono tracking-tight my-1.5 ${isStressRunning ? 'text-amber-400' : 'text-slate-400'}`}>
                      {stressMetrics.latency} <span className="text-xs font-bold text-slate-500">ms</span>
                    </span>
                    <p className="text-[9.5px] text-slate-500 leading-normal">클라이언트 왕복 지연 연산 시간</p>
                  </div>

                  {/* Gauge 3 */}
                  <div className="p-4 bg-slate-900/40 border border-slate-800 rounded-2xl space-y-1 flex flex-col justify-between">
                    <span className="text-[9px] font-extrabold text-slate-400 uppercase tracking-wider font-mono">
                      Gateway Packet Loss
                    </span>
                    <span className={`text-2xl font-black font-mono tracking-tight my-1.5 ${stressMetrics.packetLoss > 0.02 ? 'text-red-400' : 'text-emerald-400'}`}>
                      {stressMetrics.packetLoss.toFixed(3)} <span className="text-xs font-bold text-slate-500">%</span>
                    </span>
                    <p className="text-[9.5px] text-slate-500 leading-normal">누적 패킷 손실 차단 비율</p>
                  </div>

                  {/* Gauge 4 */}
                  <div className="p-4 bg-slate-900/40 border border-slate-800 rounded-2xl space-y-1 flex flex-col justify-between">
                    <span className="text-[9px] font-extrabold text-slate-400 uppercase tracking-wider font-mono">
                      Cluster CPU Utilization
                    </span>
                    <span className={`text-2xl font-black font-mono tracking-tight my-1.5 ${stressMetrics.cpu > 70 ? 'text-amber-500 animate-pulse' : 'text-slate-420'}`}>
                      {stressMetrics.cpu} <span className="text-xs font-bold text-slate-500">%</span>
                    </span>
                    <p className="text-[9.5px] text-slate-500 leading-normal">자동 백엔드 인스턴스 CPU 부하</p>
                  </div>

                  {/* Gauge 5 */}
                  <div className="p-4 bg-slate-900/40 border border-slate-800 rounded-2xl space-y-1 flex flex-col justify-between">
                    <span className="text-[9px] font-extrabold text-slate-400 uppercase tracking-wider font-mono">
                      Active Pod instances
                    </span>
                    <span className="text-2xl font-black font-mono text-cyan-400 tracking-tight my-1.5">
                      {stressMetrics.serverCount} <span className="text-xs font-bold text-slate-500">PODs</span>
                    </span>
                    <p className="text-[9.5px] text-slate-500 leading-normal">실시간 부하 스케일아웃 호스트 대수</p>
                  </div>

                  {/* Gauge 6 */}
                  <div className="p-4 bg-slate-900/40 border border-slate-800 rounded-2xl space-y-1 flex flex-col justify-between">
                    <span className="text-[9px] font-extrabold text-slate-400 uppercase tracking-wider font-mono">
                      Redis Cache Hit Ratio
                    </span>
                    <span className="text-2xl font-black font-mono text-emerald-400 tracking-tight my-1.5">
                      {stressMetrics.redisHit} <span className="text-xs font-bold text-slate-500">%</span>
                    </span>
                    <p className="text-[9.5px] text-slate-500 leading-normal">인메모리 데이터 쿼리 즉결 캐싱율</p>
                  </div>
                </div>
              </div>

              {/* Interactive custom status graph using beautiful glowing CSS bars for live monitoring */}
              <div className="p-5 bg-slate-950 border border-slate-900 rounded-3xl space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-black text-white flex items-center gap-1.5">
                    <TrendingUp className="w-4 h-4 text-[#00E8C6]" />
                    실시간 가상 서버 대역폭 및 응답 추이선 (Live Telemetry System Metrics)
                  </span>
                  <span className="text-[9px] font-mono text-slate-500">Live 1s interval tracking</span>
                </div>

                <div className="h-28 flex items-end gap-1 px-2 border-b border-l border-slate-900/80 pt-4 pb-0.5 relative overflow-hidden">
                  {!isStressRunning ? (
                    <div className="absolute inset-0 flex items-center justify-center text-xs text-slate-500 italic bg-slate-950/90">
                      상단의 '부하 스트레스 테스트 시작' 버튼을 누르시면 실시간 연산 가해 데이터 파이프 흐름이 실시간 그래프로 점화됩니다.
                    </div>
                  ) : (
                    <>
                      {/* CSS staggered visualizers */}
                      {Array.from({ length: 48 }).map((_, i) => {
                        const wave = Math.sin((i + Date.now()/1000) * 0.4) * 15;
                        const ratioValue = stressMetrics.cpu + wave;
                        const heightPercent = Math.max(10, Math.min(95, ratioValue));
                        
                        let colorClass = 'bg-cyan-500/80 shadow-[0_0_8px_rgba(6,182,212,0.3)]';
                        if (heightPercent > 75) {
                          colorClass = 'bg-red-500/80 shadow-[0_0_8px_rgba(239,68,68,0.3)]';
                        } else if (heightPercent > 45) {
                          colorClass = 'bg-amber-500/80 shadow-[0_0_8px_rgba(245,158,11,0.3)]';
                        }

                        return (
                          <div
                            key={i}
                            style={{ height: `${heightPercent}%` }}
                            className={`w-full rounded-t transition-all duration-300 ${colorClass}`}
                          />
                        );
                      })}
                    </>
                  )}
                </div>
              </div>
            </motion.div>
          )}

          {/* TAB 4: DISASTER RECOVERY PROTOCOLS AND CODE PLAYGROUND */}
          {activeTab === 'dr' && (
            <motion.div
              key="dr"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="grid grid-cols-1 lg:grid-cols-12 gap-8 text-left"
            >
              {/* Disaster mitigation procedures menu (Left) */}
              <div className="lg:col-span-5 space-y-4">
                <span className="text-[10px] font-black text-cyan-400 uppercase tracking-widest font-mono block pb-1 border-b border-slate-900">
                  Critical Incident Response Scenarios
                </span>

                <div className="p-4 bg-red-950/15 border border-red-900/30 rounded-2xl flex items-start gap-3">
                  <AlertTriangle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                  <div className="space-y-1">
                    <h5 className="text-xs font-black text-slate-100">비상 상황 대응 등급 1 최고 단계 협의인</h5>
                    <p className="text-[10.5px] text-slate-400 leading-normal">
                      아래 긴급 프로토콜은 행정안전부 및 소방 당국, 공공 웹 보안 전담본부 긴급 대응 매뉴얼 지침에 따라 
                      정확히 편제된 툴킷 및 처방 코드라인입니다.
                    </p>
                  </div>
                </div>

                <div className="space-y-2 mt-4">
                  {[
                    { id: 'down', title: '🚨 시나리오 A: 메인 웹 서버 완파 복구', sub: 'Active-Active Multi-AZ 장애 극복 라우트 전환' },
                    { id: 'db_lost', title: '🗄️ 시나리오 B: 데이터베이스 전면 유실', sub: 'Point-In-Time-Recovery (PITR) 신속 시계열 복원' },
                    { id: 'ddos', title: '🛡️ 시나리오 C: 대규모 DDoS 표적 유입 공격', sub: 'Cloud WAF Rate Limit 장벽 및 IP 평판 강제 차단' }
                  ].map((scenario) => (
                    <div
                      key={scenario.id}
                      className="p-4 rounded-2xl bg-slate-900/30 border border-slate-905 hover:border-slate-800 transition-all cursor-default"
                    >
                      <h5 className="text-xs font-black text-white">{scenario.title}</h5>
                      <p className="text-[10.5px] text-slate-400 leading-normal mt-0.5">{scenario.sub}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Remediation actual executable CLI script syntax panels (Right) */}
              <div className="lg:col-span-7 space-y-4">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest font-mono block pb-1 border-b border-slate-900 font-bold">
                  Remediation Script Execution Protocols
                </span>

                <div className="space-y-4">
                  {/* Script block 1 */}
                  <div className="p-4 bg-slate-950 border border-slate-900 rounded-2xl space-y-2.5 font-mono">
                    <div className="flex justify-between items-center border-b border-slate-900 pb-2">
                      <span className="text-[10px] font-extrabold text-[#94a3b8] flex items-center gap-1.5 font-mono">
                        <Terminal className="w-3.5 h-3.5 text-cyan-400" /> CLI Manual recovery script for Pod scaling
                      </span>
                      <span className="text-[8.5px] px-1.5 py-0.5 rounded bg-red-950/40 text-red-400 border border-red-900/20 uppercase tracking-wider font-bold">
                        EXECUTE NOW
                      </span>
                    </div>

                    <pre className="text-[10px] text-cyan-300 leading-relaxed overflow-x-auto">
{`# 1. API 웹 서버 비정상 다운 감지 즉시 전체 상태 재정비
kubectl get pods -n cheonan-tour-service

# 2. 비정상 Pod 강제 사거 차단 및 신규 격리 Blue/Green 기동
kubectl rollout restart deployment/cheonan-api-prod -n cheonan-tour-service

# 3. 오토스케일링 수동 강제 복구 증설 개입 (최소 POD 수 4대 확장)
kubectl scale --replicas=4 deployment/cheonan-api-prod -n cheonan-tour-service`}
                    </pre>
                  </div>

                  {/* Script block 2 */}
                  <div className="p-4 bg-slate-950 border border-slate-900 rounded-2xl space-y-2.5 font-mono">
                    <div className="flex justify-between items-center border-b border-slate-900 pb-2">
                      <span className="text-[10px] font-extrabold text-[#94a3b8] flex items-center gap-1.5 font-mono">
                        <Database className="w-3.5 h-3.5 text-cyan-400" /> PITR DB Point-in-time Recovery Script
                      </span>
                      <span className="text-[8.5px] px-1.5 py-0.5 rounded bg-slate-900 text-slate-400 uppercase tracking-wider font-bold">
                        DATABASE ONLY
                      </span>
                    </div>

                    <pre className="text-[10px] text-amber-500 leading-relaxed overflow-x-auto">
{`# PostgreSQL 5분 전 백업본 시각 기준 정밀 타겟 복원 기동
pg_recvlogical --create-slot -s cheonan_pitr_slot -d cheonan_db

# 백업 복원 타겟 타임스탬프 협정 세계시(UTC) 주입 설정
# 2026년 6월 7일 14시 30분 사고 5분 전 완벽 타겟 복귀 리셋
cat <<EOF > /var/lib/postgresql/data/recovery.conf
restore_command = 'cp /mnt/archive/%f %p'
recovery_target_time = '2026-06-07 14:30:00 UTC'
EOF`}
                    </pre>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* TAB 5: TECHNICAL STACK RECOMMENDATIONS CONSULTANCY */}
          {activeTab === 'consult' && (
            <motion.div
              key="consult"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="space-y-6 text-left max-w-4xl mx-auto"
            >
              <div className="border-b border-slate-900 pb-3">
                <span className="text-[10px] font-black text-cyan-400 uppercase tracking-widest font-mono">
                  Enterprise System Technology Design Blueprint Proposal
                </span>
                <h4 className="text-lg font-black text-white mt-1">글로벌 디지털 전환 최적 기술 스택 타당성 검토 제안서</h4>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 leading-relaxed">
                {/* Proposed Stack 1 */}
                <div className="p-5 rounded-2xl bg-slate-900/20 border border-slate-800/80 space-y-3">
                  <div className="flex items-center gap-2 block border-b border-slate-900 pb-2">
                    <span className="p-2 rounded-xl bg-orange-950 text-orange-400"><Server className="w-4 h-4" /></span>
                    <h5 className="text-xs font-black text-white">클라우드 인프라: AWS vs NCP (선정: Naver Cloud Platform)</h5>
                  </div>
                  <p className="text-[11px] text-slate-350 leading-relaxed">
                    글로벌 저지연 및 미화 전송 스펙은 AWS가 우위이나, 한국 공공기관 정보보안 규정 및 <strong>CSAP (클라우드 서비스 보안인증규격)</strong>을 100% 한계치 돌파 준수하기 위해 국산 공공 클라우드 표준인 **Naver Cloud Platform (NCP)** 포털 전용존 선정이 대안입니다.
                  </p>
                </div>

                {/* Proposed Stack 2 */}
                <div className="p-5 rounded-2xl bg-slate-900/20 border border-slate-800/80 space-y-3">
                  <div className="flex items-center gap-2 block border-b border-slate-900 pb-2">
                    <span className="p-2 rounded-xl bg-blue-950 text-blue-400"><Code className="w-4 h-4" /></span>
                    <h5 className="text-xs font-black text-white">백엔드 프레임워크: NestJS (TypeScript)</h5>
                  </div>
                  <p className="text-[11px] text-slate-350 leading-relaxed">
                    초고밀도로 짜여진 천안시 베이지안 알고리즘 명소 연산 및 실시간 1분 시간대 변경 도우미 동선의 정합 도출을 담당합니다. 강력한 **의존성 주입(DI)**과 데코레이터 패턴으로 개발 구조 가시화가 탁월합니다.
                  </p>
                </div>

                {/* Proposed Stack 3 */}
                <div className="p-5 rounded-2xl bg-slate-900/20 border border-slate-800/80 space-y-3">
                  <div className="flex items-center gap-2 block border-b border-slate-900 pb-2">
                    <span className="p-2 rounded-xl bg-cyan-950 text-cyan-400"><Database className="w-4 h-4" /></span>
                    <h5 className="text-xs font-black text-white">하이브리드 데이터베이스 데이터 설계</h5>
                  </div>
                  <p className="text-[11px] text-slate-350 leading-relaxed">
                    마스터 매핑과 유저 후기, 평점 가산 등의 정통 스키마는 <strong>PostgreSQL (PostGIS를 품은 로컬 지반 관계형 DB)</strong>을 채택하고, 실시간 천안 흥타령 가변 센서 로그 및 AI 큐레이팅 이력 처리는 고성능 도큐먼트 NoSQL인 <strong>MongoDB</strong>로 격리 분할 설계합니다.
                  </p>
                </div>

                {/* Proposed Stack 4 */}
                <div className="p-5 rounded-2xl bg-slate-900/20 border border-slate-800/80 space-y-3">
                  <div className="flex items-center gap-2 block border-b border-slate-900 pb-2">
                    <span className="p-2 rounded-xl bg-emerald-950 text-emerald-400"><Zap className="w-4 h-4" /></span>
                    <h5 className="text-xs font-black text-white">시각적 최적화 & 웹 접근성 지침 (KWAG) 수렴</h5>
                  </div>
                  <p className="text-[11px] text-slate-350 leading-relaxed">
                    모든 이미지 소스는 엣지 서버 단에서 무손실 압축인 WebP로 렌더링을 집행하며, 로딩 이탈 방지를 위한 정밀 스켈레톤 홀더를 병용합니다. 명도 비비드 대비 7:1 보정 및 스크린 리더 친화 ARIA 속성 정의로 KWAG 국체 기준을 완수합니다.
                  </p>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-900 text-xs text-slate-400 text-center leading-relaxed font-medium">
                🛡️ 본 설계안 제안은 천안시의 글로벌 인프라 품질과 한국형 전자정부 표준 프레임워크와의 완벽 호환 보장을 골자로 작성되었습니다.
              </div>
            </motion.div>
          )}

        </AnimatePresence>
      </div>

    </div>
  );
}
