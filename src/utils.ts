import { CuratedSpot, FestivalEvent, PresetCourse } from './types';

const MIN_REVIEWS_THRESHOLD = 20; // CONSTANT 'm'
const AVERAGE_GLOBAL_RATING = 4.15; // CONSTANT 'C'
const MZ_TAG_WEIGHT_COEFFICIENT = 0.05; // CONSTANT 'w' or 'omega'

export function calculateAestheticScore(spot: CuratedSpot): number {
  const customReviewsLength = spot.customReviews?.length || 0;
  const customReviewsSum = spot.customReviews?.reduce((acc, r) => acc + r.rating, 0) || 0;

  // Recalculate average raw rating R
  const v_original = spot.reviewsCount;
  const v_total = v_original + customReviewsLength;

  if (v_total === 0) {
    return AVERAGE_GLOBAL_RATING;
  }

  // Raw average rating R
  const R = ((spot.ratingRaw * v_original) + customReviewsSum) / v_total;

  const m = MIN_REVIEWS_THRESHOLD;
  const C = AVERAGE_GLOBAL_RATING;
  const w = MZ_TAG_WEIGHT_COEFFICIENT;

  // Bayesian Average calculation
  const bayesianAverage = (v_total * R + m * C) / (v_total + m);

  // MZ Custom Tags Multiplier (based on matching attributes up to 3)
  const mzTagsCount = spot.mzTags ? spot.mzTags.length : 0;
  const mzMultiplier = 1 + w * Math.min(mzTagsCount, 3);

  const finalScore = bayesianAverage * mzMultiplier;
  
  // Cap at 5.0 and round to two decimal places
  return Math.min(Math.round(finalScore * 100) / 100, 5.0);
}

export function getStepTimes(preset: PresetCourse, startStr: string, stepOffset: number, duration: number) {
  const [pH, pM] = preset.baseStart.split(':').map(Number);
  const presetBaseStartMinutes = pH * 60 + pM;
  
  const [sH, sM] = startStr.split(':').map(Number);
  const userSelectedStartMinutes = sH * 60 + sM;
  
  const shiftDiff = userSelectedStartMinutes - presetBaseStartMinutes;
  
  const startMin = presetBaseStartMinutes + stepOffset + shiftDiff;
  const endMin = startMin + duration;
  
  const formatMin = (m: number) => {
    const adjusted = (m + 1440) % 1440;
    const h = Math.floor(adjusted / 60);
    const min = adjusted % 60;
    const period = h < 12 ? '오전' : '오후';
    const displayH = h === 0 ? 12 : h > 12 ? h - 12 : h;
    return `${period} ${String(displayH).padStart(2, '0')}:${String(min).padStart(2, '0')}`;
  };
  
  return {
    start: formatMin(startMin),
    end: formatMin(endMin)
  };
}

export function getSeasonalRecommendation(month: number) {
  if (month >= 3 && month <= 5) {
    return {
      festivalId: 'cherry_blossom',
      title: '봄바람과 흐드러지는 연분홍 터널, 북면 위례 벚꽃길',
      reason: '봄 햇살이 내리쬐는 천안의 알프스 북면 계곡 길에서 3.5km 벚꽃 드라이브를 만끽하기 가장 좋은 시즌입니다.',
      icon: '🌸',
      accentColor: 'text-pink-650 bg-pink-50/40 border-pink-100 dark:bg-pink-950/20 dark:border-pink-900/30 dark:text-pink-400',
      badgeColor: 'bg-pink-100 text-pink-900 border border-pink-200 dark:bg-pink-900/60 dark:text-pink-100'
    };
  } else if (month >= 6 && month <= 8) {
    return {
      festivalId: 'bbang_spring',
      title: '제빵의 도시 천안, 베리베리 빵빵데이 & 명품 빵지순례',
      reason: '빵돌가마마을과 유수의 명품 로컬 제과점이 전수 동참하는 대한민국 NO.1 제빵 축제 기간이자 초여름 시원한 수변 산책의 완벽한 해답입니다.',
      icon: '🥐',
      accentColor: 'text-amber-800 bg-amber-50/40 border-amber-200/50 dark:bg-amber-950/20 dark:border-amber-900/30 dark:text-amber-400',
      badgeColor: 'bg-amber-100 text-amber-900 border border-amber-200 dark:bg-amber-900/60 dark:text-amber-100'
    };
  } else if (month >= 9 && month <= 11) {
    return {
      festivalId: 'dance_festival',
      title: '익스프레시브 에너지, 천안흥타령춤축제 & 가을 빵 축제',
      reason: '대한민국 최우수 글로벌 댄스 예술 축제와 110년 성환 배 대수확, 빵 콘서트가 함께 물드는 힙한 가을 낭만의 정점입니다.',
      icon: '🕺',
      accentColor: 'text-purple-750 bg-purple-50/40 border-purple-100 dark:bg-purple-950/20 dark:border-purple-900/30 dark:text-purple-400',
      badgeColor: 'bg-purple-100 text-purple-900 border border-purple-200 dark:bg-purple-900/60 dark:text-purple-100'
    };
  } else {
    return {
      festivalId: 'bongsah',
      title: '겨울의 숭고한 등불, 아우내 장터 봉화제 & 실내 미술 투어',
      reason: '2월의 시린 겨울바람 속에서 뜨거운 아우내 독립 만세 운동의 불씨를 기리거나, 아라리오 조각광장 현대예술 거장들의 실내전시를 편히 관람하기 좋습니다.',
      icon: '🏛️',
      accentColor: 'text-blue-750 bg-blue-50/40 border-blue-100 dark:bg-blue-950/20 dark:border-blue-900/30 dark:text-blue-400',
      badgeColor: 'bg-blue-100 text-blue-900 border border-blue-200 dark:bg-blue-900/60 dark:text-blue-100'
    };
  }
}

export function getDistance(lat1: number, lon1: number, lat2: number, lon2: number) {
  const R = 6371; // Radius of the Earth in km
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

export function getOriginCoords(originName: string) {
  if (originName.includes("천안역")) return { lat: 36.8105, lon: 127.1491 };
  if (originName.includes("천안아산역")) return { lat: 36.7944, lon: 127.1044 };
  if (originName.includes("터미널") || originName.includes("버스터미널")) return { lat: 36.8193, lon: 127.1561 };
  if (originName.includes("천안IC") || originName.includes("IC")) return { lat: 36.8225, lon: 127.1705 };
  return { lat: 36.8105, lon: 127.1491 }; // fallback to center Cheonan Area
}
