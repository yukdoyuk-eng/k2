import React, { useState, useEffect } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import {
  Compass,
  MapPin,
  Sparkles,
  Star,
  MessageSquare,
  Search,
  BookOpen,
  Coffee,
  RotateCcw,
  Clock,
  ChevronRight,
  Sparkle,
  Image,
  Award,
  Heart,
  Layers,
  ChevronDown,
  ChevronUp,
  Calendar,
  CalendarCheck,
  CalendarDays,
  Utensils,
  Check,
  Sun,
  Moon
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import {
  mockDistricts as localDistricts,
  mockSpots as localSpots,
  FESTIVAL_EVENTS,
  PRESET_COURSES,
  UNIFIED_AESTHETIC_IMAGE
} from './data';
import { District, CuratedSpot, FestivalEvent, PresetCourse, PresetCourseStep } from './types';
import {
  getStepTimes,
  getSeasonalRecommendation,
  getDistance,
  getOriginCoords
} from './utils';
import CheonanMap from './components/CheonanMap';
import ReviewSection from './components/ReviewSection';
import SpotSurroundingView from './components/SpotSurroundingView';
import InfrastructureConsole from './components/InfrastructureConsole';
import CurationRenderer from './components/CurationRenderer';
import BentoStats from './components/BentoStats';
import FestivalCalendar from './components/FestivalCalendar';

export default function App() {
  const queryClient = useQueryClient();

  // Persistent dark mode theme toggle state backed by localStorage
  const [isDark, setIsDark] = useState<boolean>(() => {
    const saved = localStorage.getItem('isDarkTheme');
    return saved ? saved === 'true' : false;
  });

  const toggleDarkMode = () => {
    setIsDark((prev) => {
      const newVal = !prev;
      localStorage.setItem('isDarkTheme', String(newVal));
      return newVal;
    });
  };

  // Load districts with React Query and cache
  const { data: districts = localDistricts } = useQuery<District[]>({
    queryKey: ['districts'],
    queryFn: async () => {
      const response = await fetch('/api/districts');
      if (!response.ok) throw new Error('Failed to load districts from API');
      return response.json();
    },
    initialData: localDistricts,
    staleTime: 1000 * 60 * 10, // Districts change very rarely, 10 min cache
  });

  // Load spots with React Query and cache
  const { data: spots = localSpots } = useQuery<CuratedSpot[]>({
    queryKey: ['spots'],
    queryFn: async () => {
      const response = await fetch('/api/spots');
      if (!response.ok) throw new Error('Failed to load spots from API');
      return response.json();
    },
    initialData: localSpots,
    staleTime: 1000 * 60 * 5, // Cache for 5 minutes, reducing network requests
  });

  const [selectedGu, setSelectedGu] = useState<'DONGNAM' | 'SEOBUK' | 'ALL'>('ALL');
  const [selectedDistrictId, setSelectedDistrictId] = useState<number | null>(null);
  const [selectedFestivalId, setSelectedFestivalId] = useState<string | null>(null);
  const [festSeason, setFestSeason] = useState<'ALL' | 'spring' | 'summer' | 'autumn' | 'always'>('ALL');
  const [festivalSearchQuery, setFestivalSearchQuery] = useState('');
  
  // Live Custom Course Planner states:
  const [customOrigin, setCustomOrigin] = useState<string>("천안역 (지하철 1호선)");
  const [customOriginCustomText, setCustomOriginCustomText] = useState<string>("");
  const [customSelectedSpotIds, setCustomSelectedSpotIds] = useState<number[]>([1, 4, 12, 15]); // Pre-selected spots for pleasant onboarding
  
  // Search & Filters state
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [selectedNearbySpotId, setSelectedNearbySpotId] = useState<number | null>(null);

  // AI Curation Assistant properties
  const [userPrompt, setUserPrompt] = useState('');
  const [aiCuration, setAiCuration] = useState('');
  const [curationLoading, setCurationLoading] = useState(false);

  // Time & interactive settings
  const [currentTime, setCurrentTime] = useState(new Date());
  const [expandedSpotId, setExpandedSpotId] = useState<number | null>(null);

  // Dynamic Course Planner setting
  const [selectedPresetIndex, setSelectedPresetIndex] = useState<number | null>(0);
  const [courseStartHour, setCourseStartHour] = useState<string>("09:30");
  const [mobileTab, setMobileTab] = useState<'spots' | 'map' | 'calendar' | 'planner'>('spots');

  // Sync clock
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);
    return () => clearInterval(timer);
  }, []);

  // Callback when a review is added to dynamically update the view state
  const handleReviewAdded = (updatedSpot: CuratedSpot) => {
    queryClient.setQueryData<CuratedSpot[]>(['spots'], (prevSpots) => {
      if (!prevSpots) return prevSpots;
      return prevSpots.map(s => (s.id === updatedSpot.id ? updatedSpot : s));
    });
  };

  const handleGenerateCuration = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userPrompt.trim()) return;

    setCurationLoading(true);
    setAiCuration('');

    try {
      const response = await fetch('/api/curate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userPrompt: userPrompt,
          targetGu: selectedGu,
          currentRatingList: spots.map(s => ({ id: s.id, score: s.weightedScore }))
        }),
      });
      const data = await response.json();
      if (data.success) {
        setAiCuration(data.curation);
      } else {
        setAiCuration("짙은 안개가 천안의 산맥을 에워쌌습니다. 잠시 후 큐레이팅 등대를 다시 켜주세요.");
      }
    } catch (err) {
      setAiCuration("서버와의 지능적 연결에 지연이 발생했으나 가열찬 탐험은 계속됩니다.");
    } finally {
      setCurationLoading(false);
    }
  };

  // Reset all filters
  const handleResetFilters = () => {
    setSelectedGu('ALL');
    setSelectedDistrictId(null);
    setSearchQuery('');
    setSelectedCategory('ALL');
    setSelectedFestivalId(null);
    setSelectedNearbySpotId(null);
  };

  // Compute stats dynamically
  const totalAestheticSpots = spots.length;
  
  // Calculate average of Bayesian ratings
  const spotsWithScores = spots.map(s => ({
    ...s,
    score: s.weightedScore || s.ratingRaw
  }));
  
  const topRatedSpot = [...spotsWithScores].sort((a, b) => b.score - a.score)[0];
  const totalReviewsCount = spots.reduce((sum, s) => sum + (s.customReviews?.length || 0) + s.reviewsCount, 0);

  // Filter application matching both structural levels: Gu and subName (districtId)
  const filteredSpots = spotsWithScores.filter(spot => {
    // 1. If nearby filter is active, the center spot is ALWAYS retained.
    // Geographical circle query bypasses administrative boundary partitions (Gu/subName),
    // but still allows search queries, festivals and categories sub-filtering if applied.
    if (selectedNearbySpotId !== null) {
      if (spot.id === selectedNearbySpotId) {
        // Always show the selected anchor spot card
      } else {
        const originSpot = spotsWithScores.find(s => s.id === selectedNearbySpotId);
        if (originSpot) {
          const dist = getDistance(originSpot.latitude, originSpot.longitude, spot.latitude, spot.longitude);
          if (dist > 2.0) {
            return false;
          }
        } else {
          return false;
        }
      }
    } else {
      // 1. Gu Filter
      const districtInfo = districts.find(d => d.id === spot.districtId);
      if (!districtInfo) return false;
      
      if (selectedGu !== 'ALL' && districtInfo.gu !== selectedGu) {
        return false;
      }

      // 2. Specific Sub-District filter from interactive map
      if (selectedDistrictId !== null && spot.districtId !== selectedDistrictId) {
        return false;
      }
    }

    // 3. Category Filter
    if (selectedCategory !== 'ALL' && spot.category !== selectedCategory) {
      return false;
    }

    // 4. Text Search (name, descriptions, or tags)
    if (searchQuery.trim()) {
      const districtInfo = districts.find(d => d.id === spot.districtId);
      const query = searchQuery.toLowerCase();
      const inName = spot.spotName.toLowerCase().includes(query);
      const inDesc = spot.curatorDescription.toLowerCase().includes(query);
      const inTags = spot.mzTags.some(tag => tag.toLowerCase().includes(query));
      const inDistrict = districtInfo ? districtInfo.subName.toLowerCase().includes(query) : false;
      return inName || inDesc || inTags || inDistrict;
    }

    // 5. Selected Festival filter
    if (selectedFestivalId) {
      const activeFest = FESTIVAL_EVENTS.find(f => f.id === selectedFestivalId);
      if (activeFest) {
        // Check if current spotName matches any of the partner name keywords
        const matches = activeFest.partners.some(p => 
          spot.spotName.toLowerCase().includes(p.toLowerCase()) ||
          p.toLowerCase().includes(spot.spotName.toLowerCase())
        );
        if (!matches) return false;
      }
    }

    return true;
  });

  // Category Icon helper
  const renderCategoryIcon = (category: string) => {
    switch (category) {
      case 'Heritage':
        return <Award className="w-4 h-4 text-amber-600" />;
      case 'Nature':
        return <Layers className="w-4 h-4 text-emerald-600" />;
      case 'Taste':
        return <Coffee className="w-4 h-4 text-amber-700" />;
      default:
        return <Compass className="w-4 h-4 text-slate-500" />;
    }
  };

  // Aesthetic category translation
  const getCategoryLabel = (category: string) => {
    switch (category) {
      case 'Heritage':
        return '역사·문화 유산';
      case 'Nature':
        return '자연·성찰 숲경관';
      case 'Taste':
        return '미식·감성 베이커리';
      default:
        return category;
    }
  };

  // Dynamic branding tone based on active select zone
  const activeTheme = {
    bg: isDark ? 'bg-slate-950' : 'bg-white',
    cardBg: isDark 
      ? (selectedGu === 'DONGNAM' ? 'bg-slate-900/60' : 'bg-slate-900/40')
      : (selectedGu === 'DONGNAM' ? 'bg-[#FCFAF7]' : 'bg-[#FAFCFD]'),
    text: isDark ? 'text-slate-100' : 'text-slate-900',
    border: isDark 
      ? (selectedGu === 'DONGNAM' ? 'border-amber-900/30' : 'border-slate-800/80')
      : (selectedGu === 'DONGNAM' ? 'border-[#FAF0DF]' : 'border-slate-100'),
    titleFont: 'font-sans font-black',
  };

  return (
    <div className={`min-h-screen ${activeTheme.bg} ${activeTheme.text} transition-colors duration-1000 selection:bg-amber-300 selection:text-slate-900 pb-16`}>
      
      {/* Premium Sticky Navigation Bar */}
      <nav className={`sticky top-0 z-50 backdrop-blur-md px-6 md:px-12 py-4 shadow-sm transition-all border-b ${
        isDark ? 'bg-slate-950/90 border-slate-800/95 text-slate-100' : 'bg-white/90 border-slate-100/85 text-slate-900'
      }`}>
        <div className="max-w-[1600px] mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`w-9 h-9 rounded-xl flex items-center justify-center font-black shadow-sm ${
              isDark ? 'bg-cyan-500 text-slate-950 shadow-cyan-500/10' : 'bg-slate-900 text-white'
            }`}>
              <Compass className="w-5 h-5 text-amber-400 rotate-12" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className={`text-base font-black tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>천안city</span>
                <span className={`text-[9px] font-black px-1.5 py-0.5 rounded uppercase tracking-wider leading-none ${
                  isDark ? 'bg-cyan-950 text-cyan-400 border border-cyan-800/50' : 'bg-amber-100 text-amber-900'
                }`}>All-In-One Portal</span>
              </div>
              <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest leading-none mt-0.5">Cheonan Taste & Culture Hub</p>
            </div>
          </div>

          {/* Editorial Quick Nav Links */}
          <div className={`hidden md:flex items-center gap-6 text-xs font-black tracking-wide ${
            isDark ? 'text-slate-400' : 'text-slate-500'
          }`}>
            <a href="#spots" className={`transition-colors cursor-pointer flex items-center gap-1.5 ${isDark ? 'hover:text-cyan-400' : 'hover:text-slate-900'}`}>
              <Sparkles className="w-3.5 h-3.5 text-amber-600" />
              명소·맛집 탐색
            </a>
            <a href="#calendar" className={`transition-colors cursor-pointer flex items-center gap-1.5 ${isDark ? 'hover:text-cyan-400' : 'hover:text-slate-900'}`}>
              <CalendarCheck className="w-3.5 h-3.5 text-blue-600" />
              축제 캘린더
            </a>
            <a href="#planner" className={`transition-colors cursor-pointer flex items-center gap-1.5 ${isDark ? 'hover:text-cyan-400' : 'hover:text-slate-900'}`}>
              <Compass className="w-3.5 h-3.5 text-emerald-600" />
              추천 투어코스
            </a>
            <a href="#feedback" className={`transition-colors cursor-pointer flex items-center gap-1.5 ${isDark ? 'hover:text-cyan-400' : 'hover:text-slate-900'}`}>
              <MessageSquare className="w-3.5 h-3.5 text-purple-600" />
              방명록 및 소통
            </a>
            <a href="#console" className={`transition-colors cursor-pointer flex items-center gap-1.5 ${isDark ? 'hover:text-cyan-400' : 'hover:text-slate-900'}`}>
              <Layers className="w-3.5 h-3.5 text-cyan-600" />
              데이터 아키텍처
            </a>
          </div>

          {/* Quick Controls */}
          <div className="flex items-center gap-3">
            <span className="text-xs text-slate-400 font-mono font-bold uppercase tracking-widest hidden lg:inline">
              천안 로컬 시간: {currentTime.toLocaleDateString('ko-KR')}
            </span>

            {/* Persistent Dark Mode Toggle Button */}
            <button
              onClick={toggleDarkMode}
              className={`p-2 rounded-full cursor-pointer transition-all duration-300 border flex items-center justify-center ${
                isDark 
                  ? 'bg-slate-900 border-slate-800 text-cyan-400 hover:text-cyan-300 hover:bg-slate-800 shadow-sm shadow-cyan-400/5' 
                  : 'bg-slate-100 border-slate-200 text-slate-705 hover:text-amber-850 hover:bg-slate-200'
              }`}
              title={isDark ? '라이트 모드 테마로 전환' : '다크 모드 테마로 전환'}
              aria-label="Toggle Theme Mode"
            >
              {isDark ? (
                <Sun className="w-4 h-4 text-cyan-400 hover:rotate-45 transition-transform duration-500" />
              ) : (
                <Moon className="w-4 h-4 text-slate-600 hover:-rotate-12 transition-transform duration-500" />
              )}
            </button>

            <button 
              onClick={() => {
                setSelectedGu('ALL');
                setSelectedDistrictId(null);
                setSearchQuery('');
                setFestivalSearchQuery('');
              }}
              className={`rounded-full px-4 py-2 text-[10.5px] font-black tracking-widest uppercase transition-all shadow-sm hover:shadow cursor-pointer ${
                isDark
                  ? 'bg-cyan-950 hover:bg-cyan-900 border border-cyan-800/80 text-cyan-400'
                  : 'bg-slate-900 hover:bg-slate-800 text-white'
              }`}
            >
              필터 재설정
            </button>
          </div>
        </div>
      </nav>

      {/* Smart Seasonal Recommendation Banner */}
      {(() => {
        const currentMonth = currentTime.getMonth() + 1;
        const seasonalRec = getSeasonalRecommendation(currentMonth);
        const isActive = selectedFestivalId === seasonalRec.festivalId;
        return (
          <div className="max-w-[1600px] mx-auto px-6 md:px-12 pt-6">
            <div className={`p-4 sm:p-5 rounded-2xl border transition-all duration-300 flex flex-col md:flex-row md:items-center justify-between gap-4 ${seasonalRec.accentColor} shadow-sm`}>
              <div className="flex items-start gap-3.5">
                <span className="text-2xl sm:text-3xl p-1 bg-white dark:bg-slate-900 rounded-xl shadow-xs self-start sm:self-center shrink-0">
                  {seasonalRec.icon}
                </span>
                <div className="space-y-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className={`text-[9.5px] font-black uppercase tracking-widest px-2 py-0.5 rounded-md ${seasonalRec.badgeColor}`}>
                      {currentMonth}월 시즌 추천 명소 및 축제
                    </span>
                    <span className="text-[10px] text-slate-400 dark:text-slate-550 font-mono">Dynamic Recommendation Engine</span>
                  </div>
                  <h4 className="text-sm font-extrabold text-slate-950 dark:text-white leading-tight">
                    {seasonalRec.title}
                  </h4>
                  <p className="text-xs text-slate-650 dark:text-slate-400 leading-relaxed font-semibold max-w-4xl">
                    {seasonalRec.reason}
                  </p>
                </div>
              </div>
              <div className="shrink-0 flex items-center gap-2 self-end md:self-center">
                <button
                  onClick={() => {
                    if (isActive) {
                      setSelectedFestivalId(null);
                    } else {
                      setSelectedFestivalId(seasonalRec.festivalId);
                      document.getElementById('spots')?.scrollIntoView({ behavior: 'smooth' });
                    }
                  }}
                  className={`px-4.5 py-2.5 rounded-xl text-xs font-black tracking-wider uppercase transition-all flex items-center gap-1.5 cursor-pointer shadow-xs ${
                    isActive
                      ? 'bg-slate-900 text-white hover:bg-slate-800'
                      : 'bg-white border border-slate-200 text-slate-800 hover:bg-slate-50 hover:border-slate-300'
                  }`}
                >
                  {isActive ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-500 stroke-[3]" />
                      <span>추천 필터 적용됨 (해제하기)</span>
                    </>
                  ) : (
                    <>
                      <Compass className="w-3.5 h-3.5 text-amber-600 animate-pulse" />
                      <span>추천 명소 및 파트너 보기</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        );
      })()}

      {/* Editorial Hero Layout Block */}
      <header className="max-w-[1600px] mx-auto px-6 md:px-12 py-10 md:py-16">
        <div className="border-b border-slate-100 pb-10 md:pb-16">
          
          {/* Hero Content */}
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-50 rounded-full text-xs font-bold text-amber-900 border border-amber-200/50">
              <Sparkle className="w-3.5 h-3.5 text-amber-700 animate-spin" />
              <span className="tracking-widest uppercase text-[10px]">Cheonan Beautiful Curated Spatial Index</span>
            </div>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.15] text-slate-950 font-sans">
              천안의 깊이를 이해하다. <br />
              <span className="text-slate-400 font-serif font-light text-2xl md:text-3.5xl tracking-normal block mt-2">
                역사와 트렌디한 미식이 어우러지는 복합 문화 큐레이션 포털
              </span>
            </h1>

            <p className="text-sm md:text-base leading-relaxed font-medium text-slate-500 max-w-4xl">
              독립기념관의 웅장한 역사 숲길부터 불당동의 세련된 맛집, 성성호수공원의 맑은 수변 데크길까지 천안의 대표 명소를 한눈에 확인해 보세요. 시민과 여행자를 위해 엄선된 로컬 정보를 실시간으로 큐레이션해 드립니다.
            </p>

            {/* Quick stats tags overview */}
            <div className="flex flex-wrap gap-5 pt-2 text-xs font-bold text-slate-400">
              <span className="flex items-center gap-2 text-slate-600 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-150">
                <Compass className="w-4 h-4 text-amber-650" /> 총 {totalAestheticSpots}개 미학 명관
              </span>
              <span className="flex items-center gap-2 text-slate-600 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-150">
                <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" /> 로컬 대표 미식 벨트 수립
              </span>
              <span className="flex items-center gap-2 text-slate-600 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-150">
                <Calendar className="w-4 h-4 text-blue-500" /> 24/365 대축제 라인업 연계
              </span>
            </div>
          </div>

        </div>
      </header>

      {/* Core Bento Stats Infographics Area */}
      <BentoStats
        totalAestheticSpots={totalAestheticSpots}
        topRatedSpot={topRatedSpot}
        totalReviewsCount={totalReviewsCount}
      />

      {/* Main Exploration Screen Layout */}
      <main id="spots" className="max-w-[1600px] mx-auto px-4 md:px-12 grid grid-cols-1 lg:grid-cols-12 gap-5 lg:gap-8 mb-16 pb-[80px] md:pb-0">

        {/* LEFT PANEL: MAP & FILTERS (col-span-1) */}
        <div className={`lg:col-span-5 space-y-5 lg:space-y-8 ${mobileTab !== 'spots' ? 'block' : 'hidden lg:block'}`}>
          
          {/* Interactive Geo-Map */}
          <div className={mobileTab === 'map' ? 'block' : 'hidden lg:block'}>
          {(() => {
            const routeSpots = (selectedPresetIndex !== null && selectedPresetIndex >= 0)
              ? PRESET_COURSES[selectedPresetIndex].steps.map((step, idx) => {
                  const spot = spots.find(s => s.id === step.spotId);
                  return {
                    stepIndex: idx + 1,
                    spotName: step.spotName,
                    latitude: spot ? spot.latitude : 0,
                    longitude: spot ? spot.longitude : 0,
                    id: step.spotId,
                    guide: step.guide
                  };
                }).filter(s => s.latitude > 0)
              : selectedPresetIndex === -2
                ? [
                    // Step 1: Origin Point
                    (() => {
                      const originNameText = customOrigin === "직접 입력" ? (customOriginCustomText || "나의 출발지") : customOrigin;
                      const originCoords = getOriginCoords(originNameText);
                      return {
                        stepIndex: 1,
                        spotName: `출발지: ${originNameText}`,
                        latitude: originCoords.lat,
                        longitude: originCoords.lon,
                        id: -999,
                        guide: "이곳에서 나만의 소중한 천안 여행 일정이 개시됩니다!"
                      };
                    })(),
                    // Selected spots in order
                    ...customSelectedSpotIds.map((id, idx) => {
                      const spot = spots.find(s => s.id === id);
                      return {
                        stepIndex: idx + 2,
                        spotName: spot ? spot.spotName : '',
                        latitude: spot ? spot.latitude : 0,
                        longitude: spot ? spot.longitude : 0,
                        id: id,
                        guide: spot ? spot.curatorDescription : ''
                      };
                    })
                  ].filter(s => s.latitude > 0)
                : [];

            return (
              <CheonanMap
                districts={districts}
                selectedDistrictId={selectedDistrictId || null}
                onSelectDistrict={(id) => {
                  setSelectedDistrictId(id);
                  if (id) {
                    setMobileTab('spots');
                  }
                }}
                activeGu={selectedGu}
                spots={filteredSpots}
                routeSpots={routeSpots}
                isDark={isDark}
                selectedFestivalId={selectedFestivalId}
              />
            );
          })()}
          </div>

          {/* Core Search & Filters Controls */}
          <div className={mobileTab === 'spots' || mobileTab === 'map' ? 'block' : 'hidden lg:block'}>
          <div className={`transition-all duration-1000 rounded-3xl p-6 border shadow-xl space-y-6 ${activeTheme.cardBg} ${activeTheme.border}`}>
            <div className={`flex justify-between items-center pb-3 border-b ${isDark ? 'border-slate-800' : 'border-slate-100'}`}>
              <span className={`text-xs font-black uppercase tracking-widest ${isDark ? 'text-white' : 'text-slate-800'}`}>검색 및 세부 속성 필터</span>
              {(searchQuery || selectedCategory !== 'ALL' || selectedDistrictId) && (
                <button
                  onClick={handleResetFilters}
                  className={`text-[10px] font-black hover:underline flex items-center gap-1 cursor-pointer ${
                    isDark ? 'text-cyan-400' : 'text-amber-700'
                  }`}
                >
                  <RotateCcw className="w-2.5 h-2.5" /> 필터 초기화
                </button>
              )}
            </div>

            {/* Keyword Input */}
            <div className="space-y-2">
              <label className={`text-[10px] font-black uppercase tracking-widest ${isDark ? 'text-cyan-400/80' : 'text-slate-500'}`}>명소·태그 키워드 검색</label>
              <div className="relative">
                <Search className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="예: #지브리감성, #벚꽃길, 뚜쥬루, 불당동 등.."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className={`w-full pl-10 pr-4 py-2.5 text-xs rounded-2xl focus:outline-none focus:ring-2 font-medium transition-all duration-1000 ${
                    isDark 
                      ? 'bg-slate-950 border-slate-800 text-white focus:ring-cyan-500/50' 
                      : 'bg-slate-50 border-slate-200 text-slate-800 focus:ring-slate-300'
                  }`}
                />
              </div>
            </div>

            {/* Category Select Buttons */}
            <div className="space-y-2">
              <label className={`text-[10px] font-black uppercase tracking-widest block mb-1 ${isDark ? 'text-cyan-400/80' : 'text-slate-500'}`}>카테고리 분류</label>
              <div className="flex flex-wrap gap-1.5">
                {[
                  { key: 'ALL', label: '전체' },
                  { key: 'Heritage', label: '역사·문화 유산 🏛️' },
                  { key: 'Nature', label: '자연·공원 🌲' },
                  { key: 'Taste', label: '식도락·F&B ☕' }
                ].map((cat) => (
                  <button
                    key={cat.key}
                    onClick={() => setSelectedCategory(cat.key)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      selectedCategory === cat.key
                        ? (isDark ? 'bg-cyan-400 text-slate-950 font-black shadow-md shadow-cyan-400/10' : 'bg-slate-900 text-white')
                        : (isDark 
                            ? 'bg-[#1b273b] hover:bg-[#23334c] text-slate-300 border border-slate-800' 
                            : 'bg-slate-50 text-slate-600 border border-slate-200 hover:border-slate-400'
                          )
                    }`}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Notification alert info */}
            {selectedDistrictId && (
              <div className={`p-3.5 border rounded-xl text-xs font-semibold leading-relaxed transition-all duration-1000 ${
                isDark 
                  ? 'bg-cyan-950/20 border-cyan-800/40 text-cyan-300' 
                  : 'bg-amber-50 border-amber-100 text-[#8C7A5C]'
              }`}>
                📍 <strong>{districts.find(d => d.id === selectedDistrictId)?.subName}</strong> 구역의 명소가 매핑되었습니다. 지도의 흰 여백이나 '초기화' 버튼을 눌러 전체 영역으로 복귀해보세요.
              </div>
            )}
          </div>
          </div>

          {/* Cheonan Taste Festival & Collaboration Calendar */}
          <FestivalCalendar
            isDark={isDark}
            activeTheme={activeTheme}
            festivalSearchQuery={festivalSearchQuery}
            setFestivalSearchQuery={setFestivalSearchQuery}
            festSeason={festSeason}
            setFestSeason={setFestSeason}
            selectedFestivalId={selectedFestivalId}
            setSelectedFestivalId={setSelectedFestivalId}
            mobileTab={mobileTab}
          />

          {/* 천안시 코스 도우미 (Dynamic Detailed Course Assistant) */}
          <div className={mobileTab === 'planner' ? 'block' : 'hidden lg:block'}>
          <div id="planner" className={`scroll-mt-24 transition-all duration-1000 rounded-3xl p-6 border shadow-xl space-y-6 ${activeTheme.cardBg} ${activeTheme.border}`}>
            <div className="space-y-1">
              <div className="flex items-center gap-1.5 text-amber-800 font-extrabold text-[10px] tracking-widest uppercase dark:text-cyan-400">
                <Sparkles className="w-3.5 h-3.5 animate-pulse" />
                <span>Cheonan Course Helper Planner</span>
              </div>
              <h4 className={`text-xl font-extrabold tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>🧭 천안시 코스 도우미</h4>
              <p className={`text-[11px] leading-relaxed ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                천안의 명소와 축제를 분 단위의 섬세한 일정표로 기획해 드립니다. 
                아래 <strong>시간대 버튼들을 눌러 출발 시각을 변경</strong>하시면 전체 일정이 실시간으로 최적 지점 간 연산되어 재조정됩니다!
              </p>
            </div>

            {/* 출발 시간 선택 컨트롤러 */}
            <div className="space-y-2.5 p-4 rounded-2xl bg-slate-50/50 dark:bg-slate-950 border dark:border-slate-800/80 border-slate-200/50">
              <label className={`text-[10px] font-black uppercase tracking-widest block ${isDark ? 'text-cyan-400/80' : 'text-slate-500'}`}>
                🏃 원하는 출발 시각 설정 (전체 일정 자동 동기화)
              </label>
              <div className="flex flex-wrap gap-1.5">
                {[
                  { time: "09:00", label: "09:00 (아침 출발) ☀️" },
                  { time: "10:30", label: "10:30 (오전 한적한 소풍) 🌿" },
                  { time: "12:00", label: "12:00 (정오 출발) 🍔" },
                  { time: "13:30", label: "13:30 (오후 여유로운 투어) ☕" },
                  { time: "15:00", label: "15:00 (오후 늦은 야경 코스) 🌙" }
                ].map((item) => (
                  <button
                    key={item.time}
                    onClick={() => setCourseStartHour(item.time)}
                    className={`px-3 py-1.5 rounded-xl text-[10px] font-extrabold transition-all duration-300 cursor-pointer ${
                      courseStartHour === item.time
                        ? (isDark ? 'bg-cyan-400 text-slate-950 shadow-md shadow-cyan-400/20' : 'bg-slate-900 text-white')
                        : (isDark ? 'bg-slate-900 text-slate-400 border border-slate-800 hover:text-slate-200' : 'bg-white text-slate-600 border border-slate-200 hover:border-slate-450')
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            {/* 코스 모드 선택 탭 */}
            <div className="space-y-2">
              <label className={`text-[10px] font-black uppercase tracking-widest block ${isDark ? 'text-cyan-400/80' : 'text-slate-500'}`}>
                🗺️ 코스 모드 선택 또는 나만의 맞춤 설계 구성
              </label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {PRESET_COURSES.map((course, idx) => (
                  <button
                    key={course.id}
                    onClick={() => {
                      setSelectedPresetIndex(idx);
                      // Set corresponding default Gu filter automatically to sync with map visualizer!
                      if (course.gu !== 'ALL') {
                        setSelectedGu(course.gu);
                      }
                    }}
                    className={`p-3.5 rounded-2xl border text-left transition-all relative overflow-hidden group cursor-pointer ${
                      selectedPresetIndex === idx
                        ? (isDark ? 'bg-cyan-950/20 border-cyan-400 ring-1 ring-cyan-400/20' : 'bg-amber-50/50 border-amber-800/80 ring-1 ring-amber-800/10')
                        : (isDark ? 'bg-slate-950 border-slate-800/80 hover:border-slate-700' : 'bg-slate-50/50 border-slate-200 hover:border-slate-300')
                    }`}
                  >
                    <div className="flex justify-between items-center mb-1">
                      <span className={`text-[8.5px] font-black uppercase tracking-widest px-1.5 py-0.5 rounded ${
                        selectedPresetIndex === idx
                          ? (isDark ? 'bg-cyan-400 text-slate-950' : 'bg-amber-900 text-white')
                          : (isDark ? 'bg-slate-800 text-slate-400' : 'bg-slate-200 text-slate-700')
                      }`}>
                        PRESET {idx + 1}
                      </span>
                      <span className="text-[9.5px] font-semibold text-slate-450">구역: {course.gu === 'ALL' ? '천안통합' : course.gu === 'DONGNAM' ? '동남구' : '서북구'}</span>
                    </div>
                    <h5 className={`text-xs font-black leading-tight mb-1 ${isDark ? 'text-white' : 'text-slate-800'}`}>{course.title}</h5>
                    <p className="text-[10px] text-slate-400 leading-normal line-clamp-2">{course.vibe}</p>
                  </button>
                ))}

                {/* 🛣️ Live Custom Course Designer Button */}
                <button
                  onClick={() => setSelectedPresetIndex(-2)}
                  className={`p-3.5 rounded-2xl border text-left transition-all relative overflow-hidden flex flex-col justify-center cursor-pointer ${
                    selectedPresetIndex === -2
                      ? (isDark ? 'bg-cyan-950/25 border-cyan-400 ring-1 ring-cyan-400/20' : 'bg-amber-50/50 border-amber-800/80 ring-1 ring-amber-800/10')
                      : (isDark ? 'bg-slate-950 border-slate-800/80 hover:border-slate-700' : 'bg-slate-50/50 border-slate-200 hover:border-slate-300')
                  }`}
                >
                  <div className="flex items-center gap-1.5 text-amber-800 dark:text-cyan-300 font-extrabold text-[9px] uppercase tracking-widest mb-1">
                    <Compass className="w-3 h-3 text-amber-700 dark:text-cyan-400" />
                    <span>Live Interactive Custom Course</span>
                  </div>
                  <h5 className={`text-xs font-black leading-tight mb-1 ${isDark ? 'text-white' : 'text-slate-800'}`}>🛣️ 나만의 맞춤 코스 설계</h5>
                  <p className="text-[10px] text-slate-400 leading-normal">
                    출발지(어디서 왔는지)와 가고 싶은 명소를 직접 골라 지도 경로와 이동거리, 예상 시간표를 설계하세요.
                  </p>
                </button>
                
                {/* AI 커스텀 탭 카드 */}
                <button
                  onClick={() => setSelectedPresetIndex(-1)}
                  className={`p-3.5 rounded-2xl border text-left transition-all relative overflow-hidden flex flex-col justify-center cursor-pointer ${
                    selectedPresetIndex === -1
                      ? (isDark ? 'bg-cyan-950/25 border-cyan-400 ring-1 ring-cyan-400/20' : 'bg-amber-50/50 border-amber-800/80 ring-1 ring-amber-800/10')
                      : (isDark ? 'bg-slate-950 border-slate-800/80 hover:border-slate-700' : 'bg-slate-50/50 border-slate-200 hover:border-slate-300')
                  }`}
                >
                  <div className="flex items-center gap-1.5 text-amber-800 dark:text-cyan-300 font-extrabold text-[9px] uppercase tracking-widest mb-1">
                    <Sparkle className="w-3 h-3 animate-spin text-amber-700 dark:text-cyan-400" />
                    <span>AI Custom Curation Mode</span>
                  </div>
                  <h5 className={`text-xs font-black leading-tight mb-1 ${isDark ? 'text-white' : 'text-slate-800'}`}>🎨 나만의 AI 맞춤 시간표 제작</h5>
                  <p className="text-[10px] text-slate-400 leading-normal">
                    원하는 동선 테마나 성향을 직접 적으시면 Gemini가 이보다 더 세세한 시간대별 일정을 실시간 처방합니다.
                  </p>
                </button>
              </div>
            </div>

            {/* 세부 타임라인 타임 테이블 렌더러 */}
            <div className="pt-2">
              <AnimatePresence mode="wait">
                {selectedPresetIndex !== null && selectedPresetIndex >= 0 ? (
                  <motion.div
                    key={`preset-course-${selectedPresetIndex}-${courseStartHour}`}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="space-y-4"
                  >
                    {/* 코스 헤더 */}
                    <div className="p-4 rounded-2xl border bg-slate-50/20 border-dashed dark:border-slate-800 border-slate-200/65 space-y-1.5">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <span className={`text-[9.5px] font-black uppercase px-2 py-0.5 rounded-md ${
                          isDark ? 'bg-cyan-400/15 text-cyan-300' : 'bg-amber-100 text-amber-950'
                        }`}>
                          {PRESET_COURSES[selectedPresetIndex].gu === 'ALL' ? '천안시 맛객 종합 투어' : `${PRESET_COURSES[selectedPresetIndex].gu === 'DONGNAM' ? '동남구 앤틱 헤리티지' : '서북구 얼반 센트럴'} 코스`}
                        </span>
                        <div className="text-[10px] text-slate-450 font-bold flex items-center gap-1">
                          <Clock className="w-3 h-3 text-slate-400" /> 첫 출발 설정: {courseStartHour}
                        </div>
                      </div>
                      <p className={`text-[11px] leading-relaxed font-semibold ${isDark ? 'text-slate-350' : 'text-slate-700'}`}>
                        💡 <strong>코스 감성 컨셉:</strong> {PRESET_COURSES[selectedPresetIndex].vibe}
                      </p>
                    </div>

                    {/* 세세한 타임라인 목록 */}
                    <div className="relative pl-6 border-l border-slate-200/50 dark:border-slate-800 ml-3.5 space-y-6">
                      {PRESET_COURSES[selectedPresetIndex].steps.map((step, sIdx) => {
                        const times = getStepTimes(PRESET_COURSES[selectedPresetIndex!], courseStartHour, step.baseStartOffset, step.duration);
                        return (
                          <motion.div
                            key={sIdx}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: sIdx * 0.08 }}
                            className="relative group animate-fade-in"
                          >
                            {/* 타임라인 노드 불릿 */}
                            <span className={`absolute -left-9.5 top-1.5 w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-black ring-4 border transition-all ${
                              isDark 
                                ? 'bg-slate-950 border-slate-800 ring-slate-900 group-hover:border-cyan-400 text-cyan-400' 
                                : 'bg-white border-slate-300 ring-slate-100 group-hover:border-amber-800 text-amber-900'
                            }`}>
                              {sIdx + 1}
                            </span>

                            <div className="space-y-1 text-left">
                              {/* 시간대 및 연계 버튼 */}
                              <div className="flex flex-wrap items-center justify-between gap-2">
                                <span className="text-xs font-black text-slate-800 dark:text-cyan-400 tracking-tight flex items-center gap-1">
                                  <Clock className="w-3 h-3 text-slate-400" /> {times.start} ~ {times.end}
                                  <span className="text-[10px] font-medium text-slate-400">({step.duration}분간 체류)</span>
                                </span>
                                
                                <button
                                  onClick={() => {
                                    // Search this spot in the list
                                    setSearchQuery(step.spotName.replace(/(점심 식사:|식사:|간식:)/g, '').trim());
                                    // Also clear gu filters if needed to make spot visualizer discover it
                                    if (PRESET_COURSES[selectedPresetIndex!].gu !== 'ALL') {
                                      setSelectedGu(PRESET_COURSES[selectedPresetIndex!].gu);
                                    } else {
                                      setSelectedGu('ALL');
                                    }
                                    setMobileTab('spots');
                                  }}
                                  className={`text-[9px] font-black flex items-center gap-1 px-2 py-0.5 rounded border cursor-pointer hover:scale-105 transition-all ${
                                    isDark 
                                      ? 'bg-slate-950 border-slate-800 text-slate-400 hover:border-cyan-400 hover:text-cyan-400' 
                                      : 'bg-white border-slate-200 text-slate-500 hover:border-amber-800 hover:text-amber-900'
                                  }`}
                                >
                                  <MapPin className="w-2.5 h-2.5 text-red-500" /> 상세 정보 발견 🧭
                                </button>
                              </div>

                              {/* 장소 타이틀 */}
                              <h5 className={`text-sm font-black tracking-tight leading-snug ${isDark ? 'text-white' : 'text-slate-850'}`}>
                                {step.spotName}
                              </h5>

                              {/* 정교한 활동지침 */}
                              <p className={`text-[11px] leading-relaxed font-medium pb-1 ${isDark ? 'text-slate-350' : 'text-slate-600'}`}>
                                {step.guide}
                              </p>
                            </div>
                          </motion.div>
                        );
                      })}
                    </div>
                  </motion.div>
                ) : selectedPresetIndex === -2 ? (
                  <motion.div
                    key="live-custom-designer"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="space-y-4 text-left font-sans"
                  >
                    {/* 출발지 선택 (어디서 왔는지) */}
                    <div className="p-4 rounded-2xl bg-slate-50/50 dark:bg-slate-950 border dark:border-slate-850/80 border-slate-200/50 space-y-3">
                      <div className="space-y-1">
                        <label className={`text-[10px] font-black uppercase tracking-widest block ${isDark ? 'text-cyan-400' : 'text-amber-900'}`}>
                          🚗 1단계: 어디서 오셨나요? (출발지 설정)
                        </label>
                        <p className="text-[10px] text-slate-400 leading-relaxed">
                          천안역, KTX역, 혹은 고속도로 IC 중 내가 왔거나 도착할 예정인 관문을 설정해 보세요.
                        </p>
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        {[
                          "🚉 천안역 (1호선)",
                          "🚉 KTX 천안아산역",
                          "🚌 천안종합터미널",
                          "🚗 경부고속도로 천안IC",
                          "직접 입력"
                        ].map((originOption) => (
                          <button
                            key={originOption}
                            type="button"
                            onClick={() => {
                              setCustomOrigin(originOption);
                              if (originOption !== "직접 입력") {
                                setCustomOriginCustomText("");
                              }
                            }}
                            className={`px-3 py-2 text-xs font-bold rounded-xl border text-center transition-all cursor-pointer ${
                              customOrigin === originOption
                                ? (isDark ? 'bg-cyan-950/40 border-cyan-400 text-cyan-300' : 'bg-amber-100/60 border-amber-850 text-amber-950')
                                : (isDark ? 'bg-slate-900 border-slate-800 text-slate-400' : 'bg-white border-slate-200 text-slate-600')
                            }`}
                          >
                            {originOption}
                          </button>
                        ))}
                      </div>

                      {customOrigin === "직접 입력" && (
                        <div className="space-y-1 pt-1">
                          <input
                            type="text"
                            value={customOriginCustomText}
                            onChange={(e) => setCustomOriginCustomText(e.target.value)}
                            placeholder="직접 출발지 이름을 입력하세요 (예: 수원역, 독립기념관 광장)"
                            className={`w-full p-2.5 text-xs rounded-xl focus:outline-none focus:ring-1 font-medium transition-all ${
                              isDark 
                                ? 'bg-slate-900 border-slate-800 text-white focus:ring-cyan-400 font-sans' 
                                : 'bg-white border-slate-200 text-slate-800 focus:ring-slate-350 font-sans'
                            }`}
                          />
                        </div>
                      )}
                    </div>

                    {/* 가고 싶은 장소 선택 (어떤 부분을 가고 싶은지) */}
                    <div className="p-4 rounded-2xl bg-slate-50/50 dark:bg-slate-950 border dark:border-slate-850/80 border-slate-200/50 space-y-3">
                      <div className="space-y-1">
                        <label className={`text-[10px] font-black uppercase tracking-widest block ${isDark ? 'text-cyan-400' : 'text-amber-900'}`}>
                          🗺️ 2단계: 가고 싶은 명소들을 골라주세요!
                        </label>
                        <p className="text-[10px] text-slate-400 leading-relaxed">
                          선택하시는 순서대로 동선 시간표가 자동 산출되며 지도 위에 연결 선이 실시간으로 갱신됩니다! (클릭하여 끄고 켤 수 있습니다)
                        </p>
                      </div>

                      {/* Chosen Spot list in order badge */}
                      {customSelectedSpotIds.length > 0 && (
                        <div className="p-3 bg-white dark:bg-slate-900 rounded-xl border dark:border-slate-800/80 border-slate-200/60">
                          <span className="text-[9px] font-black text-slate-400 uppercase block mb-1">나의 선택 여정 시퀀스:</span>
                          <div className="flex flex-wrap items-center gap-1.5 text-[10px] font-bold">
                            <span className="text-amber-950 dark:text-cyan-450">
                              🏁 출발지: {customOrigin === "직접 입력" ? (customOriginCustomText || "나의 출발지") : customOrigin}
                            </span>
                            {customSelectedSpotIds.map((id, sIdx) => {
                              const s = spots.find(sp => sp.id === id);
                              return (
                                <React.Fragment key={id}>
                                  <ChevronRight className="w-3 h-3 text-slate-450 shrink-0" />
                                  <span className="bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-md flex items-center gap-1 shrink-0">
                                    <span className="text-[9px] font-black text-amber-700 dark:text-cyan-400">{sIdx + 1}</span>
                                    {s ? s.spotName : `스팟 ${id}`}
                                  </span>
                                </React.Fragment>
                              );
                            })}
                          </div>
                        </div>
                      )}

                      {/* Spot toggle pool grouped by Admin zone */}
                      <div className="space-y-3 max-h-[220px] overflow-y-auto pr-1">
                        {["DONGNAM", "SEOBUK"].map((zone) => (
                          <div key={zone} className="space-y-1.5">
                            <span className="text-[9px] font-black text-slate-400 tracking-wider block uppercase mt-1">
                              {zone === "DONGNAM" ? "🪵 동남구 감성 헤리티지 명소" : "⚡ 서북구 세련된 도시 명소"}
                            </span>
                            <div className="flex flex-wrap gap-1.5">
                              {spots.filter(sp => districts.find(d => d.id === sp.districtId)?.gu === zone).map((sp) => {
                                const isSelected = customSelectedSpotIds.includes(sp.id);
                                const clickIndex = customSelectedSpotIds.indexOf(sp.id);
                                return (
                                  <button
                                    key={sp.id}
                                    type="button"
                                    onClick={() => {
                                      if (isSelected) {
                                        setCustomSelectedSpotIds(prev => prev.filter(id => id !== sp.id));
                                      } else {
                                        setCustomSelectedSpotIds(prev => [...prev, sp.id]);
                                      }
                                    }}
                                    className={`px-2.5 py-1.5 rounded-xl text-[10.5px] font-extrabold transition-all border flex items-center gap-1.5 cursor-pointer ${
                                      isSelected
                                        ? (isDark 
                                            ? 'bg-cyan-950/45 border-cyan-400 text-cyan-300' 
                                            : 'bg-amber-100/60 border-amber-850 text-amber-950'
                                          )
                                        : (isDark ? 'bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700' : 'bg-white border-slate-200 text-slate-600 hover:border-slate-350')
                                    }`}
                                  >
                                    {isSelected && (
                                      <span className="w-4 h-4 rounded-full bg-amber-950 text-white dark:bg-cyan-400 dark:text-slate-950 flex items-center justify-center text-[9px] font-black shrink-0">
                                        {clickIndex + 1}
                                      </span>
                                    )}
                                    <span>{sp.spotName}</span>
                                    <span className="text-[9px] text-amber-800 font-bold shrink-0">★ {sp.ratingRaw}</span>
                                  </button>
                                );
                              })}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* 실시간 시간표 및 연산 데이터 뷰어 */}
                    {customSelectedSpotIds.length === 0 ? (
                      <div className="p-4 rounded-2xl border border-dashed border-slate-200 dark:border-slate-800 text-center text-xs text-slate-400">
                        가고 싶은 명소를 1개 이상 골라주시면 예상 시간표와 동선 통계가 실시간 연산됩니다.
                      </div>
                    ) : (
                      <div className="space-y-4 font-sans">
                        {/* 연산 결과 대시보드 */}
                        {(() => {
                          const startText = customOrigin === "직접 입력" ? (customOriginCustomText || "나의 출발지") : customOrigin;
                          const startCoords = getOriginCoords(startText);
                          
                          let currentLat = startCoords.lat;
                          let currentLon = startCoords.lon;
                          let totalDist = 0;

                          const timedSteps = customSelectedSpotIds.map((id, index) => {
                            const sp = spots.find(spot => spot.id === id);
                            if (!sp) return null;
                            
                            // Calculate distance from previous point
                            const dist = getDistance(currentLat, currentLon, sp.latitude, sp.longitude);
                            totalDist += dist;
                            
                            // update coordinate
                            currentLat = sp.latitude;
                            currentLon = sp.longitude;

                            // Estimate stay time based on category
                            const stay = sp.category === "Taste" ? 70 : sp.category === "Heritage" ? 85 : 90;
                            return {
                              spot: sp,
                              distanceFromPrev: dist,
                              stayDuration: stay
                            };
                          }).filter(Boolean);

                          // Build timeline
                          let currentMinutes = (() => {
                            const [h, m] = courseStartHour.split(':').map(Number);
                            return h * 60 + m;
                          })();

                          const formatMinutesToHour = (min: number) => {
                            const adjusted = (min + 1440) % 1440;
                            const h = Math.floor(adjusted / 60);
                            const m = adjusted % 60;
                            const period = h < 12 ? '오전' : '오후';
                            const displayH = h === 0 ? 12 : h > 12 ? h - 12 : h;
                            return `${period} ${String(displayH).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
                          };

                          return (
                            <div className="space-y-4">
                              <div className="p-4 rounded-2xl border bg-slate-50/20 border-dashed dark:border-slate-800 border-slate-200/65 flex flex-wrap items-center justify-between gap-3 text-xs">
                                <div>
                                  <span className="text-[10px] text-slate-400 font-bold block">나만의 맞춤 코스 종합 요약</span>
                                  <span className="font-extrabold text-slate-900 dark:text-white">
                                    총 {timedSteps.length + 1}개 지점 연산 경로
                                  </span>
                                </div>
                                <div className="flex gap-4">
                                  <div>
                                    <span className="text-[9px] text-slate-400 block font-bold">누적 이동거리</span>
                                    <span className="font-mono text-xs font-black text-amber-900 dark:text-cyan-400">
                                      {totalDist.toFixed(1)} km
                                    </span>
                                  </div>
                                  <div>
                                    <span className="text-[9px] text-slate-400 block font-bold">소요 차량 시간</span>
                                    <span className="font-mono text-xs font-black text-amber-900 dark:text-cyan-400">
                                      약 {Math.round(totalDist * 1.8 + timedSteps.length * 5)}분
                                    </span>
                                  </div>
                                </div>
                              </div>

                              {/* Timeline list */}
                              <div className="relative pl-6 border-l border-slate-200/50 dark:border-slate-800 ml-3.5 space-y-6">
                                {/* Departure node */}
                                <div className="relative group text-xs text-left">
                                  <span className="absolute -left-9.5 top-1 w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-black ring-4 border bg-amber-900 text-white dark:bg-cyan-400 dark:text-slate-950">
                                    출발
                                  </span>
                                  <div className="space-y-0.5">
                                    <span className="font-black text-slate-400 font-mono block uppercase text-[9px]">
                                      START AT {courseStartHour}
                                    </span>
                                    <h5 className="text-sm font-black text-slate-900 dark:text-white">
                                      🏁 {startText}
                                    </h5>
                                    <p className="text-[10.5px] text-slate-500 font-medium">
                                      설레는 나만의 천안 탐방길을 이곳에서 엽니다. 안전 운전 및 이동하세요!
                                    </p>
                                  </div>
                                </div>

                                {timedSteps.map((stepData, idx) => {
                                  if (!stepData) return null;
                                  
                                  // add travel time (estimated at 2 mins per km, min 10 mins)
                                  const travelTime = Math.max(10, Math.round(stepData.distanceFromPrev * 1.8));
                                  currentMinutes += travelTime;
                                  const arrivalTimeStr = formatMinutesToHour(currentMinutes);
                                  
                                  const stay = stepData.stayDuration;
                                  currentMinutes += stay;
                                  const departureTimeStr = formatMinutesToHour(currentMinutes);

                                  return (
                                    <div key={idx} className="relative group text-xs text-left animate-fade-in">
                                      <span className="absolute -left-9.5 top-1.5 w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-black ring-4 border bg-white dark:bg-slate-950 border-slate-300 dark:border-slate-800 text-amber-900 dark:text-cyan-400">
                                        {idx + 1}
                                      </span>

                                      <div className="space-y-0.5">
                                        <div className="flex flex-wrap items-center justify-between gap-1">
                                          <span className="text-xs font-black text-slate-800 dark:text-cyan-400 tracking-tight flex items-center gap-1">
                                            <Clock className="w-3 h-3 text-slate-400" /> {arrivalTimeStr} ~ {departureTimeStr}
                                            <span className="text-[10px] font-medium text-slate-400">({stay}분간 체류)</span>
                                          </span>
                                          <span className="text-[9.5px] font-mono text-slate-400 font-bold bg-slate-100 dark:bg-slate-900 px-1.5 py-0.5 rounded-md">
                                            이전 지점으로부터 {stepData.distanceFromPrev.toFixed(1)}km (+차량 약 {travelTime}분)
                                          </span>
                                        </div>

                                        <h5 className="text-sm font-black text-slate-900 dark:text-white flex items-center gap-1">
                                          {stepData.spot.spotName}
                                          <span className="text-xs text-amber-850 font-black">★ {stepData.spot.ratingRaw}</span>
                                        </h5>

                                        <p className="text-[11px] leading-relaxed text-slate-600 dark:text-slate-350 pb-1 font-medium">
                                          {stepData.spot.curatorDescription}
                                        </p>
                                      </div>
                                    </div>
                                  );
                                })}
                              </div>
                            </div>
                          );
                        })()}
                      </div>
                    )}
                  </motion.div>
                ) : (
                  // AI 커스텀 모드
                  <motion.div
                    key="custom-ai"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="space-y-4"
                  >
                    <form onSubmit={handleGenerateCuration} className="space-y-3 bg-slate-50/50 dark:bg-slate-950 border dark:border-slate-850 p-4 rounded-2xl text-left">
                      <div className="space-y-1">
                        <label className={`text-[10px] font-black uppercase tracking-widest block ${isDark ? 'text-cyan-400/80' : 'text-slate-500'}`}>
                          ✍️ 내가 꿈꾸는 코스의 희망 조건 (예: 인원구성, 날씨, 취향 등)
                        </label>
                        <p className="text-[10px] text-slate-400 leading-relaxed">
                          원하는 테마를 입력하면 "천안시 코스 도우미"가 시간대별 출발지 및 미학 지수를 계산한 최상의 순례길을 세세하게 기획해 줍니다.
                        </p>
                      </div>

                      <div className="relative">
                        <textarea
                          rows={3}
                          value={userPrompt}
                          onChange={(e) => setUserPrompt(e.target.value)}
                          placeholder="예: 부모님을 모시고 걷기 무난하면서 든든한 물갈비/순대국밥이 포함된 여정, 비 내리는 초여름 수변 데크길과 카페 투어를 짜 줘"
                          className={`w-full p-3 text-xs rounded-xl focus:outline-none focus:ring-2 font-medium transition-all ${
                            isDark 
                              ? 'bg-slate-900 border-slate-800 text-white focus:ring-cyan-400/30 font-sans' 
                              : 'bg-white border-slate-200 text-slate-800 focus:ring-slate-300 font-sans'
                          }`}
                        />
                      </div>

                      <button
                        type="submit"
                        disabled={curationLoading || !userPrompt.trim()}
                        className={`w-full py-2.5 text-xs font-black rounded-xl cursor-pointer flex items-center justify-center gap-1.5 transition-all ${
                          curationLoading
                            ? 'bg-slate-700 text-slate-400 cursor-not-allowed'
                            : (isDark 
                                ? 'bg-cyan-400 hover:bg-cyan-500 text-slate-950 shadow-md shadow-cyan-400/10' 
                                : 'bg-slate-900 hover:bg-slate-950 text-white'
                              )
                        }`}
                      >
                        {curationLoading ? (
                          <>
                            <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                            지능형 실시간 일정 조율 중...
                          </>
                        ) : (
                          <>
                            <Sparkles className="w-3.5 h-3.5" />
                            하루 감성 가이드 시간표 추출 시작하기 ✨
                          </>
                        )}
                      </button>
                    </form>

                    {/* AI Curation Results */}
                    {aiCuration && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={`p-4 rounded-2xl border text-xs text-left leading-relaxed space-y-3 font-medium ${
                          isDark 
                            ? 'bg-slate-900 border-slate-800 text-slate-300' 
                            : 'bg-slate-50/50 border-slate-200 text-slate-700'
                        }`}
                      >
                        <CurationRenderer text={aiCuration} />
                      </motion.div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
          </div>
        </div>

        {/* RIGHT PANEL: CURATED SPOTS LIST (col-span-7) */}
        <div className={`lg:col-span-7 space-y-6 ${mobileTab === 'spots' ? 'block' : 'hidden lg:block'}`}>
          <div className={`flex justify-between items-center pb-2 border-b transition-colors duration-1000 ${isDark ? 'border-slate-800' : 'border-slate-200'}`}>
            <h3 className={`text-lg font-black tracking-tight transition-colors duration-1000 ${isDark ? 'text-white' : 'text-slate-800'}`}>
              {selectedDistrictId 
                ? `${districts.find(d => d.id === selectedDistrictId)?.subName} 큐레이션`
                : selectedGu === 'ALL' ? '천안city' : `${selectedGu === 'DONGNAM' ? '동남구 앤틱' : '서북구 얼반'} 큐레이션`
              }
              <span className="text-xs text-slate-400 ml-2 font-light">({filteredSpots.length}곳 발견)</span>
            </h3>
            
            <div className="text-[10px] text-slate-400 font-mono font-bold uppercase tracking-wider">
              ESTIMATED BY BAYESIAN FORMULA
            </div>
          </div>

          <div className="space-y-4">
            {selectedNearbySpotId !== null && (() => {
              const originSpot = spotsWithScores.find(s => s.id === selectedNearbySpotId);
              return (
                <motion.div
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`p-4 rounded-xl border flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs leading-relaxed ${
                    isDark
                      ? 'bg-[#121f33] border-slate-800 text-slate-300'
                      : 'bg-amber-50/50 border-amber-200/55 p-4.5 rounded-xl text-slate-700'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <span className="text-base animate-pulse">📍</span>
                    <div>
                      <span className="font-extrabold text-slate-950 dark:text-white">[{originSpot?.spotName}]</span> 기준
                      <span className="font-bold text-amber-900 dark:text-cyan-400 ml-1">반경 2km 이내</span>의 추천 명소 필터링 중
                    </div>
                  </div>
                  <button
                    onClick={() => setSelectedNearbySpotId(null)}
                    className={`px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-wider transition-all self-end sm:self-center cursor-pointer border ${
                      isDark
                        ? 'bg-cyan-950/40 border-cyan-800 text-cyan-300 hover:bg-cyan-900/50'
                        : 'bg-white border-slate-200 text-slate-800 hover:bg-slate-50'
                    }`}
                  >
                    필터 해제 ✕
                  </button>
                </motion.div>
              );
            })()}

            {/* Highly Polished Editorial Category Tabs */}
            <div className={`flex flex-wrap gap-1.5 pb-3 border-b ${isDark ? 'border-slate-800/80' : 'border-slate-100'}`}>
              {[
                { key: 'ALL', label: '전체보기', icon: '🌐' },
                { key: 'Taste', label: '식도락·F&B', icon: '☕' },
                { key: 'Nature', label: '자연·공원', icon: '🌲' },
                { key: 'Heritage', label: '역사·유산', icon: '🏛️' }
              ].map((cat) => {
                const active = selectedCategory === cat.key;
                return (
                  <button
                    key={cat.key}
                    onClick={() => setSelectedCategory(cat.key)}
                    className={`px-3 py-1.5 rounded-full text-[10.5px] font-black transition-all flex items-center gap-1.5 border shadow-sm cursor-pointer ${
                      active
                        ? (isDark 
                            ? 'bg-cyan-400 border-cyan-400 text-slate-950 font-black shadow-md shadow-cyan-400/20' 
                            : 'bg-slate-900 border-slate-900 text-white font-black'
                          )
                        : (isDark 
                            ? 'bg-[#121f33] border-slate-800 text-slate-450 hover:text-slate-200' 
                            : 'bg-white border-slate-200 text-slate-505 hover:border-slate-350 hover:bg-slate-50 text-slate-600'
                          )
                    }`}
                  >
                    <span className="text-xs">{cat.icon}</span>
                    <span>{cat.label}</span>
                  </button>
                );
              })}
            </div>

            <AnimatePresence mode="popLayout">
              {filteredSpots.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {filteredSpots.map((spot) => {
                    const district = districts.find(d => d.id === spot.districtId);
                    const isExpanded = expandedSpotId === spot.id;

                    return (
                      <motion.div
                        layout
                        key={spot.id}
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.98 }}
                        transition={{ duration: 0.35, ease: 'easeOut' }}
                        className={`group rounded-2xl border transition-all duration-300 overflow-hidden flex flex-col justify-between ${activeTheme.cardBg} ${activeTheme.border} ${selectedGu === 'SEOBUK' ? 'shadow-lg shadow-cyan-950/5' : 'shadow-sm hover:shadow-md hover:border-slate-200/80 bg-white'}`}
                      >
                      {/* Compact content layout without images */}
                      <div className="p-6 space-y-4">
                        
                        {/* Tags & Zone Indicator + Rating Header */}
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-3.5 border-b border-slate-100 dark:border-slate-900/60">
                          <div className="flex flex-wrap items-center gap-1.5">
                            <span className={`text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-0.5 rounded-full ${
                              district?.gu === 'DONGNAM' ? 'bg-[#FAF5EE] text-[#8C7A5C]' : 'bg-[#18314F] text-[#00E8C6]'
                            }`}>
                              📍 {district?.gu === 'DONGNAM' ? '동남구' : '서북구'} {district?.subName}
                            </span>
                            <span className={`text-[10px] px-2.5 py-0.5 rounded-full font-bold ${
                              selectedGu === 'SEOBUK' ? 'bg-[#1E2E44] text-slate-300' : 'bg-slate-50 text-slate-550 border border-slate-100'
                            }`}>
                              {getCategoryLabel(spot.category)}
                            </span>

                            {/* Distance Indicator badge relative to current center */}
                            {selectedNearbySpotId !== null && selectedNearbySpotId !== spot.id && (() => {
                              const originSpot = spotsWithScores.find(s => s.id === selectedNearbySpotId);
                              if (originSpot) {
                                const dist = getDistance(originSpot.latitude, originSpot.longitude, spot.latitude, spot.longitude);
                                const distStr = dist < 1 ? `${Math.round(dist * 1000)}m` : `${dist.toFixed(2)}km`;
                                return (
                                  <span className={`text-[10px] px-2.5 py-0.5 rounded-full font-black animate-pulse flex items-center gap-1 ${
                                    isDark ? 'bg-cyan-950/40 text-cyan-300 border border-cyan-800/40' : 'bg-amber-100 text-amber-950 border border-amber-200'
                                  }`}>
                                    ⚡ {distStr} 인근
                                  </span>
                                );
                              }
                              return null;
                            })()}

                            {/* Origin reference badge */}
                            {selectedNearbySpotId === spot.id && (
                              <span className={`text-[10px] px-2.5 py-0.5 rounded-full font-black flex items-center gap-1 ${
                                isDark ? 'bg-cyan-400 text-slate-950 font-black' : 'bg-slate-900 text-amber-400 font-extrabold border border-slate-950'
                              }`}>
                                🎯 탐색 기준점
                              </span>
                            )}
                          </div>

                          {/* Aesthetic Gauge Score with simple layout */}
                          <div className="flex items-center gap-1.5">
                            <span className="text-[9px] text-slate-400 font-bold uppercase tracking-widest">Aesthetic Index</span>
                            <div className="flex items-center text-amber-500 font-extrabold bg-amber-50 px-2 py-0.5 rounded border border-amber-100">
                              <Star className="w-3.5 h-3.5 fill-amber-550 text-amber-550 mr-1" />
                              <span className={`text-xs font-black font-mono tracking-tight ${selectedGu === 'SEOBUK' ? 'text-cyan-400' : 'text-amber-800'}`}>
                                {spot.score.toFixed(2)}
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Spot Title & Main Curator Spotlight */}
                        <div className="space-y-3">
                          <h4 className={`text-base sm:text-lg font-extrabold tracking-tight ${
                            selectedGu === 'SEOBUK' ? 'text-white' : 'text-slate-950'
                          }`}>
                            {spot.spotName}
                          </h4>

                          {/* Refined "추천 이유" Boxed Feature */}
                          <div className={`p-4 rounded-xl border transition-colors ${
                            selectedGu === 'SEOBUK' 
                              ? 'bg-slate-950/40 border-slate-800/80 text-slate-350' 
                              : 'bg-slate-50/50 border-slate-200/40 text-slate-650'
                          }`}>
                            <div className="flex items-center gap-1.5 mb-1.5">
                              <span className={`text-[10px] font-bold uppercase tracking-wider block ${
                                selectedGu === 'SEOBUK' ? 'text-cyan-400' : 'text-amber-900/80'
                              }`}>
                                ✨ 추천 이유
                              </span>
                            </div>
                            <p className="text-xs font-medium leading-relaxed">
                              {spot.curatorDescription}
                            </p>
                          </div>
                        </div>

                        {/* Interactive Area: Hot tags & Reviews control */}
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pt-1">
                          {/* Hot tags line */}
                          <div className="flex flex-wrap gap-1">
                            {spot.mzTags.map(tag => (
                              <span key={tag} className={`text-[9.5px] rounded-lg px-2 py-0.5 transition-colors font-bold ${
                                selectedGu === 'SEOBUK' 
                                  ? 'text-cyan-300 bg-cyan-950/10 border border-cyan-900/30' 
                                  : 'text-amber-900 bg-amber-50/30 border border-amber-100/50'
                              }`}>
                                {tag}
                              </span>
                            ))}
                          </div>

                          {/* Interaction control button group */}
                          <div className="flex items-center gap-2.5 self-start sm:self-center">
                            {/* Find Nearby Button */}
                            <button
                              onClick={() => {
                                if (selectedNearbySpotId === spot.id) {
                                  setSelectedNearbySpotId(null);
                                } else {
                                  setSelectedNearbySpotId(spot.id);
                                  document.getElementById('spots')?.scrollIntoView({ behavior: 'smooth' });
                                }
                              }}
                              className={`text-[10px] font-black px-2.5 py-1.5 rounded-xl transition-all flex items-center gap-1.5 cursor-pointer border ${
                                selectedNearbySpotId === spot.id
                                  ? (isDark
                                      ? 'bg-cyan-400 text-slate-950 border-cyan-400 font-extrabold shadow-md shadow-cyan-400/20'
                                      : 'bg-slate-900 text-white border-slate-900 font-extrabold'
                                    )
                                  : (isDark
                                      ? 'bg-slate-900 border-slate-800 text-cyan-400 hover:text-cyan-300 hover:border-slate-700'
                                      : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-[#FAF5EE] hover:border-amber-205 hover:text-amber-950'
                                    )
                              }`}
                            >
                              <Compass className={`w-3.5 h-3.5 ${selectedNearbySpotId === spot.id ? 'animate-spin' : ''}`} />
                              <span>{selectedNearbySpotId === spot.id ? '전체 해제' : '주변 2km 찾기'}</span>
                            </button>

                            {/* Visitor Review section expander */}
                            <button
                              onClick={() => setExpandedSpotId(isExpanded ? null : spot.id)}
                              className={`text-[10.5px] font-black hover:underline flex items-center gap-1 cursor-pointer transition-colors ${
                                selectedGu === 'SEOBUK' ? 'text-cyan-400 hover:text-cyan-300' : 'text-slate-700 hover:text-slate-900'
                              }`}
                            >
                              {isExpanded ? (
                                <>
                                  <span>후기 접기</span>
                                  <ChevronUp className="w-3.5 h-3.5" />
                                </>
                              ) : (
                                <>
                                  <span>후기 ({((spot.customReviews?.length || 0) + (spot.reviewsCount > 5 ? 3 : 0))}개)</span>
                                  <ChevronDown className="w-3.5 h-3.5" />
                                </>
                              )}
                            </button>
                          </div>
                        </div>

                      </div>

                      {/* Expanded Review Drawer */}
                      <AnimatePresence>
                        {isExpanded && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.3 }}
                            className={`border-t overflow-hidden transition-all duration-1000 ${isDark ? 'bg-[#090f1d]/50 border-slate-850' : 'bg-slate-50/50 border-slate-100'}`}
                          >
                            <div className="p-6 sm:p-8 space-y-6">
                              <SpotSurroundingView
                                spotName={spot.spotName}
                                latitude={spot.latitude}
                                longitude={spot.longitude}
                                isDark={isDark}
                              />
                              <div className={`h-[1px] w-full ${isDark ? 'bg-slate-800/80': 'bg-slate-200/50'}`}></div>
                              <ReviewSection
                                spot={spot}
                                onReviewAdded={handleReviewAdded}
                                isDark={isDark}
                              />
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>

                    </motion.div>
                  );
                })}
                </div>
              ) : (
                <div className={`p-12 text-center border rounded-3xl space-y-4 transition-all duration-1000 ${
                  isDark ? 'bg-[#121F33] border-slate-800' : 'bg-white border-slate-200/50 rounded-3xl'
                }`}>
                  <div className={`font-black ${isDark ? 'text-cyan-400' : 'text-slate-500'}`}>해당하는 미학 탐색처가 없습니다 🗺️</div>
                  <p className={`text-xs leading-relaxed max-w-md mx-auto ${isDark ? 'text-slate-350' : 'text-slate-400'}`}>
                    검색어나 카테고리 필터를 변경하거나, 천안 전역 지도를 클릭하여 다시 탐색해 보세요.
                  </p>
                  <button
                    onClick={handleResetFilters}
                    className={`font-bold text-xs px-4 py-2 rounded-full cursor-pointer transition-all ${
                      isDark ? 'bg-cyan-400 text-slate-950 hover:bg-cyan-300' : 'bg-slate-900 text-white'
                    }`}
                  >
                    전체 필터 초기화
                  </button>
                </div>
              )}
            </AnimatePresence>
          </div>
        </div>

      </main>

      {/* Portal Complete Usage & Interactive Guide Center */}
      <section id="feedback" className="max-w-[1600px] mx-auto px-6 md:px-12 mt-16 scroll-mt-24">
        <div className="bg-slate-50 border border-slate-200/60 rounded-3xl p-8 sm:p-10 space-y-8">
          <div className="space-y-2 text-center max-w-2xl mx-auto">
            <span className="text-[10px] font-black bg-amber-100 text-amber-900 px-2.5 py-1 rounded-full uppercase tracking-widest inline-block animate-pulse">
              User Guide Hub
            </span>
            <h3 className="myeongjo-title text-2xl md:text-3xl font-extrabold text-slate-900 leading-tight">
              천안식객 포털 완벽 활용 가이드
            </h3>
            <p className="text-xs md:text-sm font-semibold text-slate-500 leading-relaxed">
              본 웹사이트는 천안시 맛과 멋의 생태계를 편리하게 탐구할 수 있도록 유기적으로 설계된 종합 관광 플랫폼입니다.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white p-6 rounded-2xl border border-slate-200/50 space-y-3 shadow-sm hover:shadow-md transition-all">
              <div className="w-8 h-8 rounded-full bg-amber-50 flex items-center justify-center text-amber-900 font-black text-xs">
                01
              </div>
              <h5 className="font-extrabold text-sm text-slate-900">원하는 구역 선택하기</h5>
              <p className="text-[11px] text-slate-500 leading-relaxed font-semibold">
                동남구와 서북구를 클릭하여 지도를 전환하세요. 동남구의 아날로그한 단풍길과 서북구의 현대적인 카페거리 속에서 완벽한 명소를 찾을 수 있습니다.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200/50 space-y-3 shadow-sm hover:shadow-md transition-all">
              <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center text-blue-900 font-black text-xs">
                02
              </div>
              <h5 className="font-extrabold text-sm text-slate-900">시즌별 로컬 축제 연계</h5>
              <p className="text-[11px] text-slate-500 leading-relaxed font-semibold">
                축제 캘린더에서 가을 배축제나 아우내 봉화제를 자유롭게 클릭하세요. 해당 축제와 긴밀히 연계된 청년 미식 맛집 벨트가 지도 우측에 자동 매핑됩니다.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200/50 space-y-3 shadow-sm hover:shadow-md transition-all">
              <div className="w-8 h-8 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-900 font-black text-xs">
                03
              </div>
              <h5 className="font-extrabold text-sm text-slate-900">실시간 AI 코스 플래너</h5>
              <p className="text-[11px] text-slate-500 leading-relaxed font-semibold">
                상상하던 어떤 아이디어든 한국어로 묘사하세요. AI 모델이 현재 설정하신 출발 시각을 정밀 연산하여 막힘없는 순례길 코스를 설계합니다.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200/50 space-y-3 shadow-sm hover:shadow-md transition-all">
              <div className="w-8 h-8 rounded-full bg-purple-50 flex items-center justify-center text-purple-900 font-black text-xs">
                04
              </div>
              <h5 className="font-extrabold text-sm text-slate-900">익명 방명록 및 고백</h5>
              <p className="text-[11px] text-slate-500 leading-relaxed font-semibold">
                각 명소 하단의 "방문자 리뷰 및 감상평 보기" 서랍을 열어, 실시간 닉네임과 별점으로 먼저 다녀간 식객들의 진정성 품은 기록에 동참해 보세요.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Full Technology Infrastructure Console integration */}
      <section id="console" className="max-w-[1600px] mx-auto px-6 md:px-12 mt-16 scroll-mt-24">
        <InfrastructureConsole />
      </section>

      {/* Narrative Editorial Footer & Cheonan Identity Map */}
      <footer className={`max-w-[1600px] mx-auto px-6 md:px-12 mt-16 pb-16 border-t border-dashed pt-16 space-y-12 transition-all duration-1000 ${
        isDark ? 'border-slate-850' : 'border-slate-300'
      }`}>
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
          
          <div className="md:col-span-5 space-y-4">
            <h4 className={`text-xl font-bold myeongjo-title transition-all duration-1000 ${
              isDark ? 'text-cyan-400' : 'text-amber-900'
            }`}>빵의 도시 천안 & 맛과 멋의 생태계</h4>
            <p className={`text-xs leading-relaxed font-semibold transition-all duration-1000 ${
              isDark ? 'text-slate-350' : 'text-slate-500'
            }`}>
              천안시는 매년 가을 "빵빵데이" 축제를 성대하게 개최하는 대한민국 유일무이 제빵의 고장입니다. 
              국내 최대 빵 테마파크인 구룡동 <strong>'뚜쥬루 빵돌가마마을'</strong>은 가마솥에서 팥을 직접 끓이고 유기농 장작으로 구워내는 원초적 장인의 산실이며, 
              안서동 태조산 아래 첫 독립서점 <strong>'책방 허송세월'</strong>, 감성 한옥 <strong>'풍세커피'</strong>와 융합되어 천안 로컬 청년 창업 생태계의 중심을 구축하고 있습니다.
            </p>
          </div>

          <div className="md:col-span-4 space-y-4">
            <h4 className={`text-xl font-bold myeongjo-title transition-all duration-1000 ${
              isDark ? 'text-cyan-400' : 'text-amber-900'
            }`}>아라리오 현대조각의 세계적 성지</h4>
            <p className={`text-xs leading-relaxed font-semibold transition-all duration-1000 ${
              isDark ? 'text-slate-350' : 'text-slate-500'
            }`}>
              독일 예술 전문지 Art에서 "세계 미술 지도에 반드시 기록해야 할 보물"로 격찬한 신부동의 <strong>아라리오 조각광장</strong>. 
              데미안 허스트의 대리석 대작 '찬가'와 '채러티', 키스 해링의 역동작인 '줄리아', 수보드 굽타의 '통제선' 등 수백억 가치를 지닌 역사적 걸작들이 시민들과 터미널 앞 담장 없는 평화로운 공간에서 숨 쉬며 감상할 수 있는 독보적인 축복을 제공합니다.
            </p>
          </div>

          <div className="md:col-span-3 space-y-4">
            <h4 className={`text-lg font-black transition-all duration-1000 ${
              isDark ? 'text-cyan-400' : 'text-slate-800'
            }`}>공식 관광명소 천안 8경</h4>
            <ul className={`text-xs space-y-1 font-semibold leading-relaxed transition-all duration-1000 ${
              isDark ? 'text-slate-400' : 'text-slate-500'
            }`}>
              <li>• 1경: 독립기념관 (단풍나무 숲길)</li>
              <li>• 2경: 유관순열사 사적지</li>
              <li>• 3경: 천안삼거리 공원</li>
              <li>• 4경: 태조산 왕건길과 각원사</li>
              <li>• 5경: 아라리오 조각광장</li>
              <li>• 6경: 성성호수공원</li>
              <li>• 7경: 광덕산 자연경관</li>
              <li>• 8경: 국보 제7호 봉선홍경사 갈기비</li>
            </ul>
          </div>

        </div>

        <div className={`border-t pt-8 flex flex-col sm:flex-row justify-between items-center text-[11px] text-slate-400 gap-4 transition-all duration-1000 ${
          isDark ? 'border-slate-850' : 'border-slate-200'
        }`}>
          <div>
            <span>© 2026 Mijeok Cheonan Spatial Curation Map. Developed under server-side Gemini 3.5-Flash.</span>
          </div>
          <div className="flex gap-4">
            <span className="hover:underline cursor-pointer">이용약관</span>
            <span className="hover:underline cursor-pointer">개인정보처리방침</span>
            <span className="hover:underline cursor-pointer">천안시청 공식 바로가기</span>
          </div>
        </div>
      </footer>

      {/* Premium Floating Mobile Bottom Navigation Island */}
      <div className="fixed bottom-4 left-4 right-4 z-50 md:hidden bg-white/85 dark:bg-slate-900/85 backdrop-blur-xl border border-slate-200/50 dark:border-slate-800/60 rounded-2xl shadow-2xl flex justify-around items-center py-2 px-1 transition-all duration-300">
        {[
          { id: 'spots', label: '명소 탐색', icon: Sparkles, color: 'text-amber-500 dark:text-cyan-400' },
          { id: 'map', label: '지형 지도', icon: MapPin, color: 'text-red-500' },
          { id: 'calendar', label: '축제 일정', icon: CalendarCheck, color: 'text-blue-500' },
          { id: 'planner', label: '코스 설계', icon: Compass, color: 'text-emerald-500' }
        ].map((tab) => {
          const IconComponent = tab.icon;
          const isActive = mobileTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => {
                setMobileTab(tab.id as any);
                const el = document.getElementById('spots');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
              className="flex-1 flex flex-col items-center justify-center py-1 px-2.5 rounded-xl transition-all duration-300 gap-1 cursor-pointer"
            >
              <div className={`p-1.5 rounded-full transition-all duration-300 ${
                isActive 
                  ? (isDark ? 'bg-cyan-950/40' : 'bg-slate-100') 
                  : 'bg-transparent'
              }`}>
                <IconComponent className={`w-5 h-5 ${
                  isActive ? tab.color : 'text-slate-400 dark:text-slate-500'
                }`} />
              </div>
              <span className={`text-[9.5px] font-black tracking-tight transition-all duration-300 ${
                isActive 
                  ? (isDark ? 'text-cyan-400' : 'text-slate-900') 
                  : 'text-slate-400 dark:text-slate-500'
              }`}>
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>

    </div>
  );
}
