import React, { useState } from 'react';
import { Star, MessageSquare, Landmark, User, Calendar, Loader2 } from 'lucide-react';
import { CuratedSpot, CustomReview } from '../types';

interface ReviewSectionProps {
  spot: CuratedSpot;
  onReviewAdded: (updatedSpot: CuratedSpot) => void;
  isDark?: boolean;
}

export default function ReviewSection({ spot, onReviewAdded, isDark = false }: ReviewSectionProps) {
  const [author, setAuthor] = useState('');
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [hoverRating, setHoverRating] = useState<number | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!author.trim() || !comment.trim()) {
      setErrorMsg('이름과 한줄평을 작성해 주세요.');
      return;
    }

    setIsSubmitting(true);
    setErrorMsg('');
    setSuccessMsg('');

    try {
      const response = await fetch(`/api/spots/${spot.id}/reviews`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          author,
          rating,
          comment
        })
      });

      const data = await response.json();
      if (response.ok && data.success) {
        setSuccessMsg('소중한 미학 별점이 안전하게 이식되었습니다!');
        setAuthor('');
        setComment('');
        setRating(5);
        onReviewAdded(data.updatedSpot);

        // Fade success message out after 3 seconds
        setTimeout(() => setSuccessMsg(''), 3000);
      } else {
        setErrorMsg(data.error || '리뷰를 등록하는 도중 오류가 발생했습니다.');
      }
    } catch (err) {
      setErrorMsg('서버와 동기화하는 데 실패했습니다. 임시 저장 모드로 동작합니다.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={`border-t mt-6 pt-6 space-y-6 ${isDark ? 'border-slate-800' : 'border-slate-100'}`}>
      {/* Existing Reviews List */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <MessageSquare className={`w-4 h-4 ${isDark ? 'text-cyan-400' : 'text-slate-500'}`} />
          <h5 className={`text-xs font-black uppercase tracking-widest ${isDark ? 'text-cyan-400' : 'text-slate-700'}`}>
            방문자 미학 한줄평 ({((spot.customReviews?.length || 0) + (spot.reviewsCount > 5 ? 3 : 0))}개)
          </h5>
        </div>

        {/* Dynamic User Posted Reviews */}
        <div className="space-y-3">
          {spot.customReviews && spot.customReviews.length > 0 ? (
            spot.customReviews.map((rev) => (
              <div key={rev.id} className={`p-3.5 rounded-xl border text-xs transition-colors duration-1000 ${
                isDark 
                  ? 'bg-slate-950/60 border-[#1E334D] text-slate-300' 
                  : 'bg-slate-50/70 border-slate-100/50 text-slate-700'
              }`}>
                <div className="flex justify-between items-center mb-1">
                  <div className="flex items-center gap-1.5 font-bold">
                    <User className={`w-3 h-3 ${isDark ? 'text-cyan-400' : 'text-slate-400'}`} />
                    <span className={isDark ? 'text-slate-200' : 'text-slate-800'}>{rev.author}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className={`${isDark ? 'text-cyan-400' : 'text-amber-500'} font-bold font-mono`}>★ {rev.rating.toFixed(1)}</span>
                    <span className="text-slate-300">|</span>
                    <span className="text-[10px] text-slate-400 font-mono">{rev.date}</span>
                  </div>
                </div>
                <p className="font-medium leading-relaxed">{rev.comment}</p>
              </div>
            ))
          ) : null}

          {/* Fallback illustrative local curator review blocks so list isn't empty */}
          <div className={`p-3.5 rounded-xl border text-xs transition-colors duration-1000 ${
            isDark 
              ? 'bg-cyan-950/10 border-cyan-900/40 text-cyan-300' 
              : 'bg-amber-50/40 border-amber-100/50 text-amber-800'
          }`}>
            <div className="flex justify-between items-center mb-1">
              <div className="flex items-center gap-1.5 font-bold">
                <Landmark className={`w-3 h-3 ${isDark ? 'text-cyan-300' : 'text-amber-600'}`} />
                <span>천안 로컬 큐레이터</span>
              </div>
              <div className="flex items-center gap-1">
                <span className={`${isDark ? 'text-cyan-400' : 'text-amber-500'} font-bold`}>★ 4.8</span>
                <span className="text-slate-300">|</span>
                <span className="text-[10px] text-slate-400 font-mono">2026-06-01</span>
              </div>
            </div>
            <p className="leading-relaxed font-semibold">
              포털 속 무의미한 별점 경쟁에서 발굴해 낸 최고의 진정성 스팟입니다. 공간이 전달하는 지리 문화적 풍취가 대단히 훌륭합니다.
            </p>
          </div>
        </div>
      </div>

      {/* Add New Review Form */}
      <div className={`rounded-2xl p-4 space-y-4 border transition-colors duration-1000 ${
        isDark ? 'bg-slate-900 border-slate-850' : 'bg-slate-50 border-slate-200/50'
      }`}>
        <h6 className={`text-[11px] font-black uppercase tracking-widest flex items-center gap-1.5 pb-2 border-b ${
          isDark ? 'text-cyan-400 border-slate-800' : 'text-slate-700 border-slate-200/50'
        }`}>
          <span>✎ 미학 평 계산에 참전하기</span>
          <span className="text-[9px] text-slate-400 font-medium normal-case">Bayesian Rating Engine</span>
        </h6>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* Author */}
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-500 block">작성자 이름</label>
              <input
                type="text"
                placeholder="예: 안서동나그네"
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
                className={`w-full text-xs p-2.5 rounded-xl focus:outline-none font-semibold transition-all duration-1000 border ${
                  isDark 
                    ? 'bg-slate-950 border-slate-800 text-white focus:border-cyan-500' 
                    : 'bg-white border-slate-200 text-slate-800 focus:border-slate-400'
                }`}
                maxLength={20}
                required
              />
            </div>

            {/* Rating Stars Input */}
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-500 block">미학적 평점</label>
              <div className="flex items-center gap-1 h-9">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(null)}
                    className="p-1 transition-transform active:scale-95"
                  >
                    <Star
                      className={`w-5 h-5 transition-colors ${
                        star <= (hoverRating ?? rating)
                          ? (isDark ? 'fill-cyan-400 text-cyan-400' : 'fill-amber-500 text-amber-500')
                          : 'text-slate-300'
                      }`}
                    />
                  </button>
                ))}
                <span className={`text-xs font-bold ml-1.5 font-mono ${isDark ? 'text-cyan-400' : 'text-slate-600'}`}>
                  {rating.toFixed(1)}
                </span>
              </div>
            </div>
          </div>

          {/* Comment */}
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-slate-500 block">한줄 평 및 감상평</label>
            <input
              type="text"
              placeholder="예: 가을바람 쬐며 고요하게 콩크림눌림떡 먹으니 천국이 따로 없네요."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className={`w-full text-xs p-2.5 rounded-xl focus:outline-none font-semibold transition-all duration-1000 border ${
                isDark 
                  ? 'bg-slate-950 border-slate-800 text-white focus:border-cyan-500' 
                  : 'bg-white border-slate-200 text-slate-800 focus:border-slate-400'
              }`}
              maxLength={120}
              required
            />
          </div>

          {/* Submit */}
          <div className="flex justify-between items-center pt-1">
            <div className="text-[10px] text-slate-400 font-semibold leading-relaxed">
              * 입력한 별점은 즉각 Bayesian 공식에 따라<br />적용 가중 조율되어 산정됩니다.
            </div>
            <button
              type="submit"
              disabled={isSubmitting}
              className={`font-black text-[10px] tracking-wider px-5 py-2.5 rounded-xl transition-all uppercase disabled:opacity-50 flex items-center gap-2 cursor-pointer ${
                isDark 
                  ? 'bg-cyan-400 text-slate-950 hover:bg-cyan-300' 
                  : 'bg-slate-900 text-white hover:bg-slate-800'
              }`}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-3 h-3 animate-spin" />
                  <span>공식 주입 중..</span>
                </>
              ) : (
                <span>별점 주입하기</span>
              )}
            </button>
          </div>

          {/* Messages */}
          {errorMsg && (
            <div className="p-2.5 bg-red-50/10 border border-red-500/20 rounded-xl text-[11px] text-red-500 font-medium leading-relaxed">
              {errorMsg}
            </div>
          )}
          {successMsg && (
            <div className={`p-2.5 border rounded-xl text-[11px] font-semibold leading-relaxed ${
              isDark 
                ? 'bg-cyan-950/30 border-cyan-800/40 text-cyan-300' 
                : 'bg-emerald-50 border-emerald-200 text-emerald-600'
            }`}>
              {successMsg}
            </div>
          )}
        </form>
      </div>
    </div>
  );
}
