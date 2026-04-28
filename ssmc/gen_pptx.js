const PptxGenJS = require("pptxgenjs");

const prs = new PptxGenJS();
prs.layout = "LAYOUT_WIDE"; // 13.33 x 7.5 in

// ── 공통 상수 ─────────────────────────────────────────────
const BG     = "F7F8FC";
const TEXT_M = "111827";
const TEXT_S = "6B7280";
const POINT  = "4F7CFF";
const FONT   = "맑은 고딕";

// ── 슬라이드1 페르소나 데이터 ──────────────────────────────
const personas = [
  {
    id:"P1", label:"실무자", color:"3B82F6", blurA:"DBEAFE", blurB:"EFF6FF",
    quote:"결재가 어디까지 갔는지\n알림도 없이 직접 확인해야 해.",
    pain:"Workflow 이탈로 인한 업무 맥락 단절"
  },
  {
    id:"P2", label:"관리자", color:"10B981", blurA:"D1FAE5", blurB:"ECFDF5",
    quote:"결재 대기가 10건인데\n뭐가 급한지 모르겠어.",
    pain:"알림↔처리 채널 분리로 우선순위 불명확"
  },
  {
    id:"P3", label:"인사담당자", color:"8B5CF6", blurA:"EDE9FE", blurB:"F5F3FF",
    quote:"입퇴사 처리마다 권한을\n수동으로 하나씩 바꾸는 게 힘들어.",
    pain:"이중 시스템 운영 + 수동 권한 관리 반복"
  },
  {
    id:"P4", label:"외주파트너", color:"D97706", blurA:"FEF3C7", blurB:"FFFBEB",
    quote:"초대받아서 들어왔는데\n어디까지 볼 수 있는지 몰라.",
    pain:"공식 진입 경로·접근 범위 안내 전무"
  },
  {
    id:"P5", label:"예비입사자", color:"DC2626", blurA:"FEE2E2", blurB:"FEF2F2",
    quote:"뭘 봐야 하고 뭘 준비해야\n하는지 아무것도 안 보여.",
    pain:"입사 전 시스템 접근 불가·정보 채널 부재"
  }
];

// ── 슬라이드2 카드 데이터 ──────────────────────────────────
const cards2 = [
  {
    num:"01", title:"시스템 전환 비용",
    color:"EF4444", blurA:"FEE2E2", blurB:"FEF2F2",
    insightBg:"7F1D1D",
    bullets:[
      "그룹웨어 ↔ 외부 Workflow SaaS 전환 반복",
      "결재 상태를 두 시스템에서 이중 확인",
      "인사 데이터 자동 연동 없는 수동 입력",
      "관리자 위임·설정도 별도 경로로 분산"
    ],
    insight:"맥락은 전환될 때마다 끊긴다"
  },
  {
    num:"02", title:"역할 맥락 부재",
    color:"D97706", blurA:"FEF3C7", blurB:"FFFBEB",
    insightBg:"78350F",
    bullets:[
      "관리자와 실무자가 동일한 홈 화면 사용",
      "Admin 역할 혼재로 탐색 비용 증가",
      "외주파트너·예비입사자 전용 진입 경로 없음",
      "역할별 우선 정보 노출 없어 매번 직접 탐색"
    ],
    insight:"같은 화면, 다른 필요 — 역할 뷰가 없다"
  },
  {
    num:"03", title:"UX 설계 방향",
    color:"4F7CFF", blurA:"E0E7FF", blurB:"EEF2FF",
    insightBg:"1E3A8A",
    bullets:[
      "Workflow 그룹웨어 통합 → 시스템 이탈 제거",
      "역할 기반 홈 뷰 분리 (실무자/관리자/Admin)",
      "온보딩 자동화 → 예비입사자·외주파트너 공식 진입",
      "결재·근태 상태 실시간 노출로 맥락 완결"
    ],
    insight:"통합은 기능이 아니라 경험의 문제다"
  }
];

// ════════════════════════════════════════════════════════════
// 공통 헬퍼: 상단 헤더 바
// ════════════════════════════════════════════════════════════
function addHeader(sl, title, sub) {
  sl.addShape(prs.ShapeType.rect, {
    x:0, y:0, w:13.33, h:1.52,
    fill:{ color:"FFFFFF" }, line:{ color:"E5E7EB", width:0.5 }
  });
  sl.addShape(prs.ShapeType.rect, {
    x:0, y:0, w:0.07, h:1.52,
    fill:{ color:POINT }, line:{ type:"none" }
  });
  sl.addText(title, {
    x:0.22, y:0.16, w:10.2, h:0.6,
    fontSize:19, bold:true, color:TEXT_M, fontFace:FONT, charSpacing:-0.3
  });
  sl.addText(sub, {
    x:0.22, y:0.82, w:10.4, h:0.38,
    fontSize:10.5, color:TEXT_S, fontFace:FONT
  });
}

// 공통 헬퍼: 하단 인사이트 바
function addBottomBar(sl, text) {
  const BY = 6.86;
  sl.addShape(prs.ShapeType.rect, {
    x:0, y:BY, w:13.33, h:0.64,
    fill:{ color:TEXT_M }, line:{ type:"none" }
  });
  sl.addShape(prs.ShapeType.rect, {
    x:0.26, y:BY+0.15, w:0.05, h:0.34,
    fill:{ color:POINT }, line:{ type:"none" }
  });
  sl.addText(text, {
    x:0.4, y:BY, w:12.8, h:0.64,
    fontSize:11, bold:true, color:"FFFFFF", fontFace:FONT, valign:"middle"
  });
}

// 공통 헬퍼: 둥근 칩 배지
function addChip(sl, x, y, w, h, text, bgColor, borderColor, textColor) {
  sl.addShape(prs.ShapeType.roundRect, {
    x, y, w, h, rectRadius:0.07,
    fill:{ color:bgColor }, line:{ color:borderColor, width:0.8 }
  });
  sl.addText(text, {
    x, y, w, h,
    fontSize:8, bold:true, color:textColor, fontFace:FONT,
    align:"center", valign:"middle"
  });
}

// ════════════════════════════════════════════════════════════
// SLIDE 1: 사용자 현황
// ════════════════════════════════════════════════════════════
const s1 = prs.addSlide();
s1.background = { color:BG };

addHeader(s1,
  "크래프톤 그룹웨어를 사용하는 5가지 사용자 여정",
  "역할이 다르면 마찰도 다르다 — 페르소나별 핵심 경험 구조"
);

// 상단 칩 5개 (우측)
const chipColors   = ["3B82F6","10B981","8B5CF6","D97706","DC2626"];
const chipBgColors = ["DBEAFE","D1FAE5","EDE9FE","FEF3C7","FEE2E2"];
const chipLabels   = ["실무자","관리자","인사담당자","외주파트너","예비입사자"];
const CW = 1.32, CG = 0.14;
const chipStartX = 13.33 - (5*CW + 4*CG) - 0.22;
chipLabels.forEach((lbl, i) => {
  addChip(s1,
    chipStartX + i*(CW+CG), 0.52, CW, 0.3,
    `P${i+1}  ${lbl}`,
    chipBgColors[i], chipColors[i], chipColors[i]
  );
});

// 섹션 라벨
s1.addText("PERSONA OVERVIEW", {
  x:0.25, y:1.66, w:4, h:0.22,
  fontSize:8, bold:true, color:POINT, fontFace:"Arial", charSpacing:2
});

// 5개 카드
const c1W = 2.33, c1H = 4.42, c1G = 0.165, c1SX = 0.25, c1SY = 1.95;

personas.forEach((p, i) => {
  const cx = c1SX + i*(c1W+c1G);

  // 그림자
  s1.addShape(prs.ShapeType.roundRect, {
    x:cx+0.035, y:c1SY+0.045, w:c1W, h:c1H,
    rectRadius:0.13, fill:{ color:"DEDFE3" }, line:{ type:"none" }
  });

  // 카드 본체
  s1.addShape(prs.ShapeType.roundRect, {
    x:cx, y:c1SY, w:c1W, h:c1H,
    rectRadius:0.13, fill:{ color:"FFFFFF" }, line:{ color:"E5E7EB", width:0.4 }
  });

  // 원형 블러 오브젝트 1 (우하단, 큰 것)
  s1.addShape(prs.ShapeType.ellipse, {
    x:cx + c1W*0.35, y:c1SY + c1H*0.52,
    w:c1W*0.95, h:c1W*0.85,
    fill:{ color:p.blurA }, line:{ type:"none" }
  });
  // 원형 블러 오브젝트 2 (좌상단, 작은 것)
  s1.addShape(prs.ShapeType.ellipse, {
    x:cx - c1W*0.15, y:c1SY + c1H*0.18,
    w:c1W*0.65, h:c1W*0.6,
    fill:{ color:p.blurB }, line:{ type:"none" }
  });

  // 카드 상단 컬러 바
  s1.addShape(prs.ShapeType.roundRect, {
    x:cx, y:c1SY, w:c1W, h:0.75,
    rectRadius:0.13, fill:{ color:p.color }, line:{ type:"none" }
  });
  s1.addShape(prs.ShapeType.rect, {
    x:cx, y:c1SY+0.44, w:c1W, h:0.31,
    fill:{ color:p.color }, line:{ type:"none" }
  });

  // 배지 원
  s1.addShape(prs.ShapeType.ellipse, {
    x:cx+c1W/2-0.3, y:c1SY+0.44,
    w:0.6, h:0.6,
    fill:{ color:"FFFFFF" }, line:{ color:p.color, width:1.5 }
  });
  s1.addText(p.id, {
    x:cx+c1W/2-0.3, y:c1SY+0.44, w:0.6, h:0.6,
    fontSize:9, bold:true, color:p.color, fontFace:"Arial",
    align:"center", valign:"middle"
  });

  // 역할명
  s1.addText(p.label, {
    x:cx+0.08, y:c1SY+1.16, w:c1W-0.16, h:0.38,
    fontSize:12.5, bold:true, color:TEXT_M, fontFace:FONT, align:"center"
  });

  // 구분선
  s1.addShape(prs.ShapeType.rect, {
    x:cx+0.22, y:c1SY+1.56, w:c1W-0.44, h:0.012,
    fill:{ color:"E5E7EB" }, line:{ type:"none" }
  });

  // 인용문 라벨
  s1.addText("핵심 인용", {
    x:cx+0.14, y:c1SY+1.66, w:c1W-0.28, h:0.2,
    fontSize:7, bold:true, color:p.color, fontFace:FONT
  });

  // 인용문
  s1.addText(`"${p.quote}"`, {
    x:cx+0.14, y:c1SY+1.84, w:c1W-0.28, h:0.88,
    fontSize:9, italic:true, color:TEXT_M, fontFace:FONT, wrap:true, valign:"top"
  });

  // 구분선 2
  s1.addShape(prs.ShapeType.rect, {
    x:cx+0.22, y:c1SY+2.82, w:c1W-0.44, h:0.012,
    fill:{ color:"E5E7EB" }, line:{ type:"none" }
  });

  // Pain 라벨
  s1.addText("핵심 Pain", {
    x:cx+0.14, y:c1SY+2.92, w:c1W-0.28, h:0.2,
    fontSize:7, bold:true, color:"EF4444", fontFace:FONT
  });

  // Pain 박스
  s1.addShape(prs.ShapeType.roundRect, {
    x:cx+0.12, y:c1SY+3.12, w:c1W-0.24, h:1.05,
    rectRadius:0.08, fill:{ color:"FEF2F2" }, line:{ color:"FECACA", width:0.5 }
  });
  s1.addText(p.pain, {
    x:cx+0.2, y:c1SY+3.16, w:c1W-0.4, h:0.97,
    fontSize:8.5, color:"B91C1C", fontFace:FONT,
    wrap:true, valign:"middle", align:"center"
  });
});

addBottomBar(s1, "동일한 시스템, 다른 여정 — 역할 맥락에 맞는 경험 설계가 필요합니다");

// ════════════════════════════════════════════════════════════
// SLIDE 2: 핵심 마찰 구조와 설계 방향
// ════════════════════════════════════════════════════════════
const s2 = prs.addSlide();
s2.background = { color:BG };

addHeader(s2,
  "반복되는 시스템 전환이 만드는 마찰 — 그리고 통합 설계의 기회",
  "그룹웨어와 외부 SaaS 사이의 맥락 단절이 핵심 Pain이며, 통합이 핵심 해법입니다"
);

// 상단 칩 3개 (우측)
const s2Chips = [
  { label:"맥락 단절", bg:"FEE2E2", border:"EF4444", text:"DC2626" },
  { label:"통합 설계", bg:"DBEAFE", border:"3B82F6", text:"1D4ED8" },
  { label:"자동화",   bg:"D1FAE5", border:"10B981", text:"065F46" }
];
const s2CW = 1.4, s2CG = 0.16;
const s2ChipStartX = 13.33 - (3*s2CW + 2*s2CG) - 0.22;
s2Chips.forEach((c, i) => {
  addChip(s2,
    s2ChipStartX + i*(s2CW+s2CG), 0.5, s2CW, 0.32,
    c.label, c.bg, c.border, c.text
  );
});

// 섹션 라벨
s2.addText("FRICTION MAP · DESIGN DIRECTION", {
  x:0.25, y:1.66, w:6, h:0.22,
  fontSize:8, bold:true, color:POINT, fontFace:"Arial", charSpacing:2
});

// ── 3개 카드 배치 ─────────────────────────────────────────
const c2W = 4.11, c2H = 4.82, c2G = 0.25, c2SX = 0.25, c2SY = 1.92;

cards2.forEach((card, i) => {
  const cx = c2SX + i*(c2W+c2G);

  // 그림자
  s2.addShape(prs.ShapeType.roundRect, {
    x:cx+0.04, y:c2SY+0.05, w:c2W, h:c2H,
    rectRadius:0.16, fill:{ color:"DEDFE3" }, line:{ type:"none" }
  });

  // 카드 본체 (흰색)
  s2.addShape(prs.ShapeType.roundRect, {
    x:cx, y:c2SY, w:c2W, h:c2H,
    rectRadius:0.16, fill:{ color:"FFFFFF" }, line:{ color:"E5E7EB", width:0.5 }
  });

  // 원형 블러 오브젝트 1 (우하단, 크게)
  s2.addShape(prs.ShapeType.ellipse, {
    x:cx + c2W*0.42, y:c2SY + c2H*0.48,
    w:c2W*0.88, h:c2W*0.8,
    fill:{ color:card.blurA }, line:{ type:"none" }
  });
  // 원형 블러 오브젝트 2 (좌상단, 중간)
  s2.addShape(prs.ShapeType.ellipse, {
    x:cx - c2W*0.12, y:c2SY + c2H*0.1,
    w:c2W*0.6, h:c2W*0.55,
    fill:{ color:card.blurB }, line:{ type:"none" }
  });
  // 원형 블러 오브젝트 3 (중앙 하단, 작게)
  s2.addShape(prs.ShapeType.ellipse, {
    x:cx + c2W*0.2, y:c2SY + c2H*0.7,
    w:c2W*0.45, h:c2W*0.4,
    fill:{ color:card.blurB }, line:{ type:"none" }
  });

  // 카드 상단 컬러 바 (둥근 상단 + 직사각 하단)
  s2.addShape(prs.ShapeType.roundRect, {
    x:cx, y:c2SY, w:c2W, h:0.85,
    rectRadius:0.16, fill:{ color:card.color }, line:{ type:"none" }
  });
  s2.addShape(prs.ShapeType.rect, {
    x:cx, y:c2SY+0.52, w:c2W, h:0.33,
    fill:{ color:card.color }, line:{ type:"none" }
  });

  // 번호 배지 원
  s2.addShape(prs.ShapeType.ellipse, {
    x:cx+0.18, y:c2SY+0.17,
    w:0.52, h:0.52,
    fill:{ color:"FFFFFF" }, line:{ color:"FFFFFF", width:0 }
  });
  s2.addText(card.num, {
    x:cx+0.18, y:c2SY+0.17, w:0.52, h:0.52,
    fontSize:10, bold:true, color:card.color, fontFace:"Arial",
    align:"center", valign:"middle"
  });

  // 카드 제목
  s2.addText(card.title, {
    x:cx+0.82, y:c2SY+0.2, w:c2W-0.96, h:0.5,
    fontSize:14, bold:true, color:"FFFFFF", fontFace:FONT, valign:"middle"
  });

  // 구분선
  s2.addShape(prs.ShapeType.rect, {
    x:cx+0.22, y:c2SY+0.96, w:c2W-0.44, h:0.015,
    fill:{ color:"E5E7EB" }, line:{ type:"none" }
  });

  // 불릿 4개
  card.bullets.forEach((b, bi) => {
    const by = c2SY + 1.04 + bi * 0.64;

    // 불릿 도트
    s2.addShape(prs.ShapeType.ellipse, {
      x:cx+0.2, y:by+0.07, w:0.1, h:0.1,
      fill:{ color:card.color }, line:{ type:"none" }
    });

    // 불릿 텍스트
    s2.addText(b, {
      x:cx+0.36, y:by, w:c2W-0.52, h:0.58,
      fontSize:9.5, color:TEXT_M, fontFace:FONT, wrap:true, valign:"middle"
    });

    // 불릿 사이 구분선 (마지막 제외)
    if (bi < card.bullets.length - 1) {
      s2.addShape(prs.ShapeType.rect, {
        x:cx+0.22, y:by+0.6, w:c2W-0.44, h:0.008,
        fill:{ color:"F3F4F6" }, line:{ type:"none" }
      });
    }
  });

  // 하단 인사이트 영역 배경
  const insY = c2SY + c2H - 0.72;
  s2.addShape(prs.ShapeType.roundRect, {
    x:cx, y:insY, w:c2W, h:0.72,
    rectRadius:0.16, fill:{ color:card.insightBg }, line:{ type:"none" }
  });
  // 상단 모서리를 직사각으로
  s2.addShape(prs.ShapeType.rect, {
    x:cx, y:insY, w:c2W, h:0.22,
    fill:{ color:card.insightBg }, line:{ type:"none" }
  });

  // 좌측 강조 점
  s2.addShape(prs.ShapeType.ellipse, {
    x:cx+0.18, y:insY+0.24, w:0.1, h:0.1,
    fill:{ color:"FFFFFF" }, line:{ type:"none" }
  });

  // 인사이트 텍스트
  s2.addText(`"${card.insight}"`, {
    x:cx+0.34, y:insY+0.04, w:c2W-0.46, h:0.64,
    fontSize:9.5, bold:true, italic:true, color:"FFFFFF", fontFace:FONT,
    wrap:true, valign:"middle"
  });
});

// ── 카드 간 그라디언트 연결선 ─────────────────────────────
// C1→C2
const connY = c2SY + c2H * 0.38;
s2.addShape(prs.ShapeType.rect, {
  x: c2SX + c2W - 0.02,
  y: connY,
  w: c2G + 0.04,
  h: 0.12,
  fill: {
    type:"gradient",
    stops:[
      { color:"EF4444", position:0 },
      { color:"D97706", position:100 }
    ]
  },
  line:{ type:"none" }
});

// 화살표 삼각형 (C1→C2 끝)
s2.addShape(prs.ShapeType.rtTriangle, {
  x: c2SX + c2W + c2G - 0.1,
  y: connY - 0.06,
  w: 0.14, h: 0.24,
  fill:{ color:"D97706" }, line:{ type:"none" }
});

// C2→C3
const cx2 = c2SX + (c2W+c2G);
s2.addShape(prs.ShapeType.rect, {
  x: cx2 + c2W - 0.02,
  y: connY,
  w: c2G + 0.04,
  h: 0.12,
  fill: {
    type:"gradient",
    stops:[
      { color:"D97706", position:0 },
      { color:"4F7CFF", position:100 }
    ]
  },
  line:{ type:"none" }
});

// 화살표 삼각형 (C2→C3 끝)
s2.addShape(prs.ShapeType.rtTriangle, {
  x: cx2 + c2W + c2G - 0.1,
  y: connY - 0.06,
  w: 0.14, h: 0.24,
  fill:{ color:"4F7CFF" }, line:{ type:"none" }
});

addBottomBar(s2, "단일 시스템 안에서 역할별 맥락을 완결하는 것 — 그것이 이번 리뉴얼의 핵심 설계 목표입니다");

// ── 파일 저장 ─────────────────────────────────────────────
prs.writeFile({ fileName:"krafton_journey_proposal.pptx" })
  .then(() => console.log("✅ krafton_journey_proposal.pptx 생성 완료 (슬라이드 2장)"))
  .catch(e => console.error("❌ 오류:", e));
