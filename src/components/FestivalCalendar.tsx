import React from 'react';
import { motion } from 'motion/react';
import { CalendarCheck, Search, Clock, MapPin } from 'lucide-react';
import { FESTIVAL_EVENTS } from '../data';

interface FestivalCalendarProps {
  isDark: boolean;
  activeTheme: {
    cardBg: string;
    border: string;
  };
  festivalSearchQuery: string;
  setFestivalSearchQuery: (q: string) => void;
  festSeason: 'ALL' | 'spring' | 'summer' | 'autumn' | 'always';
  setFestSeason: (s: 'ALL' | 'spring' | 'summer' | 'autumn' | 'always') => void;
  selectedFestivalId: string | null;
  setSelectedFestivalId: (id: string | null) => void;
  mobileTab: string;
}

export default function FestivalCalendar({
  isDark,
  activeTheme,
  festivalSearchQuery,
  setFestivalSearchQuery,
  festSeason,
  setFestSeason,
  selectedFestivalId,
  setSelectedFestivalId,
  mobileTab
}: FestivalCalendarProps) {
  return (
    <div className={mobileTab === 'calendar' ? 'block' : 'hidden lg:block'}>
      <div id="calendar" className={`scroll-mt-24 transition-all duration-1000 rounded-3xl p-6 border shadow-xl space-y-6 ${activeTheme.cardBg} ${activeTheme.border}`}>
        <div className="space-y-1">
          <div className="flex items-center gap-1.5 text-amber-800 font-extrabold text-[10px] tracking-widest uppercase dark:text-cyan-400">
            <CalendarCheck className="w-3.5 h-3.5" />
            <span>Cheonan Taste Festival Calendar</span>
          </div>
          <h4 className={`text-xl font-extrabold tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>천안시 캘린더</h4>
          <p className={`text-[11px] leading-relaxed ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
            천안시의 날짜별 주요 행사 및 상생 협업 일정을 확인할 수 있는 달력입니다. **원하는 축제를 클릭**하면 연계된 맛집들이 우측 탐색처 목록에 자동 정렬 및 필터링됩니다!
          </p>
        </div>

        {/* Search Festivals Input Field */}
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <label className={`text-[10px] font-black uppercase tracking-widest block ${isDark ? 'text-cyan-400/80' : 'text-slate-500'}`}>
              🔍 축제 및 행사 통합 검색
            </label>
            {festivalSearchQuery && (
              <button
                onClick={() => setFestivalSearchQuery('')}
                className={`text-[9px] font-black hover:underline cursor-pointer ${isDark ? 'text-cyan-400' : 'text-amber-800'}`}
              >
                검색 초기화
              </button>
            )}
          </div>
          <div className="relative">
            <Search className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="예: '봉화제', '빵빵데이', '가을' 또는 '체험' 등으로 검색..."
              value={festivalSearchQuery}
              onChange={(e) => setFestivalSearchQuery(e.target.value)}
              className={`w-full pl-10 pr-4 py-2.5 text-xs rounded-2xl focus:outline-none focus:ring-2 font-medium transition-all ${
                isDark 
                  ? 'bg-slate-950 border-slate-800 text-white focus:ring-cyan-500/50 font-sans' 
                  : 'bg-slate-50 border-slate-200 text-slate-800 focus:ring-slate-300 font-sans'
              }`}
            />
          </div>
        </div>

        {/* Season Filtering Tabs */}
        <div className="flex flex-wrap gap-1 border-b pb-3 dark:border-slate-800 border-slate-150">
          {[
            { key: 'ALL', label: '전체 시즌' },
            { key: 'spring', label: '봄 (2~4월) 🌸' },
            { key: 'summer', label: '초여름 (5~6월) 🥐' },
            { key: 'autumn', label: '가을 (9~10월) 🍁' },
            { key: 'always', label: '상시 예술 🎨' }
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => {
                setFestSeason(tab.key as any);
                if (tab.key !== 'ALL') {
                  const active = FESTIVAL_EVENTS.find(f => f.id === selectedFestivalId);
                  if (active && active.season !== tab.key) {
                    setSelectedFestivalId(null);
                  }
                }
              }}
              className={`px-2.5 py-1 rounded-lg text-[10px] font-bold transition-all cursor-pointer ${
                festSeason === tab.key
                  ? (isDark ? 'bg-cyan-400 text-slate-950 font-black' : 'bg-amber-900 text-white')
                  : (isDark 
                      ? 'bg-slate-950 hover:bg-slate-900 text-slate-400 border border-slate-800' 
                      : 'bg-slate-50 hover:bg-slate-100 text-slate-600 border border-slate-200'
                    )
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Interactive Timeline List */}
        <div className="space-y-4 max-h-[460px] overflow-y-auto pr-1 scrollbar-thin">
          {(() => {
            const filteredFestivals = FESTIVAL_EVENTS.filter((event) => {
              const matchesSeasonTab = festSeason === 'ALL' || event.season === festSeason;
              const query = festivalSearchQuery.trim().toLowerCase();
              if (!query) return matchesSeasonTab;

              const matchesQuery =
                event.title.toLowerCase().includes(query) ||
                event.description.toLowerCase().includes(query) ||
                event.features.toLowerCase().includes(query) ||
                event.seasonLabel.toLowerCase().includes(query) ||
                event.period.toLowerCase().includes(query) ||
                event.location.toLowerCase().includes(query) ||
                event.partners.some(p => p.toLowerCase().includes(query)) ||
                (query === '봄' && event.season === 'spring') ||
                (query === '여름' && event.season === 'summer') ||
                (query === '초여름' && event.season === 'summer') ||
                (query === '가을' && event.season === 'autumn') ||
                (query === '상시' && event.season === 'always');

              return matchesSeasonTab && matchesQuery;
            });

            if (filteredFestivals.length === 0) {
              return (
                <div className="py-12 text-center space-y-2">
                  <p className={`text-xs font-semibold ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                    🔍 일치하는 축제 및 행사 일정이 없습니다.
                  </p>
                  <button
                    onClick={() => {
                      setFestivalSearchQuery('');
                      setFestSeason('ALL');
                    }}
                    className={`text-[10px] font-bold hover:underline cursor-pointer ${isDark ? 'text-cyan-400' : 'text-amber-800'}`}
                  >
                    필터 전체 초기화
                  </button>
                </div>
              );
            }

            return filteredFestivals.map((event) => {
              const isSelected = selectedFestivalId === event.id;
              return (
                <motion.div
                  key={event.id}
                  layoutId={`fest-${event.id}`}
                  onClick={() => {
                    if (isSelected) {
                      setSelectedFestivalId(null);
                    } else {
                      setSelectedFestivalId(event.id);
                    }
                  }}
                  className={`p-4 rounded-2xl border text-left cursor-pointer transition-all ${
                    isSelected
                      ? (isDark 
                          ? 'bg-cyan-950/40 border-cyan-400/80 ring-1 ring-cyan-400/30' 
                          : 'bg-amber-50/75 border-amber-900 ring-1 ring-amber-900/10'
                        )
                      : (isDark 
                          ? 'bg-slate-950 hover:bg-[#131f35]/50 border-slate-800' 
                          : 'bg-slate-50/50 hover:bg-slate-100/50 border-slate-200'
                        )
                  }`}
                >
                  <div className="flex justify-between items-start gap-2">
                    <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-md ${
                      isSelected 
                        ? (isDark ? 'bg-cyan-400 text-slate-950' : 'bg-amber-900 text-white')
                        : (isDark ? 'bg-slate-850 text-slate-350' : 'bg-slate-200 text-slate-700')
                    }`}>
                      {event.period}
                    </span>
                    <span className="text-[10px] font-semibold text-slate-400 flex items-center gap-1">
                      <Clock className="w-2.5 h-2.5" /> {event.date}
                    </span>
                  </div>

                  <h5 className={`text-sm font-extrabold mt-2 leading-snug ${
                    isSelected
                      ? (isDark ? 'text-cyan-400' : 'text-amber-950')
                      : (isDark ? 'text-white' : 'text-slate-850')
                  }`}>
                    {event.title}
                  </h5>

                  <p className={`text-[11px] leading-relaxed mt-1.5 font-medium ${isDark ? 'text-slate-350' : 'text-slate-600'}`}>
                    {event.description}
                  </p>

                  <div className={`mt-2 p-2.5 rounded-xl text-[10px] leading-relaxed font-semibold ${
                    isDark ? 'bg-[#0f192b]/60 text-slate-300' : 'bg-white/80 border border-slate-100 text-slate-700'
                  }`}>
                    💡 <strong>축제특징 / 동업 상생:</strong> {event.features}
                  </div>

                  {isSelected && (
                    <div className="mt-3 pt-3 border-t border-dashed border-slate-200 dark:border-slate-800 space-y-2.5">
                      <div className={`p-2.5 rounded-xl text-[10px] leading-relaxed ${
                        isDark ? 'bg-red-950/20 text-red-350 border border-red-900/35' : 'bg-red-50/50 text-red-900 border border-red-100'
                      }`}>
                        ⚠️ <strong>축제 주의사항 / 단점:</strong> {event.drawbacks}
                      </div>
                      
                      <div className={`p-2.5 rounded-xl text-[10px] leading-relaxed ${
                        isDark ? 'bg-emerald-950/20 text-emerald-350 border border-emerald-900/35' : 'bg-emerald-50/50 text-emerald-900 border border-emerald-100'
                      }`}>
                        🚗 <strong>주차 현황 및 대책:</strong> {event.parkingInfo}
                      </div>

                      <div className={`p-2.5 rounded-xl text-[10px] leading-relaxed ${
                        isDark ? 'bg-[#0a1424]/60 text-slate-300 border border-slate-850' : 'bg-slate-100/60 text-slate-700 border border-slate-150'
                      }`}>
                        🧭 <strong>내비게이션 및 추천 경로:</strong> {event.navigationPath}
                      </div>
                    </div>
                  )}

                  <div className="mt-3 space-y-1.5">
                    <span className={`text-[9px] font-black uppercase tracking-wider block ${
                      isDark ? 'text-cyan-400/85' : 'text-slate-400'
                    }`}>
                      📍 연계 로컬 미식 및 청년 창업 벨트:
                    </span>
                    <div className="flex flex-wrap gap-1">
                      {event.partners.map((partner, pidx) => (
                        <span
                          key={pidx}
                          className={`text-[9px] font-extrabold px-2 py-0.5 rounded-md ${
                            isSelected
                              ? (isDark ? 'bg-cyan-400/20 text-cyan-300 border border-cyan-400/30' : 'bg-amber-900/10 text-amber-950 border border-amber-900/20')
                              : (isDark ? 'bg-slate-900 text-slate-400 border border-slate-800' : 'bg-white text-slate-600 border border-slate-200')
                          }`}
                        >
                          {partner}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="mt-3 pt-2 border-t border-dashed dark:border-slate-800 border-slate-200 flex justify-between items-center">
                    <span className={`text-[9.5px] font-extrabold flex items-center gap-1 ${
                      isSelected 
                        ? (isDark ? 'text-cyan-400' : 'text-amber-900') 
                        : 'text-slate-400'
                    }`}>
                      <MapPin className="w-3 h-3" /> {event.location}
                    </span>
                    <span className={`text-[9.5px] font-black hover:underline cursor-pointer ${
                      isSelected 
                        ? (isDark ? 'text-cyan-400 font-extrabold' : 'text-amber-900') 
                        : 'text-slate-400'
                    }`}>
                      {isSelected ? '연계 맛집 매핑 취소 ↩' : '연계 맛집 매핑하기 📍'}
                    </span>
                  </div>

                </motion.div>
              );
            });
          })()}
        </div>
      </div>
    </div>
  );
}
