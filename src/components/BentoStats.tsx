import React from 'react';
import { Compass, Star, MessageSquare } from 'lucide-react';
import { CuratedSpot } from '../types';

interface BentoStatsProps {
  totalAestheticSpots: number;
  topRatedSpot: any;
  totalReviewsCount: number;
}

export default function BentoStats({
  totalAestheticSpots,
  topRatedSpot,
  totalReviewsCount
}: BentoStatsProps) {
  return (
    <section className="max-w-[1600px] mx-auto px-6 md:px-12 grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-6 mb-10 md:mb-16">
      {/* Stat 1 */}
      <div className="bg-white border border-slate-200/55 p-6 rounded-2xl flex items-center justify-between shadow-sm hover:shadow transition-all duration-300">
        <div>
          <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 block mb-1">총 엄선 미학 명소</span>
          <span className="text-3xl font-black tracking-tighter text-slate-900">{totalAestheticSpots} 스팟 개방</span>
        </div>
        <div className="p-3.5 bg-slate-50 text-slate-600 rounded-xl">
          <Compass className="w-5 h-5 text-amber-700" />
        </div>
      </div>

      {/* Stat 2 */}
      <div className="bg-white border border-slate-200/55 p-6 rounded-2xl flex items-center justify-between shadow-sm hover:shadow transition-all duration-300">
        <div>
          <span className="text-[10px] font-black uppercase tracking-widest text-[#8C7A5C] block mb-1">최고 평점 미학처</span>
          <span className="text-sm font-black block truncate max-w-[180px] text-slate-800">
            {topRatedSpot ? topRatedSpot.spotName : '뚜쥬루 빵돌가마'}
          </span>
          <span className="text-xs font-black text-amber-800">★ {topRatedSpot ? topRatedSpot.score.toFixed(2) : '4.80'}점</span>
        </div>
        <div className="p-3.5 bg-amber-50 text-amber-700 rounded-xl">
          <Star className="w-5 h-5 fill-amber-500 text-amber-500" />
        </div>
      </div>

      {/* Stat 3 */}
      <div className="bg-white border border-slate-200/55 p-6 rounded-2xl flex items-center justify-between shadow-sm hover:shadow transition-all duration-300">
        <div>
          <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 block mb-1">누적 종합 참전 리뷰</span>
          <span className="text-3xl font-black tracking-tighter text-slate-900">{totalReviewsCount.toLocaleString()}개 누적</span>
        </div>
        <div className="p-3.5 bg-slate-50 text-slate-600 rounded-xl">
          <MessageSquare className="w-5 h-5" />
        </div>
      </div>
    </section>
  );
}
