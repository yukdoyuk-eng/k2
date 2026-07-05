import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

import { mockSpots, mockDistricts } from "./src/data";
import { calculateAestheticScore } from "./src/utils";
import { CustomReview } from "./src/types";

// Keep active backend store in memory so changes persist across UI views
let spotsStore = [...mockSpots];

const app = express();
const PORT = 3000;

app.use(express.json());

// API: Get all districts
app.get("/api/districts", (req, res) => {
  res.json(mockDistricts);
});

// API: Get all spots, with computed scores
app.get("/api/spots", (req, res) => {
  const scoredSpots = spotsStore.map(spot => ({
    ...spot,
    weightedScore: calculateAestheticScore(spot)
  }));
  res.json(scoredSpots);
});

// API: Post review to a spot
app.post("/api/spots/:id/reviews", (req, res) => {
  const spotId = parseInt(req.params.id, 10);
  const { author, rating, comment } = req.body;

  if (!author || !rating || !comment) {
    return res.status(400).json({ error: "모든 필드(이름, 평점, 한줄평)를 입력해주세요." });
  }

  const spotIndex = spotsStore.findIndex(s => s.id === spotId);
  if (spotIndex === -1) {
    return res.status(404).json({ error: "해당 장소를 찾을 수 없습니다." });
  }

  const newReview: CustomReview = {
    id: `review_${Date.now()}`,
    author: String(author).trim(),
    rating: parseFloat(rating),
    comment: String(comment).trim(),
    date: new Date().toISOString().split('T')[0]
  };

  const spot = spotsStore[spotIndex];
  const customReviews = spot.customReviews ? [...spot.customReviews, newReview] : [newReview];
  
  spotsStore[spotIndex] = {
    ...spot,
    customReviews
  };

  const updatedSpot = {
    ...spotsStore[spotIndex],
    weightedScore: calculateAestheticScore(spotsStore[spotIndex])
  };

  res.json({ success: true, updatedSpot });
});

// API: Gemini 3.5 Flash Curation Endpoint
app.post("/api/curate", async (req, res) => {
  try {
    const { userPrompt, targetGu, currentRatingList } = req.body;

    const spotsContext = spotsStore.map(spot => {
      const score = calculateAestheticScore(spot);
      const district = mockDistricts.find(d => d.id === spot.districtId);
      return `- [${district?.gu === 'DONGNAM' ? '동남구' : '서북구'} ${district?.subName || ''}] ${spot.spotName} (${spot.category})
        * 에디터 설명: ${spot.curatorDescription}
        * 미학 지수(베이지안 평점): ${score.toFixed(2)}점 (누적 리뷰 ${spot.reviewsCount + (spot.customReviews?.length || 0)}개)
        * 주요 테그: ${spot.mzTags.join(', ')}`;
    }).join("\n");

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey || apiKey === "MY_GEMINI_API_KEY" || apiKey.trim() === "") {
      return res.json({
        success: true,
        curation: `[⚠️ 알림: AI Studio Secrets 패널에서 GEMINI_API_KEY를 구성해 주세요! 현재 코스 도우미의 임시 정밀 설계 모드로 세부 일정을 즉시 처방해 드립니다.]

🧭 **천안시 코스 도우미 - 1분 단위 감성 코스 추천안**

사용자님의 동선과 마음에 맞춤화된 시간대별 명품 루트를 동행합니다. 아래 일정표대로 동선을 밟아보세요!

### 🗺️ 맞춤형 시간대별 추천 일정표

| 시간대 | 장소 / 명소명 | 세세한 이동 및 활동 지침 (어디서 어떻게 보낼지) |
| :--- | :--- | :--- |
| **09:30 - 11:30** | **독립기념관 단풍나무 숲길**<br>*(동남구 목천읍)* | 대자연의 상쾌한 아침 공기를 마시며 총 3.2km의 단풍나무 붉은 터널에 진입합니다. 숨이 차오를 때는 가을 숲의 그늘 아래 벤치에 앉아 조용히 새소리에 귀를 기울여 보시는 것을 처방합니다. (미학 지수: ★ 4.80) |
| **11:40 - 12:45** | **식사: 청화집**<br>*(동남구 병천면 아우내거리)* | 목천읍에서 아우내 순대거리로 차로 약 10분 이동합니다. 50년 정통 노포 청화집에 자리를 잡고, 잡내가 아예 없고 부드러운 소창 수제순대국밥과 선지와 야채가 듬뿍 들어간 소담한 모듬순대를 올려 든든하고 따뜻한 미식 오찬을 만끽합니다. (미학 지수: ★ 4.78) |
| **12:50 - 13:10** | **간식: 천안옛날호두과자 병천점** | 청화집 바로 인근에 위치한 과자점에서 갓 구워 껍질이 아삭아삭한 '튀김소보로 호두과자'를 한 봉지 구매하세요. 입안에서 고소하게 갈라지는 호두의 식감과 달콤한 팥의 조화는 천안 여행의 뺄 수 없는 감초 처방입니다. (미학 지수: ★ 4.40) |
| **13:40 - 15:35** | **카페목천**<br>*(동남구 목천읍)* | 다시 부드럽게 복귀 드라이브를 즐기며 한옥 고건축 디자인 카페목천에 당도합니다. 대형 통창 유리 너머로 부서지는 햇무리와 유유한 흔들림의 숲 뷰를 조망하며, 이 집의 시그니처 전통 메뉴인 쫄깃하고 달콤고소한 '콩크림눌림떡'과 깊은 차 한 잔을 곁들이며 사색에 잠깁니다. (미학 지수: ★ 4.60) |
| **15:55 - 17:30** | **천호지 (단대호수공원)**<br>*(동남구 신안동)* | 노을이 시작되는 오후 4시경, 버스커버스커의 낭만 음악이 흐르는 단대호수공원에 도착합니다. 수십만 평의 넓은 저수지를 안고 은은하게 돌아가는 데크 산책로 길을 약 40분간 거닐며 은빛 물비늘의 낙조 사진을 세세히 촬영합니다. |
| **17:50 - 19:30** | **식사: 석산장 (물갈비)**<br>*(원도심 대흥동)* | 천안역 앞 35년 전통의 연륜 깊은 갈비 골목으로 들어가 석산장에 안착합니다. 특수한 전용 주전자 불판에 양념 갈비를 굽듯 가장자리의 특제 한방 간장 육수에 졸이듯 익혀 먹는 '물갈비'의 자작함과 깊은 고기 맛으로 완벽하게 하루의 포만감을 정리합니다. (미학 지수: ★ 4.54) |

💊 **오늘의 여행 영혼 처방전:**
*"너무 빨리 걸으면 하늘빛 호수에 어려 흔들리는 나뭇잎을 놓치게 됩니다. 이번 천안 여행길에서는 시계를 잠시 내려두고, 백 년의 빵 향기와 물갈비의 자작한 끓는 소리를 편히 경청하며 걸으세요."*`
      });
    }

    const ai = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build'
        }
      }
    });

    const targetGuText = targetGu === 'ALL' ? '천안시 통합 전역' : targetGu === 'DONGNAM' ? '동남구 (역사와 대자연, 앤틱 헤리티지)' : '서북구 (현대적 도심 상권, 네온 얼반 벨트)';

    const systemInstruction = `
      당신은 천안시의 고유한 지역적 미학을 완벽하게 이해하고 사랑하는 일류 문화 에디터이자 AI 로컬 크리에이티브 디렉터입니다.
      사용자가 "천안시 코스 도우미"를 연동하여 요청했을 때, 제공된 실제 '천안시 데이터베이스' 상의 정교한 명소, 디저트 핫플레이스, 독립서점 정보들을 완벽하게 융합하여 사용자의 요구사항에 풍부하고 감성적인 잡지 컬럼 어조로 시간대별 고밀도 여행 코스를 맞춤 작성해야 합니다.

      [천안시 데이터베이스 정보]
      ${spotsContext}

      [필수 규격 (MUST FOLLOW ALWAYS)]
      1. 사용자가 원하는 동선과 마음의 무드(예: 사색, 호젓한 산책, 디저트 빵지순례, 유쾌한 데이트 등)를 깊이 공감하는 소설 같은 오프닝을 작성해 주세요.
      2. 타겟 행정구역: ${targetGuText}를 중점적으로 반영하십시오. 단, 사용자가 통합 코스를 원하거나 구를 넘나들기를 원할 경우 자연스럽게 연계해주셔도 좋습니다.
      3. **시간대별(Time-by-Time) 구체적인 동선 설계**: 일정을 오전, 점심, 오후, 저녁, 밤 순으로 빈틈없이 쪼개어 [시간대 (예: 10:00 - 11:30)], [장소명/명소명], [어디가서 무엇을 먹거나 할지 세부적인 동선 및 활동 가치]를 반드시 명시하십시오. 마크다운 표(Table)나 깔끔하게 목록화된 타임라인(Timeline) 형식 중 하나를 명확히 선택하여 가독성 있게 정리해야 합니다.
      4. 추천 장소를 소개할 때 꼭 데이터베이스에 있는 "에디터 미학 지수 (예: ★ 4.80)"와 관련된 평점을 함께 표출하며 가치를 감도 깊은 어조로 해설하십시오.
      5. "호두과자", "빵의 도시 천안"의 전통(뚜쥬루 빵돌가마마을), 아라리오 조각광장의 현대 예술가들의 대작 등 천안만의 독창적 정체성 키워드를 물 흐르듯 가미해 세련되게 작성해 주세요.
      6. 마지막은 한 구절의 따뜻한 여행 처방전 문구(💊 여행 처방전)로 영혼을 달래주며 마쳐주십시오. 친근하고 교양 있는 한국어로 작성하세요.
    `;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: userPrompt,
      config: {
        systemInstruction,
        temperature: 0.8,
      }
    });

    const curationText = response.text || "미적 천안의 풍경이 산안개에 가려져 보이지 않습니다. 다시 시도해 주세요.";
    res.json({ success: true, curation: curationText });

  } catch (error: any) {
    console.error("Gemini Curation failure:", error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Setup Vite Dev Server / Static Hosting based on Environment
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    // Vite options config
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa"
    });
    app.use(vite.middlewares);
  } else {
    // Serve static files in production from dist
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[Full-Stack Server] running on http://localhost:${PORT}`);
  });
}

startServer();
