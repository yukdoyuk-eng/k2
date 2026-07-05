import { District, CuratedSpot, FestivalEvent, PresetCourse } from './types';

// Districts list representing administrative structure
export const mockDistricts: District[] = [
  {
    id: 1,
    gu: 'DONGNAM',
    subName: '목천읍',
    themeBg: '#FAF5EE',
    themeText: '#5A4E3B',
    description: '독립기념관의 단풍나무 조망과 흑성산 운해, 고즈넉한 힐링 코스가 있는 전통 명소.'
  },
  {
    id: 2,
    gu: 'DONGNAM',
    subName: '병천면',
    themeBg: '#F3EFE9',
    themeText: '#4A3D2C',
    description: '유관순 열사 사적지의 숭고한 나라 사랑 정신과 푸짐한 아우내 순대거리 벨트.'
  },
  {
    id: 3,
    gu: 'DONGNAM',
    subName: '풍세면 (광덕면 포함)',
    themeBg: '#EFECE6',
    themeText: '#3D3425',
    description: '태학산 치유의 숲과 광덕산 가을 단풍 산행, 고택 정원 베이커리 쉼터.'
  },
  {
    id: 4,
    gu: 'DONGNAM',
    subName: '북면',
    themeBg: '#F5EFE6',
    themeText: '#4C3B24',
    description: '천안의 알프스라 불리는 청정 계곡 위례성로 벚꽃 터널 드라이브 스팟.'
  },
  {
    id: 5,
    gu: 'DONGNAM',
    subName: '수신면',
    themeBg: '#EDF2F4',
    themeText: '#2B2D42',
    description: '은하수가 밤하늘에 펼쳐지는 홍대용과학관과 풍요로운 로컬 특산품의 고장.'
  },
  {
    id: 6,
    gu: 'DONGNAM',
    subName: '신안동 (신부동/안서동/유량동/대흥동)',
    themeBg: '#FDFBF7',
    themeText: '#4E3A21',
    description: '단대호수 산책로, 아라리오 야외 조각광장과 원도심의 유서 깊은 맛객 노포거리.'
  },
  {
    id: 7,
    gu: 'DONGNAM',
    subName: '청룡동 (구룡동/신방동)',
    themeBg: '#FCF3E8',
    themeText: '#59291E',
    description: '동화 속 빵 놀이공간 뚜쥬루 빵돌가마마을과 풍미 깊은 스페셜티 감성 로스터리.'
  },
  // SEOBUK DISTRICTS
  {
    id: 8,
    gu: 'SEOBUK',
    subName: '불당동',
    themeBg: '#0D1B2A',
    themeText: '#E0E1DD',
    description: '트렌디한 청년 상업 카페와 지브리 감성, 오픈런이 끊이지 않는 미식의 메카.'
  },
  {
    id: 9,
    gu: 'SEOBUK',
    subName: '부성동 (성성동)',
    themeBg: '#0F2027',
    themeText: '#85FFBD',
    description: 'LED 수변 데크길이 반짝이는 성성호수공원과 호수 전망 감성 테라스 카페 군락.'
  },
  {
    id: 10,
    gu: 'SEOBUK',
    subName: '성거읍',
    themeBg: '#1C2541',
    themeText: '#00B4D8',
    description: '여름날 천흥지 저수지의 노란 금계국 군락과 샤스타데이지 들판 정원.'
  },
  {
    id: 11,
    gu: 'SEOBUK',
    subName: '성환읍',
    themeBg: '#1F2421',
    themeText: '#95D5B2',
    description: '봄철 하얗게 피어나는 110년 전통의 성환 배밭 과수원 풍경과 국보 갈기비.'
  },
  {
    id: 12,
    gu: 'SEOBUK',
    subName: '성정동 (두정동/쌍용동/백석동)',
    themeBg: '#1A1A2E',
    themeText: '#E94560',
    description: '천안축구센터 광장, 정통 뚜쥬루 본점과 든든한 점심을 채우는 특수부위 맛집.'
  },
  {
    id: 13,
    gu: 'SEOBUK',
    subName: '직산읍',
    themeBg: '#1A2F3B',
    themeText: '#00F5FF',
    description: '조선 관립 교육기관인 직산향교와 직산현관아, 과수원 속 수려한 배나무숲 카페 고택.'
  },
  {
    id: 14,
    gu: 'SEOBUK',
    subName: '입장면',
    themeBg: '#2D1B36',
    themeText: '#E0B0FF',
    description: '초가을 달콤하고 탐스러운 입장 거봉포도 수확의 대향연과 산림 치유 드라이브 벨트.'
  }
];

export const mockSpots: CuratedSpot[] = [
  // 1. 목천읍
  {
    id: 1,
    districtId: 1,
    spotName: '독립기념관 (독립숲길)',
    category: 'Heritage',
    googlePlaceId: 'ChIJj71b_9N9fDURDk8bK3sAd-I',
    latitude: 36.7838,
    longitude: 127.2231,
    mzTags: ['#독립숲길', '#가을단풍터널', '#동남헤리티지', '#웅장한산책'],
    curatorDescription: '민족의 찬란한 투쟁 역사가 깃든 곳. 드넓은 단풍나무 숲길의 장엄함과 새벽 흑성산의 바다 같은 운해 풍경이 감동을 선물합니다.',
    ratingRaw: 4.8,
    reviewsCount: 3120,
    imageUrl: 'https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&w=800&q=80',
    customReviews: []
  },
  {
    id: 2,
    districtId: 1,
    spotName: '카페목천',
    category: 'Taste',
    googlePlaceId: 'ChIJX_Mox_N9fDUR_CafeMokcheon',
    latitude: 36.7850,
    longitude: 127.2180,
    mzTags: ['#통창숲뷰', '#제철과일빙수', '#콩크림눌림떡', '#감성한옥'],
    curatorDescription: '사계절 부드러운 나뭇잎이 유리 통창에 가득 차는 곳. 전통 한식을 우아하게 재해석한 고소하고 쫄깃한 식감의 콩크림눌림떡이 명물입니다.',
    ratingRaw: 4.6,
    reviewsCount: 180,
    imageUrl: 'https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&w=800&q=80',
    customReviews: []
  },

  // 2. 병천면
  {
    id: 3,
    districtId: 2,
    spotName: '유관순 열사 사적지',
    category: 'Heritage',
    googlePlaceId: 'ChIJi0Mux_N9fDUR_RyuGwanSun',
    latitude: 36.8042,
    longitude: 127.2978,
    mzTags: ['#기념관', '#초가생가', '#대한독립만세', '#봉화제'],
    curatorDescription: '아우내 장터에서 만세운동을 이끌었던 숭고한 나라 사랑의 발자취. 복원된 초가집 생가와 추모비가 경건한 사색을 유도합니다.',
    ratingRaw: 4.7,
    reviewsCount: 840,
    imageUrl: 'https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&w=800&q=80',
    customReviews: []
  },
  {
    id: 4,
    districtId: 2,
    spotName: '청화집',
    category: 'Taste',
    googlePlaceId: 'ChIJChunghwa_3123',
    latitude: 36.8028,
    longitude: 127.2988,
    mzTags: ['#병천순대터줏대감', '#4대정통', '#소창순대', '#개운한국물'],
    curatorDescription: '50년이 넘는 역사를 지닌 아우내 순대거리의 증인. 작은창자(소창)를 써 소담하고 잡내가 없으며 야채와 선지가 차분히 들어가 개운한 끝맛을 냅니다.',
    ratingRaw: 4.8,
    reviewsCount: 940,
    imageUrl: 'https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&w=800&q=80',
    customReviews: []
  },
  {
    id: 104,
    districtId: 2,
    spotName: '박순자 아우내순대',
    category: 'Taste',
    googlePlaceId: 'ChIJParkSoonJaAunae',
    latitude: 36.8020,
    longitude: 127.2990,
    mzTags: ['#전국대기행렬', '#속이꽉찬순대', '#명물수제순대', '#육즙의감동'],
    curatorDescription: '주말마다 길게 늘어선 대기 행렬이 증명하는 수제 순대의 정수. 속이 가득하여 입안 가득 터지는 깊은 맛이 감동적입니다.',
    ratingRaw: 4.7,
    reviewsCount: 1520,
    imageUrl: 'https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&w=800&q=80',
    customReviews: []
  },
  {
    id: 107,
    districtId: 2,
    spotName: '천안옛날호두과자 병천점',
    category: 'Taste',
    googlePlaceId: 'ChIJCheonanYennalByeongcheon',
    latitude: 36.8035,
    longitude: 127.2970,
    mzTags: ['#적앙금진수', '#튀김소보로호두과자', '#간식스팟', '#전통밀가루'],
    curatorDescription: '순댓국 식후에 빠질 수 없는 천안 디저트의 상징. 아삭하고 고소하게 튀겨내어 팥 앙금 맛을 배가시킨 명품 간식 명당입니다.',
    ratingRaw: 4.4,
    reviewsCount: 310,
    imageUrl: 'https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&w=800&q=80',
    customReviews: []
  },

  // 3. 풍세면/광덕산
  {
    id: 5,
    districtId: 3,
    spotName: '풍세커피 (한옥고택)',
    category: 'Taste',
    googlePlaceId: 'ChIJOfd_yZGAfDUR_PungseCoffee',
    latitude: 36.7325,
    longitude: 127.1325,
    mzTags: ['#한옥고택', '#정원카페', '#사색의여백', '#메타세쿼이아'],
    curatorDescription: '수백 년 고택의 마루와 전통 보를 살린 자연 친화형 정원 예술 카페. 메타세쿼이아 숲 아래에서 흘러나오는 사색의 커피 맛이 일품입니다.',
    ratingRaw: 4.4,
    reviewsCount: 420,
    imageUrl: 'https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&w=800&q=80',
    customReviews: []
  },

  // 4. 북면
  {
    id: 6,
    districtId: 4,
    spotName: '카페 교토리',
    category: 'Taste',
    googlePlaceId: 'ChIJV2H_yZGAfDUR_Kyotori',
    latitude: 36.8524,
    longitude: 127.2412,
    mzTags: ['#일본가옥감성', '#벚꽃길드라이브', '#다다미공간', '#수제유자차'],
    curatorDescription: '천안의 알프스 북면 위례성로 벚꽃 터널에 정갈하게 비쳐 드는 목재 건축 카페. 다다미 구조 내부에서 조용한 계곡 소리와 차 향기를 즐깁니다.',
    ratingRaw: 4.5,
    reviewsCount: 340,
    imageUrl: 'https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&w=800&q=80',
    customReviews: []
  },

  // 5. 수신면
  {
    id: 7,
    districtId: 5,
    spotName: '천안홍대용과학관',
    category: 'Heritage',
    googlePlaceId: 'ChIJV2H_yZGAfDUR_HongDaeYong',
    latitude: 36.7582,
    longitude: 127.2688,
    mzTags: ['#천체관측실', '#조선실학정신', '#은하수망원경', '#별자리투영'],
    curatorDescription: '실학파 우주 과학자 홍대용을 기념하는 고감도 플라네타리움 성지. 고배율 망원경을 통해 밤하늘 성운과 은하수를 눈앞에서 생생하게 만날 수 있습니다.',
    ratingRaw: 4.6,
    reviewsCount: 220,
    imageUrl: 'https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&w=800&q=80',
    customReviews: []
  },

  // 6. 신안동/원도심
  {
    id: 8,
    districtId: 6,
    spotName: '책방 허송세월',
    category: 'Heritage',
    googlePlaceId: 'ChIJv_HeosongSewol',
    latitude: 36.8148,
    longitude: 127.1638,
    mzTags: ['#독립문학서점', '#사진가대표', '#24시무인갤러리', '#인디출판물'],
    curatorDescription: '사진작가 사장님의 낭만적인 취향이 스민 충청권 1호 독립서점. 매혹적인 사진집과 독립출판 도서들, 바로 옆 24시간 오픈형 쇼룸이 눈부십니다.',
    ratingRaw: 4.9,
    reviewsCount: 88,
    imageUrl: 'https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&w=800&q=80',
    customReviews: []
  },
  {
    id: 9,
    districtId: 6,
    spotName: '일상서재 (기록도서관)',
    category: 'Heritage',
    googlePlaceId: 'ChIJv_IlsangSeojae',
    latitude: 36.8124,
    longitude: 127.1512,
    mzTags: ['#필사와기록', '#글쟁이살롱', '#망고푸들', '#조용한문화동'],
    curatorDescription: '캘리그래피 작가의 섬세한 수제 잉크와 사려 깊은 마스코트 푸들 "망고"가 반겨주는 필사 도서관 서점. 고요하게 생각하고 기록하는 시간을 줍니다.',
    ratingRaw: 4.8,
    reviewsCount: 52,
    imageUrl: 'https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&w=800&q=80',
    customReviews: []
  },
  {
    id: 11,
    districtId: 6,
    spotName: '아라리오 조각광장',
    category: 'Heritage',
    googlePlaceId: 'ChIJi0ArarioSculpturePlaza',
    latitude: 36.8198,
    longitude: 127.1568,
    mzTags: ['#데미안허스트', '#수보드굽타', '#도심야외갤러리', '#세계미술성지'],
    curatorDescription: '마치 노천 거장 미술관에 서 있는 느낌. 데미안 허스트의 거대한 찬가 랜드마크와 수보드 굽타의 통제선 등 수백억 대 조각을 일상 삼아 걸으며 산책합니다.',
    ratingRaw: 4.8,
    reviewsCount: 1540,
    imageUrl: 'https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&w=800&q=80',
    customReviews: []
  },
  {
    id: 10,
    districtId: 6,
    spotName: '천호지 (단대호수공원)',
    category: 'Nature',
    googlePlaceId: 'ChIJv_CheonhojiLake',
    latitude: 36.8322,
    longitude: 127.1725,
    mzTags: ['#송꽃송이가', '#밤산책명소', '#천호수데크길', '#벚꽃라이드'],
    curatorDescription: '가을바람이 솔솔 불 지음 생각나는 버스커버스커 노랫소리의 낭만처. 넓은 은빛 저수지를 가로지르는 긴 보행데크가 호수빛 밤하늘을 수놓습니다.',
    ratingRaw: 4.6,
    reviewsCount: 1250,
    imageUrl: 'https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&w=800&q=80',
    customReviews: []
  },
  {
    id: 111,
    districtId: 6,
    spotName: '석산장',
    category: 'Taste',
    googlePlaceId: 'ChIJSeoksanjangWonDosim',
    latitude: 36.8090,
    longitude: 127.1478,
    mzTags: ['#조려먹는물갈비', '#천안역갈비노포', '#명물육수갈비', '#달콤짭조름'],
    curatorDescription: '천안역 앞 원도심 갈비골목의 영예를 지키는 역사적 갈비 노포. 팬 가장자리의 특제 간장 육수에 고기를 푹 졸이듯 정성으로 구워 먹는 달콤한 물갈비의 대가입니다.',
    ratingRaw: 4.5,
    reviewsCount: 780,
    imageUrl: 'https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&w=800&q=80',
    customReviews: []
  },
  {
    id: 112,
    districtId: 6,
    spotName: '정통옥수사',
    category: 'Taste',
    googlePlaceId: 'ChIJJeongtongOksusa',
    latitude: 36.8182,
    longitude: 127.1585,
    mzTags: ['#생활의달인', '#머릿고기수육', '#걸쭉한손칼국수', '#원조노포'],
    curatorDescription: '오랜 세월 동안 쫄깃하고 잡내 전혀 없이 촉촉하게 삶아낸 수육과 고춧가루를 풀어 보글보글 끓여낸 묵직한 손칼국수의 조화가 완벽한 신부동 대표 식당입니다.',
    ratingRaw: 4.6,
    reviewsCount: 540,
    imageUrl: 'https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&w=800&q=80',
    customReviews: []
  },
  {
    id: 124,
    districtId: 6,
    spotName: '안서동 이고집 만두',
    category: 'Taste',
    googlePlaceId: 'ChIJYegojipManduAnseo',
    latitude: 36.8290,
    longitude: 127.1850,
    mzTags: ['#얇은피만두전골', '#꽃잎만두샤브', '#줄서는명가', '#고기만두전국구'],
    curatorDescription: '속이 다 들여다보이는 종이처럼 얇은 피로 정갈하게 빚은 만두 샤브 전골. 사계절 한결같이 오픈 전부터 만석 행렬을 이루는 명불허전 만두 명당입니다.',
    ratingRaw: 4.8,
    reviewsCount: 1640,
    imageUrl: 'https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&w=800&q=80',
    customReviews: []
  },

  // 7. 청룡동/구룡동/신방동
  {
    id: 12,
    districtId: 7,
    spotName: '뚜쥬루 빵돌가마마을',
    category: 'Taste',
    googlePlaceId: 'ChIJ_ToujoursBreadVillage',
    latitude: 36.7792,
    longitude: 127.1422,
    mzTags: ['#동화홉비트마을', '#가마솥직접끓인팥', '#돌가마만주', '#거북이빵'],
    curatorDescription: '빵의 고장 천안을 수호하는 랜드마크 빵 테마파크. 유기농 밀가루와 장작으로 가마 속에서 건강하고 투박하게 구워 대형 순례 행렬을 만듭니다.',
    ratingRaw: 4.8,
    reviewsCount: 3450,
    imageUrl: 'https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&w=800&q=80',
    customReviews: []
  },
  {
    id: 115,
    districtId: 7,
    spotName: '히트커피 본점 (신방동)',
    category: 'Taste',
    googlePlaceId: 'ChIJHitCoffeeSinbang',
    latitude: 36.7820,
    longitude: 127.1250,
    mzTags: ['#콜드빙하', '#크림아인슈페너', '#우드감성로스터', '#천안커피자존심'],
    curatorDescription: '묵진하고 달콤한 콜드 드립 커피 위에 수제 아인슈페너 크림을 고소하게 얹은 시그니처 "콜드빙하"로 천안의 감성 커피 흐름을 평정한 리얼 로스터리 레전드입니다.',
    ratingRaw: 4.7,
    reviewsCount: 350,
    imageUrl: 'https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&w=800&q=80',
    customReviews: []
  },

  // 8. 불당동
  {
    id: 116,
    districtId: 8,
    spotName: '킨이로텐',
    category: 'Taste',
    googlePlaceId: 'ChIJKinirotenBuldang',
    latitude: 36.8145,
    longitude: 127.1055,
    mzTags: ['#인생텐동', '#특제타래소스', '#오징어꽈리튀김', '#오픈런대기'],
    curatorDescription: '바삭바삭 소리부터 찬란한 튀김 덮밥의 교과서. 싱싱한 새우와 반숙 계란, 아삭한 연근 튀김에 녹작지근 뿌려낸 특제 소스가 황홀한 불당동 최고 핫플입니다.',
    ratingRaw: 4.7,
    reviewsCount: 890,
    imageUrl: 'https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&w=800&q=80',
    customReviews: []
  },

  // 9. 성성동
  {
    id: 15,
    districtId: 9,
    spotName: '성성호수공원 (수변데크)',
    category: 'Nature',
    googlePlaceId: 'ChIJi0SeongseongLake',
    latitude: 36.8450,
    longitude: 127.1390,
    mzTags: ['#습지순환데크', '#낙조포토존', '#LED은빛경관', '#피트니스힐링'],
    curatorDescription: '도심 속 대자연과 고용함을 선사하는 넓은 생태 호수. 수면에 비쳐 들려 춤을 추는 야경 수변 데크길이 낭만적인 밤공기를 불러옵니다.',
    ratingRaw: 4.7,
    reviewsCount: 1680,
    imageUrl: 'https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&w=800&q=80',
    customReviews: []
  },

  // 10. 성거읍
  {
    id: 16,
    districtId: 10,
    spotName: '성거 천흥지 & 카페 이숲',
    category: 'Nature',
    googlePlaceId: 'ChIJ_CheonheungjiIsuoop',
    latitude: 36.8825,
    longitude: 127.1895,
    mzTags: ['#금계국들판', '#샤스타데이지숲', '#가을핑크뮬리', '#천흥저수지'],
    curatorDescription: '여름날 노란 물빛을 자아내는 저수지의 금계국 야생화. 바로 아래 화려한 가을 핑크뮬리와 하얀 샤스타데이지 벌판을 가꾼 정원 "이숲"이 그림을 만듭니다.',
    ratingRaw: 4.6,
    reviewsCount: 480,
    imageUrl: 'https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&w=800&q=80',
    customReviews: []
  },

  // 12. 성정동/백석동/쌍용동/두정동
  {
    id: 121,
    districtId: 12,
    spotName: '쌍용동 광명만두',
    category: 'Taste',
    googlePlaceId: 'ChIJGwangmyeongManduSsang',
    latitude: 36.7995,
    longitude: 127.1255,
    mzTags: ['#인생군만두', '#엄청나게바삭함', '#속이꽉찬찐만두', '#품절주의'],
    curatorDescription: '파삭! 깨무는 순간 터져 나오는 묵직한 고기 육즙과 바삭한 피의 전율. 마니아들 사이에서 "인생 만두"라 일컬어지는 만두의 단일 대가입니다.',
    ratingRaw: 4.7,
    reviewsCount: 930,
    imageUrl: 'https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&w=800&q=80',
    customReviews: []
  },

  // New Seobuk-gu Spots
  {
    id: 122,
    districtId: 8, // 불당동
    spotName: '물총새공원',
    category: 'Nature',
    googlePlaceId: 'ChIJmulchongsaePark',
    latitude: 36.8080,
    longitude: 127.1080,
    mzTags: ['#철새관찰', '#벚꽃길산책', '#자전거도로', '#도심근린공원'],
    curatorDescription: '도심 속 작은 규모의 산책로와 자전거 도로가 정비된 힐링 휴식처로, 철새들의 서식지와 인접하여 생태 교육적 가치를 제공합니다. 봄철 벚꽃길과 불당천 카페거리가 이어집니다.',
    ratingRaw: 4.5,
    reviewsCount: 340,
    imageUrl: 'https://images.unsplash.com/photo-1502082553048-f009c37129b9?auto=format&fit=crop&w=800&q=80',
    customReviews: []
  },
  {
    id: 123,
    districtId: 13, // 직산읍
    spotName: '직산향교',
    category: 'Heritage',
    googlePlaceId: 'ChIJjiksanhyeonggyo',
    latitude: 36.8780,
    longitude: 127.1520,
    mzTags: ['#조선시대향교', '#명륜당', '#현판보존', '#유교문화유산'],
    curatorDescription: '조선시대 지방민 교육을 위한 관립 교육기관. 명륜당의 기문 현판들이 고스란히 남아 있어 선비들의 자취와 역사적 가치를 증명합니다.',
    ratingRaw: 4.6,
    reviewsCount: 180,
    imageUrl: 'https://images.unsplash.com/photo-1590001155093-a3c66ab0c3ff?auto=format&fit=crop&w=800&q=80',
    customReviews: []
  },
  {
    id: 124,
    districtId: 13, // 직산읍
    spotName: '직산현관아',
    category: 'Heritage',
    googlePlaceId: 'ChIJjiksangwanah',
    latitude: 36.8795,
    longitude: 127.1510,
    mzTags: ['#조선현관아', '#벽화마을연계', '#역사도보여행', '#고즈넉한매력'],
    curatorDescription: '조선시대 지방 행정 관아 건축물로, 주변의 군서리 벽화마을과 어우러져 과거의 정취를 느끼며 걷는 고즈넉한 도보 여행지로 훌륭합니다.',
    ratingRaw: 4.4,
    reviewsCount: 120,
    imageUrl: 'https://images.unsplash.com/photo-1590001155093-a3c66ab0c3ff?auto=format&fit=crop&w=800&q=80',
    customReviews: []
  },
  {
    id: 125,
    districtId: 11, // 성환읍
    spotName: '봉선홍경사갈기비',
    category: 'Heritage',
    googlePlaceId: 'ChIJbongseonhonggyeongsa',
    latitude: 36.9250,
    longitude: 127.1250,
    mzTags: ['#국보', '#천안8경', '#고려시대석비', '#정교한거북조각'],
    curatorDescription: '천안 제8경이자 국보로 지정된 고려 현종 때의 유물. 정교한 거북 모양 비받침과 용 머리가 고려 초기 미술사의 높은 예술성을 보여줍니다.',
    ratingRaw: 4.8,
    reviewsCount: 290,
    imageUrl: 'https://images.unsplash.com/photo-1544085311-11a028465b03?auto=format&fit=crop&w=800&q=80',
    customReviews: []
  },
  {
    id: 126,
    districtId: 11, // 성환읍
    spotName: '왕지봉 배꽃길',
    category: 'Nature',
    googlePlaceId: 'ChIJwangjibongPearBlossom',
    latitude: 36.9100,
    longitude: 127.1350,
    mzTags: ['#배나무꽃길', '#배꽃만개터널', '#이색드라이브', '#봄의향기'],
    curatorDescription: '매년 4월이면 새하얀 배꽃이 만개하여 온 동네를 덮는 눈꽃 터널길. 이색 드라이브 명소로, 배나무 밭의 수려한 장관이 이국적인 정취를 줍니다.',
    ratingRaw: 4.7,
    reviewsCount: 510,
    imageUrl: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?auto=format&fit=crop&w=800&q=80',
    customReviews: []
  },
  {
    id: 127,
    districtId: 12, // 성정동
    spotName: '도시재생 뉴딜체험관',
    category: 'Heritage',
    googlePlaceId: 'ChIJurbanNewdealHall',
    latitude: 36.8120,
    longitude: 127.1410,
    mzTags: ['#선물상자건물', '#드림홀체험', '#스마트도시체험', '#미래기술체험'],
    curatorDescription: '선물상자 형태의 모던한 빌딩 속에서 드림홀을 활용한 미래 스마트 도시 콘텐츠를 생생히 접해볼 수 있는 최첨단 복합 뉴딜 체험 공간입니다.',
    ratingRaw: 4.3,
    reviewsCount: 95,
    imageUrl: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=800&q=80',
    customReviews: []
  },
  {
    id: 128,
    districtId: 8, // 불당동
    spotName: '불당동 유적공원',
    category: 'Heritage',
    googlePlaceId: 'ChIJbuldangdongRelicPark',
    latitude: 36.8110,
    longitude: 127.1040,
    mzTags: ['#선사유적공원', '#빌딩숲속쉼터', '#청동기시대유적', '#역사야외학습'],
    curatorDescription: '현대적인 빌딩 숲 배후에 유유히 보존된 선사시대 유적 공원. 도심 속 고요한 자연 녹지와 야외 역사 학습 공간을 동시에 제공합니다.',
    ratingRaw: 4.4,
    reviewsCount: 160,
    imageUrl: 'https://images.unsplash.com/photo-1590001155093-a3c66ab0c3ff?auto=format&fit=crop&w=800&q=80',
    customReviews: []
  },
  {
    id: 129,
    districtId: 12, // 성정동
    spotName: '에코힐링 황톳길',
    category: 'Nature',
    googlePlaceId: 'ChIJecoHealingHwangto',
    latitude: 36.8010,
    longitude: 127.1180,
    mzTags: ['#맨발걷기체험', '#소나무숲황톳길', '#피톤치드충전', '#웰빙건강'],
    curatorDescription: '공원로를 따라 펼쳐진 맨발 걷기 특화 황톳길. 소나무 숲에서 품어져 나오는 피톤치드와 직접 흙을 딛는 감촉이 일상 스트레스를 깨끗하게 씻어줍니다.',
    ratingRaw: 4.6,
    reviewsCount: 230,
    imageUrl: 'https://images.unsplash.com/photo-1447752875215-b2761acb3c5d?auto=format&fit=crop&w=800&q=80',
    customReviews: []
  },
  {
    id: 130,
    districtId: 11, // 성환읍
    spotName: '성환순대 두번째집',
    category: 'Taste',
    googlePlaceId: 'ChIJseonghwansundae2',
    latitude: 36.9160,
    longitude: 127.1320,
    mzTags: ['#성환오일장명소', '#수제소창순대', '#국밥투어', '#백년의전통'],
    curatorDescription: '성환 5일장의 유서 깊은 맛을 잇는 순대 명가. 상설 2호점까지 운영하여 가업의 개운하고 묵직한 사골 순대국밥 풍미를 매일 온전히 선사합니다.',
    ratingRaw: 4.6,
    reviewsCount: 620,
    imageUrl: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80',
    customReviews: []
  },
  {
    id: 131,
    districtId: 11, // 성환읍
    spotName: '진주회관 본관',
    category: 'Taste',
    googlePlaceId: 'ChIJjinjuHallMain',
    latitude: 36.9140,
    longitude: 127.1300,
    mzTags: ['#백년가게인증', '#옛날불고기정식', '#정갈한가정식', '#전통한식노포'],
    curatorDescription: '중소벤처기업부 인증 백년가게. 옛날 불고기 정식의 달콤 짭조름하고 깊고 부드러운 양념 육수 맛과 정성스러운 상차림이 전통 한식의 품격을 보여줍니다.',
    ratingRaw: 4.5,
    reviewsCount: 410,
    imageUrl: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80',
    customReviews: []
  },
  {
    id: 132,
    districtId: 12, // 성정동
    spotName: '엄가네본가시골집',
    category: 'Taste',
    googlePlaceId: 'ChIJeomganesigoljib',
    latitude: 36.8220,
    longitude: 127.1420,
    mzTags: ['#전설의뼈해장국', '#사골해장국', '#얼큰함조절', '#24시로컬성지'],
    curatorDescription: '천안 성정동의 전설적인 뼈해장국 성지. 얼큰함 단계를 세부적으로 조절할 수 있으며 진하고 걸쭉한 사골 육수에 고아낸 가득 찬 살코기가 든든함을 줍니다.',
    ratingRaw: 4.7,
    reviewsCount: 1120,
    imageUrl: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80',
    customReviews: []
  },
  {
    id: 133,
    districtId: 8, // 불당동
    spotName: '피양옥',
    category: 'Taste',
    googlePlaceId: 'ChIJpiyangokBuldang',
    latitude: 36.8125,
    longitude: 127.1010,
    mzTags: ['#정통평양냉면', '#명품어복쟁반', '#한우아롱사태', '#메밀백퍼센트'],
    curatorDescription: '구수하고 투명한 메밀 향이 기가막힌 정통 평양냉면과 한우 아롱사태를 아낌없이 올린 명품 어복쟁반을 선보이는 불당동 대표 한식 다이닝입니다.',
    ratingRaw: 4.5,
    reviewsCount: 520,
    imageUrl: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80',
    customReviews: []
  },
  {
    id: 134,
    districtId: 13, // 직산읍
    spotName: '배나무숲 카페',
    category: 'Taste',
    googlePlaceId: 'ChIJbaenamusupCafe',
    latitude: 36.8720,
    longitude: 127.1450,
    mzTags: ['#배과수원뷰', '#통유리창갤러리', '#아인슈페너맛집', '#정원테라스'],
    curatorDescription: '광활한 직산 배 과수원이 사계절 창밖으로 펼쳐지는 곳. 모던한 노출 콘크리트 미학과 향기로운 원두 향이 만나 자연 속 웰니스를 온전히 실현합니다.',
    ratingRaw: 4.5,
    reviewsCount: 430,
    imageUrl: 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=800&q=80',
    customReviews: []
  },
  {
    id: 135,
    districtId: 9, // 부성동
    spotName: '카페더그린 성성점',
    category: 'Taste',
    googlePlaceId: 'ChIJcafethegreenSeongseong',
    latitude: 36.8465,
    longitude: 127.1375,
    mzTags: ['#성성호수전경뷰', '#명품브런치카페', '#테라스석의여유', '#치아바타샌드위치'],
    curatorDescription: '성성호수공원의 탁 트인 호수 풍광을 정면으로 조망할 수 있는 테라스 브런치 명소. 촉촉한 풀드포크 치아바타와 바삭한 크루아상이 훌륭합니다.',
    ratingRaw: 4.4,
    reviewsCount: 310,
    imageUrl: 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=800&q=80',
    customReviews: []
  },
  {
    id: 136,
    districtId: 8, // 불당동
    spotName: '리무소 커피',
    category: 'Taste',
    googlePlaceId: 'ChIJlimusocoffeeBuldang',
    latitude: 36.8160,
    longitude: 127.1065,
    mzTags: ['#스페셜티에스프레소', '#오지커피크림', '#미니멀블랙감성', '#브루잉드립'],
    curatorDescription: '불당동 카페거리를 주도하는 미니멀 시크 에스프레소 바. 전문 바리스타의 정교한 브루잉 드립 커피와 콜드 브루 크림 커피인 오지커피의 향취가 짙습니다.',
    ratingRaw: 4.6,
    reviewsCount: 260,
    imageUrl: 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=800&q=80',
    customReviews: []
  },

  // New Dongnam-gu Spots
  {
    id: 137,
    districtId: 6, // 신안동
    spotName: '태조산 각원사',
    category: 'Heritage',
    googlePlaceId: 'ChIJgakorinsaTaejo',
    latitude: 36.8395,
    longitude: 127.1985,
    mzTags: ['#천안제4경', '#동양최대청동불상', '#태조산자락의절경', '#봄철겹벚꽃성지'],
    curatorDescription: '천안 제4경이자 거대한 동양 최대 규모의 청동대좌불상이 있는 불교 성지. 태조산 자락의 경건한 숲 기운과 봄날 겹벚꽃의 장관이 마음을 정화합니다.',
    ratingRaw: 4.7,
    reviewsCount: 810,
    imageUrl: 'https://images.unsplash.com/photo-1544085311-11a028465b03?auto=format&fit=crop&w=800&q=80',
    customReviews: []
  },
  {
    id: 138,
    districtId: 3, // 풍세면/광덕면
    spotName: '광덕산 및 광덕사',
    category: 'Nature',
    googlePlaceId: 'ChIJgwangdeoksanGwangdeoksa',
    latitude: 36.6850,
    longitude: 127.0750,
    mzTags: ['#천안제7경', '#최고령호두나무', '#설경대장관', '#피톤치드단풍숲길'],
    curatorDescription: '천안 제7경이자 설경이 아름다운 명산. 고찰 광덕사 마당에는 천연기념물로 지정된 우리나라 최고령 호두나무가 자생하여 호두 명가의 기원을 말해줍니다.',
    ratingRaw: 4.7,
    reviewsCount: 740,
    imageUrl: 'https://images.unsplash.com/photo-1447752875215-b2761acb3c5d?auto=format&fit=crop&w=800&q=80',
    customReviews: []
  },
  {
    id: 139,
    districtId: 1, // 목천읍
    spotName: '소노벨 천안',
    category: 'Nature',
    googlePlaceId: 'ChIJsonobelCheonanResort',
    latitude: 36.7865,
    longitude: 127.2150,
    mzTags: ['#탄산온천워터파크', '#가족휴양리조트', '#사계절실내외풀', '#목천에코힐링'],
    curatorDescription: '목천읍 독립기념관 옆에 들어선 사계절 복합 워터파크&리조트. 천연 탄산 온천수를 가득 채워 수치료와 실내외 짜릿한 물놀이를 완벽하게 즐길 수 있습니다.',
    ratingRaw: 4.4,
    reviewsCount: 1540,
    imageUrl: 'https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&w=800&q=80',
    customReviews: []
  },
  {
    id: 140,
    districtId: 1, // 목천읍
    spotName: '아름다운정원 화수목',
    category: 'Nature',
    googlePlaceId: 'ChIJbeautifulGardenHwasumok',
    latitude: 36.7725,
    longitude: 127.2025,
    mzTags: ['#대한민국1호민간정원', '#시원한인공폭포', '#베이커리카페브런치', '#연인들의꽃밭'],
    curatorDescription: '아름답게 가꿔진 한국 최초의 민간 등록 정원. 야외 식물원과 시원스레 부서지는 인공 폭포 산책길, 정원 베이커리 브런치가 평온한 시간을 선사합니다.',
    ratingRaw: 4.5,
    reviewsCount: 680,
    imageUrl: 'https://images.unsplash.com/photo-1502082553048-f009c37129b9?auto=format&fit=crop&w=800&q=80',
    customReviews: []
  },
  {
    id: 141,
    districtId: 6, // 신안동
    spotName: '천안 타운홀',
    category: 'Heritage',
    googlePlaceId: 'ChIJcheonantownhall47f',
    latitude: 36.8078,
    longitude: 127.1495,
    mzTags: ['#47층초고층스카이', '#삼백육십도은하수전경', '#스카이워크투명바닥', '#아트갤러리카페'],
    curatorDescription: '초고층 47층 위에서 유리 바닥 스카이워크를 즐기며 천안 도심의 360도 전경을 감상하는 하늘 공중 정원. 초고화질 일몰과 은빛 야경이 커피 한 잔과 함께 녹아듭니다.',
    ratingRaw: 4.6,
    reviewsCount: 920,
    imageUrl: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=800&q=80',
    customReviews: []
  },
  {
    id: 142,
    districtId: 6, // 신안동
    spotName: '원성천 벚꽃길',
    category: 'Nature',
    googlePlaceId: 'ChIJwonseongcheonCherryBlossom',
    latitude: 36.8040,
    longitude: 127.1620,
    mzTags: ['#3.5km벚꽃터널길', '#하천변수변산책코스', '#연분홍꽃비샤워', '#밤벚꽃조명낭만'],
    curatorDescription: '도심 속 하천 원성천을 따라 길게 이어지는 명품 벚꽃길 터널. 봄이 되면 흰색, 연분홍 꽃비가 수면 위로 흩날리며 흐드러지는 낭만 보행길을 완성합니다.',
    ratingRaw: 4.6,
    reviewsCount: 420,
    imageUrl: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?auto=format&fit=crop&w=800&q=80',
    customReviews: []
  },
  {
    id: 143,
    districtId: 3, // 풍세면
    spotName: '태학산자연휴양림',
    category: 'Nature',
    googlePlaceId: 'ChIJtaehaksanForest',
    latitude: 36.7280,
    longitude: 127.1240,
    mzTags: ['#피톤치드소나무림', '#유아숲체험원놀이', '#풍세오토캠핑숲', '#치유와사색의숲'],
    curatorDescription: '참나무와 울창한 소나무 산림욕장, 아이들이 뛰어놀 수 있는 유아숲원과 현대적인 오토캠핑장이 고루 완비되어 피톤치드 숲 웰니스를 만끽하게 해줍니다.',
    ratingRaw: 4.6,
    reviewsCount: 510,
    imageUrl: 'https://images.unsplash.com/photo-1447752875215-b2761acb3c5d?auto=format&fit=crop&w=800&q=80',
    customReviews: []
  },
  {
    id: 144,
    districtId: 2, // 병천면
    spotName: '충남집순대',
    category: 'Taste',
    googlePlaceId: 'ChIJchungnamjibsundae',
    latitude: 36.8025,
    longitude: 127.2995,
    mzTags: ['#아우내대기줄순대', '#보들보들소창고기', '#뽀얗고사골진한맛', '#대물림의정직함'],
    curatorDescription: '아우내 순대거리에서 극도로 연하고 부드러운 내장 부속 고기와 잡내가 전혀 없이 정제된 맑고 구수한 국물로 대물림 신뢰를 굳건히 지켜온 명가입니다.',
    ratingRaw: 4.7,
    reviewsCount: 1420,
    imageUrl: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80',
    customReviews: []
  },
  {
    id: 145,
    districtId: 1, // 목천읍
    spotName: '선유원',
    category: 'Taste',
    googlePlaceId: 'ChIJseonyuwonSeokgalbi',
    latitude: 36.7620,
    longitude: 127.2450,
    mzTags: ['#숯불연탄돼지석갈비', '#구워나와쾌적하고깔끔', '#양념게장천상의궁합', '#대명가석갈비'],
    curatorDescription: '참숯에서 노릇노릇하고 완벽하게 구워져 무쇠 판에 지글지글 올려 나오는 연탄구이 방식 석갈비 명가. 반찬으로 나오는 매콤달콤 양념게장과의 조화가 극치입니다.',
    ratingRaw: 4.5,
    reviewsCount: 880,
    imageUrl: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80',
    customReviews: []
  },
  {
    id: 146,
    districtId: 7, // 청룡동
    spotName: '핀스커피',
    category: 'Taste',
    googlePlaceId: 'ChIJpinscoffeePinkMuhly',
    latitude: 36.7665,
    longitude: 127.1520,
    mzTags: ['#가을핑크뮬리정원', '#삼층초대형카페글래스', '#스페셜티브레드라인', '#동남인스타감성'],
    curatorDescription: '넓게 펼쳐진 마당의 가을 핑크뮬리, 억새 정원과 압도적인 3층 규모의 현대식 통유리 뷰가 시너지를 내는 곳. 천안에서 손꼽히는 인스타그래머블 빵 카페입니다.',
    ratingRaw: 4.4,
    reviewsCount: 940,
    imageUrl: 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=800&q=80',
    customReviews: []
  },
  {
    id: 147,
    districtId: 3, // 풍세면
    spotName: '광덕양조장',
    category: 'Taste',
    googlePlaceId: 'ChIJgwangdeokyangjojang',
    latitude: 36.6875,
    longitude: 127.0810,
    mzTags: ['#빈티지양조장감성', '#인더스트리얼골조서까래', '#조용한풍세정경', '#드립스페셜원두'],
    curatorDescription: '오래된 폐 막걸리 양조장 건물의 서까래와 콘크리트 골조를 빈티지하고 아방가르드하게 살려낸 인더스트리얼 카페. 조용한 농촌 정취를 경청하며 스페셜티 커피를 마십니다.',
    ratingRaw: 4.4,
    reviewsCount: 380,
    imageUrl: 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=800&q=80',
    customReviews: []
  },
  {
    id: 148,
    districtId: 6, // 신안동
    spotName: '학교종이 땡땡땡',
    category: 'Taste',
    googlePlaceId: 'ChIJschoolbellDangdangdang',
    latitude: 36.8180,
    longitude: 127.1590,
    mzTags: ['#매콤달콤쫄면순두부', '#학창시절복고감성', '#치즈돈가스진수', '#신부동청춘소울'],
    curatorDescription: '천안 청춘들의 소울푸드인 칼칼하고 매콤달콤한 쫄면 순두부와 추억을 부르는 경양식 돈가스를 선보이는 낭만적인 복고풍 신부동 맛집입니다.',
    ratingRaw: 4.5,
    reviewsCount: 460,
    imageUrl: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80',
    customReviews: []
  }
];

export const UNIFIED_AESTHETIC_IMAGE = "https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&w=1200&q=80";

export const FESTIVAL_EVENTS: FestivalEvent[] = [
  {
    id: 'bongsah',
    season: 'spring',
    seasonLabel: '봄의 태동 (2월 ~ 4월): 역사와 봄꽃의 흐름',
    period: '2월 28일',
    title: '🌸 3·1운동 기념 아우내 봉화제',
    date: '매년 2월 28일 (양력 기준)',
    location: '동남구 병천면 유관순열사기념관 광장 ~ 아우내장터 일대 (약 1,300m 구간)',
    description: '유관순 열사와 순국선열들의 숭고한 호국 정신을 기리며 실제 횃불 시위와 일본 헌병대와의 충돌 장면을 재현하는 천안의 역사적 랜드마크 축제입니다.',
    features: '횃불 행진 및 만세운동 재현에 수백 명의 시민과 청년 단체가 합동 재투쟁 역사를 연출합니다.',
    partners: ['청화집', '박순자 아우내순대', '충남집', '아우내한방순대', '천안옛날호두과자 병천점'],
    drawbacks: '야간 횃불 행렬 시간대 주변 양방향 도로가 전면 통제되며 겨울과 봄 사이 야간 야외 행사이므로 방한 대책이 필수적입니다.',
    parkingInfo: '유관순열사사적지 공영 주차장 및 아우내 체육관 임시 주차 공간(무료)을 상시 운영하나, 행사 시작 2~3시간 전 만차율이 매우 높습니다.',
    navigationPath: '티맵/네이버맵 "유관순열사기념관" 검색. 경부고속도로 목천IC 이용 시 국도를 따라 15분 소요.'
  },
  {
    id: 'cherry_blossom',
    season: 'spring',
    seasonLabel: '봄의 태동 (2월 ~ 4월): 역사와 봄꽃의 흐름',
    period: '4월 초',
    title: '🌸 천안 위례 벚꽃축제',
    date: '매년 4월 초 (벚꽃 개화기)',
    location: '동남구 북면 위례성로 일원 (약 3.5km 터널)',
    description: '‘천안의 알프스’라 불리는 북면 계곡 길을 따라 흐드러지게 핀 벚꽃을 감상하며 걷는 힐링 봄꽃 축제입니다.',
    features: '연분홍빛 벚꽃 길 드라이브 및 로컬 주민 예술 수공예 장터 단지가 협업 운영됩니다.',
    partners: ['카페 교토리', '카페목천', '풍세커피'],
    drawbacks: '북면으로 진입하는 유일한 위례성로가 편도 1차선의 협소한 왕복 도로이므로, 주말에는 꼬리를 무는 정체가 극심합니다.',
    parkingInfo: '북면 행정복지센터 및 은석초등학교 임시 운동장 주차장을 전면 개방합니다. 오전 10시 이전 방문을 강력히 제안합니다.',
    navigationPath: '티맵/카카오내비 "북면행정복지센터" 입력. 경부고속도로 목천IC 탈출 후 연춘리 방향으로 국도 합류.'
  },
  {
    id: 'bbang_spring',
    season: 'summer',
    seasonLabel: '초여름 (5월 ~ 6월): 제빵의 도시와 수변 정원',
    period: '5월 ~ 6월 중',
    title: '🥐 베리베리 빵빵데이 & 빵지순례',
    date: '2026년 기준 6월 13일 ~ 6월 14일 진행',
    location: '천안시 관내 참여 제과점 매장 및 천안시청 버들광장',
    description: '1934년 학화호도과자로부터 발원해 대한민국 최고 제빵의 도시로 도약한 천안 대표 브랜드 상생 축제입니다.',
    features: '대전 성심당 같은 단일 브랜드 축제와 달리 천안의 수십 개 동네 명품 빵집이 합동 참여하여 10% 일괄 할인 및 빵지순례 맵 투어를 진행합니다.',
    partners: ['뚜쥬루 빵돌가마마을', '뚜쥬루 성정본점', '진스베이커리 천안점', '하레브라도', '히트커피 본점'],
    drawbacks: '메인 행사장뿐만 아니라 개별 골목 빵집들에 인파가 몰려 시그니처 베이커리 빵들이 조기 품절되며 대기 시간이 길어질 수 있습니다.',
    parkingInfo: '천안시청 의회 및 버들광장 지하 공영 주차장(무료 개방)을 이용 가능하나 만차가 잦습니다. 인근 종합운동장 주차 공간을 우회 추천합니다.',
    navigationPath: '티맵 "천안시청 버들광장" 검색. 대중교통 이용 시 천안역 1번 출구에서 무료 순환 셔틀버스가 30분 간격으로 운행됩니다.'
  },
  {
    id: 'dance_festival',
    season: 'autumn',
    seasonLabel: '초가을 ~ 늦가을 (9월 ~ 10월): 축제와 미식의 정점',
    period: '10월 초',
    title: '🕺 천안흥타령춤축제',
    date: '2026년 기준 10월 1일 ~ 10월 5일 개최',
    location: '천안종합운동장 일원 및 원도심 아트 아지트',
    description: '문화체육관광부 지정 대한민국 최우수 글로벌 예술 댄스 페스티벌입니다. 세계의 무용단이 모여 도심을 가득 채웁니다.',
    features: '국내외 전문 아티스트 길거리 퍼레이드가 불당동 카페거리 등의 번화가 상권과 직접 제휴 협업하여 미식을 전개합니다.',
    partners: ['킨이로텐', '카와이레시피', '멘야타마시', '그래비티 커피드립바', '피양옥', '광명만두', '장군꼬들살전문점', '교동면옥'],
    drawbacks: '종합운동장 교차로 사거리에 수만 명의 관람 차량이 집중되어 교차로 병목 현상 및 주차 전쟁이 심각합니다.',
    parkingInfo: '종합운동장 부지 내 주차 공간은 정오 이전에 거의 가득 찹니다. 불당동 상업공영주차장(유료) 또는 시청 주차 타워 우회 주차 후 도보 이용을 권장합니다.',
    navigationPath: '티맵/네이버맵 "천안종합운동장" 또는 "유관순체육관" 입력. 수도권 지하철 1호선 쌍용역 및 두정역에서 직결 셔틀버스 제공.'
  },
  {
    id: 'bbang_pears',
    season: 'autumn',
    seasonLabel: '초가을 ~ 늦가을 (9월 ~ 10월): 축제와 미식의 정점',
    period: '10월 중순',
    title: '🌾 가을 빵빵데이 & 성환배축제',
    date: '매년 10월 중순 (2025년 기준 10월 18일 ~ 10월 19일 진행)',
    location: '천안종합운동장 오륜문 광장 및 서북구 성환읍 일원',
    description: '가을 낭만 빵빵데이와 110년 전통의 당도 최고 성환 명품 배 수확이 한데 어우러지는 복합형 특산품 대축제입니다.',
    features: '수제 잼 만들기 체험, 가을 빵 콘서트 투어, 1,000여 대의 우주 드론 라이트쇼가 성대하게 진행됩니다.',
    partners: ['이봉원의 봉짬뽕', '정원식당', '학교종이땡땡땡', '이고집 만두'],
    drawbacks: '행사 구역이 도심(종합운동장)과 외곽(성환읍 과수원 단지)으로 이원화되어 대중교통 이용 시 이동 동선이 복잡하게 분산됩니다.',
    parkingInfo: '종합운동장 오륜문 광장 전 주차 구역 및 성환 농협 농산물유통센터 야외 임시 주차 구역(무료)을 지원합니다.',
    navigationPath: '티맵 "종합운동장 오륜문광장" 혹은 "성환배원예농협" 입력. 남서울대학교 순환 버스 연계 노선 활용 시 가장 빠름.'
  },
  {
    id: 'arario_sculpture',
    season: 'always',
    seasonLabel: '사계절 문화 예술 & 원도심 투어',
    period: '상시 운영',
    title: '🎨 아라리오 조각광장 & 리각미술관 공공전',
    date: '연중 상시 진행 (야간 조명쇼 포함)',
    location: '동남구 신부동 터미널 앞 광장 및 유량동 태조산 공원',
    description: '미슐랭 그린가이드 등재 완료. 데미안 허스트, 키스 해링 등 현대 미술 거장들의 조각 작품 26점이 무료 상시 공개됩니다.',
    features: '독립 북카페 감성과 옛날 갈기 골목, 석산장 물갈비 등 유구한 원도심 골목 노포들이 합동하여 사계절 따스한 문화를 선물합니다.',
    partners: ['벤베커', '랜드마크195', '석산장', '정통옥수사', '나정식당', '평양냉면', '일상서재'],
    drawbacks: '신부동 터미널 광장은 천안 최고 밀집 지역으로 유동인구와 고속버스가 혼재하여 매우 복잡하며, 태조산 산마루에 있는 리각미술관은 경사가 급해 도보 접근이 다소 무겁습니다.',
    parkingInfo: '신세계백화점 천안아산점 실내 주차장(유료, 백화점 영수증 할인 연동) 및 태조산 공원 공영 주차장(무료, 미술관까지 차량 2분 소요) 이용 권장.',
    navigationPath: '내비게이션 "아라리오 조각광장" 또는 "리각미술관" 검색. 경부고속도로 천안IC에서 차로 3분 소요되는 최단 거리 코스.'
  },
  {
    id: 'univ_fest',
    season: 'summer',
    seasonLabel: '초여름 (5월 ~ 6월): 제빵의 도시와 수변 정원',
    period: '6월 중하순',
    title: '🍺 천안 유니브시티 페스티벌',
    date: '매년 6월 중하순',
    location: '서북구 불당동 천안시민체육공원',
    description: '천안의 12개 대학 청년들과 지역사회가 융합 촉진하고 청년 정착을 도모하기 위한 열정적인 대학가요제, 청년 예술인 공연, 그리고 맥썸 맥주 페스티벌의 짜릿한 열기가 넘치는 젊음의 상징 페스티벌입니다.',
    features: '대학 가요제와 청년 예술인들의 열정 가득한 공연, 그리고 다채로운 수제 맥주와 푸드트럭이 함께하는 활기찬 야외 축제입니다.',
    partners: ['엄가네본가시골집', '킨이로텐', '리무소 커피', '광명만두', '카페더그린 성성점'],
    drawbacks: '맥주 페스티벌 동반 진행으로 야간 음주 인파가 대거 집중되며 대중교통 귀가 차량 확보가 어렵고 소음이 클 수 있습니다.',
    parkingInfo: '천안시민체육공원 내 주차 공간을 우선 이용하며, 인근 불당동 공영 주차장이나 천안종합운동장 주차장을 임시로 활용할 수 있습니다.',
    navigationPath: '티맵/네이버맵 "천안시민체육공원" 검색. 아산역 또는 천안아산역에서 택시로 7분 거리.'
  },
  {
    id: 'grape_fest',
    season: 'autumn',
    seasonLabel: '초가을 ~ 늦가을 (9월 ~ 10월): 축제와 미식의 정점',
    period: '9월 중순',
    title: '🍇 입장거봉포도축제',
    date: '매년 9월 경',
    location: '서북구 입장면 입장초등학교 일원 및 농가 단지',
    description: '입장 거봉포도의 브랜드 신뢰도 제고와 농가 소득 창출을 위해 펼쳐지는 특산품 축제입니다. 탐스러운 거봉포도 수확, 고당도 포도 시식 및 저렴한 로컬 판매 마켓이 열립니다.',
    features: '거봉포도 직접 수확 체험과 농특산물 로컬 마켓, 그리고 지역 주민들과 관람객이 함께 어우러지는 흥겨운 시민 가요제가 진행됩니다.',
    partners: ['배나무숲 카페', '진주회관 본관', '성환순대 두번째집'],
    drawbacks: '입장면 시골길 일대의 차량 진입이 많아 가을철 주말 나들이 정체가 발생하며 체험 농가별 개별 이동이 필요한 경우가 있습니다.',
    parkingInfo: '입장면 행정복지센터 및 입장초등학교 운동장 야외 임시 무료 주차 공간을 활용할 수 있습니다.',
    navigationPath: '티맵/네이버맵 "입장초등학교" 입력. 안성IC에서 진출하여 입장 방면 국도로 15분 주행.'
  },
  {
    id: 'k_culture',
    season: 'summer',
    seasonLabel: '초여름 (5월 ~ 6월): 제빵의 도시와 수변 정원',
    period: '5월 말 ~ 6월 초',
    title: '🇰🇷 천안 K-컬처 박람회',
    date: '매년 5월 하순 ~ 6월 초순',
    location: '동남구 목천읍 독립기념관 야외 행사장 전역',
    description: 'K-한글, K-뷰티, K-푸드 등 한류 문화의 태동과 우수성을 전 세계에 널리 전파하는 초대형 국경 없는 복합 박람회입니다.',
    features: '독립기념관 겨레의 탑 스펙터클 라이트쇼, 대형 한류 스타 K-POP 콘서트, K-컬처 산업 체험 전시관이 성대하게 운영됩니다.',
    partners: ['선유원', '소노벨 천안', '아름다운정원 화수목'],
    drawbacks: '독립기념관 부지가 대단히 광활하여 야외 도보 이동 거리가 매우 길며, 한류 스타 콘서트 공연 당일 귀가 차량 병목 현상이 매우 심각합니다.',
    parkingInfo: '독립기념관 대규모 유료 주차 타워(소형 2,000원, 대형 3,000원) 및 목천IC 인근 임시 주차 구역을 대대적으로 전면 지원합니다.',
    navigationPath: '티맵/네이버맵 "독립기념관" 검색. 목천IC 탈출 직후 바로 좌회전하여 차로 2분 이내 진입.'
  },
  {
    id: 'maple_healing',
    season: 'autumn',
    seasonLabel: '초가을 ~ 늦가을 (9월 ~ 10월): 축제와 미식의 정점',
    period: '11월 초순',
    title: '🍁 단풍나무숲길 힐링축제',
    date: '매년 10월 하순 ~ 11월 초순',
    location: '동남구 목천읍 독립기념관 단풍나무숲길 둘레길 (약 3.2km 정원)',
    description: '터널처럼 에워싸는 붉은 단풍나무숲길의 정취 속에서 버스킹과 힐링 걷기 대회를 진행하는 가을 단풍 정점 축제입니다.',
    features: '붉은 터널 속 통기타 길거리 클래식 버스킹 공연과 야간 단풍 조명길 걷기 및 스냅사진 무료 촬영 이벤트가 진행됩니다.',
    partners: ['카페목천', '청화집', '옛날호두과자 병천점', '선유원'],
    drawbacks: '가을 단풍 극성수기 주말에는 전국 각지 관광버스가 동시 진입하여 목천 요금소 앞 교차로가 정체되고 둘레길 내 유모차 이동이 다소 혼잡할 수 있습니다.',
    parkingInfo: '독립기념관 야외 주차장 구역을 공통 사용하며 단풍길 진입로 입구와 가까운 서쪽 주차 구역에 선점 주차할 것을 권유합니다.',
    navigationPath: '티맵 "독립기념관 야외주차장" 설정. 천안역 동부광장에서 독립기념관 방면 시내버스(400번대)가 10~15분 간격 운행.'
  }
];

export const PRESET_COURSES: PresetCourse[] = [
  {
    id: "hist_spring",
    title: "🌸 역사 명소 & 가을 단풍 숲길 코스",
    gu: "DONGNAM",
    vibe: "민족의 숭고한 얼과 단풍 나무 그늘 아래에서 사색하는 고요하고 전통적인 힐링 기행",
    baseStart: "09:30",
    steps: [
      { baseStartOffset: 0, duration: 120, spotId: 1, spotName: "독립기념관 단풍나무 숲길", guide: "붉은 단풍나무가 터널처럼 조밀하게 심어진 3.2km 단풍나무길을 가볍게 걷습니다. 이른 아침 이슬 젖은 잎사귀들에 비치는 절경을 세세히 감상해 보세요." },
      { baseStartOffset: 130, duration: 65, spotId: 4, spotName: "점심 식사: 병천 아우내 청화집", guide: "50년 전통 노포에서 부드럽고 쫄깃쫄깃한 수제 소창 순대국밥 국물과 야채가 알차게 찬 모듬순대로 따끈하게 배를 채웁니다." },
      { baseStartOffset: 210, duration: 20, spotId: 107, spotName: "간식: 옛날호두과자 병천점", guide: "순대국밥 오찬 후 차에서 맛보는 바삭하게 갓 튀겨낸 튀김소보로 호두과자의 고소함을 간식으로 음미합니다." },
      { baseStartOffset: 240, duration: 110, spotId: 2, spotName: "카페목천 (한옥 숲뷰)", guide: "목천읍의 고아한 한옥 마루와 대형 통유리창 앞에 자리 잡아 흔들리는 무성한 숲을 보며, 쫄깃쫄깃한 시그니처 콩크림눌림떡을 음용 차와 즐겨보세요." }
    ]
  },
  {
    id: "bakery_lake",
    title: "🥐 빵의 도시 뚜쥬루 & 성성호수 순환 코스",
    gu: "ALL",
    vibe: "천안의 독창적인 제빵 장인들의 풍미를 만나고 탁 트인 호수 데크길을 걷는 트렌디 미식 코스",
    baseStart: "10:30",
    steps: [
      { baseStartOffset: 0, duration: 100, spotId: 12, spotName: "뚜쥬루 빵돌가마마을", guide: "호빗들이 둥지를 튼 것 같은 동화 마을을 거닐며 가마솥에 손수 졸인 팥이 씹히는 명물 돌가마만주와 갓 구운 거북이빵을 오감으로 맛보세요." },
      { baseStartOffset: 120, duration: 75, spotId: 116, spotName: "점심 식사: 불당동 킨이로텐", guide: "줄서서 먹는 튀김 바에서 아삭 바삭한 새우, 계란, 구수한 연근이 가득한 텐동을 수제 양념장에 올려 황홀하게 수저를 듭니다." },
      { baseStartOffset: 210, duration: 75, spotId: 15, spotName: "성성호수공원 데크길", guide: "도심 속 광활한 호수의 목재 데크길을 약 1.5km 상쾌하게 돌아 걷고 호수 전경을 사진 프레임 안에 가득 담아보며 소화를 돕습니다." },
      { baseStartOffset: 295, duration: 80, spotId: 115, spotName: "히트커피 본점 (로스팅 명가)", guide: "시그니처 드립커피에 달콤부드러운 크림을 도탑게 얹은 '콜드빙하' 아인슈페너 커피를 홀짝이며 나른한 피로를 눈부시게 해소합니다." }
    ]
  },
  {
    id: "art_record",
    title: "🎨 야외 조각광장 & 독립서점 기록 코스",
    gu: "SEOBUK",
    vibe: "거장들의 대형 조각품들과 고서적들이 있는 서재에서 사각사각 소리가 들리게 필사하며 묵혀두는 마음 기록 기행",
    baseStart: "11:00",
    steps: [
      { baseStartOffset: 0, duration: 80, spotId: 11, spotName: "아라리오 조각광장", guide: "터미널 야외 광장 전체가 거대한 지붕 없는 현대미술 거장들의 명작 갤러리입니다. 데미안 허스트의 기념비적인 작품 등 수백억 가치 대작들을 차분히 감상합니다." },
      { baseStartOffset: 95, duration: 60, spotId: 112, spotName: "점심 식사: 정통옥수사 수육과 칼국수", guide: "야들야들하게 수분이 촉촉이 밴 수육 한 점과 칼국수의 깊은 고춧가루 국물이 이루어내는 오랜 장인 노포의 맛으로 입도 즐겁게 채워줍니다." },
      { baseStartOffset: 170, duration: 80, spotId: 9, spotName: "일상서재 (기록도서관)", guide: "캘리그래피 작가의 따스한 살롱에서 펜촉과 잉크를 빌려 엽서지 위에 가슴 깊은 소망 한 줄을 호흡을 멈춘 채 고요히 사각사각 필사해 보세요." },
      { baseStartOffset: 260, duration: 80, spotId: 8, spotName: "책방 허송세월", guide: "사진가 사장님의 따스한 손때 묻은 취향이 오롯이 고여 있는 서점에서 이색 문학 도서와 독립 출판 잡지를 집어 들며 문학적인 기행을 완성합니다." },
      { baseStartOffset: 350, duration: 90, spotId: 111, spotName: "저녁 식사: 원도심 석산장 물갈비", guide: "간장 양념 물 육수를 부어 갈비를 자작하게 졸이듯이 구워내는 역사가 담긴 원조 물갈비를 맛보며 달콤 고소하고 푸근한 행복으로 하루를 끝맺습니다." }
    ]
  }
];
