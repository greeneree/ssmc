# AI 해커톤 플랫폼 — Claude Code 핸드오버 문서

> 이 파일은 Claude Code가 작업 시 항상 먼저 읽어야 하는 기준 문서입니다.
> 디자인 토큰, 레이아웃 규격, 컴포넌트 명세가 모두 여기에 정의되어 있습니다.

---

## 프로젝트 개요

- **서비스명**: AI 해커톤 플랫폼 (Samsung SDS Multicampus)
- **목적**: AI 해커톤 대회 생성·운영·심사·결과 공개 통합 플랫폼
- **개발사**: 넥스젠 (AI 스튜디오 유지보수 담당)
- **런칭 목표**: 2026년 8월 초
- **인증**: MLP SSO (SAML / OAuth) — 별도 로그인 없음

---

## 파일 구조

```
hackathon/
├── CLAUDE.md                  ← 이 문서 (항상 먼저 읽을 것)
├── hackathon_1a.html          ← 1안: AI 스튜디오 과정 내 메뉴
├── hackathon_1b.html          ← 2안: 별도 팝업/독립 페이지
├── assets/
│   ├── css/
│   │   ├── tokens.css         ← 디자인 토큰 (수정 금지)
│   │   ├── components.css     ← 공통 컴포넌트
│   │   └── layout.css         ← 레이아웃
│   └── js/
│       └── common.js          ← 공통 유틸
└── images/                    ← 아이콘 및 이미지 (SVG 권장)
```

**규칙**: 새 HTML 파일 작성 시 반드시 tokens.css → components.css → layout.css 순으로 import.
인라인 스타일은 프로토타입 목적으로만 허용. 재사용 가능한 스타일은 반드시 components.css에 추가.

---

## 디자인 토큰 (tokens.css 기준)

### Color

| 토큰 | 값 | 용도 |
|------|-----|------|
| `--color-primary` | `#7F5DD5` | 메인 버튼, 강조, 배지 |
| `--color-primary-gradient` | `linear-gradient(139deg, #B06CFF 8.74%, #4E70FF 62.41%, #1772FF 92.67%)` | 1위 랭킹 카드, 로고 |
| `--color-secondary` | `#131416` | 보조 |
| `--color-error` | `#E95151` | 에러 |
| `--color-success` | `#39C89A` | 성공 |
| `--color-info` | `#2EA1FF` | 정보 |
| `--color-point` | `#E9517A` | 좋아요, 포인트 강조 |
| `--text-basic` | `#131416` | 기본 텍스트 |
| `--text-subtle` | `#58616A` | 보조 텍스트 |
| `--bg-base` | `#FFFFFF` | 기본 배경 |
| `--bg-hover` | `#F4F5F6` | hover, 페이지 배경 |
| `--border-default` | `#F4F5F6` | 보더, 디바이더 |
| `--card-dark-bg` | `#585D72` | 통계 카드 (다크) |
| `--rank-1st-bg` | gradient | 1위 카드 |
| `--rank-2nd-bg` | `#585D72` | 2위 카드 |
| `--rank-3rd-bg` | `#3D4152` | 3위 카드 |
| `--skeleton-bg` | `linear-gradient(90deg, #E0F2FE 0%, #F4EBFF 53.37%, #E0F2FE 100%)` | 패널 배경 |

### Hero Gradient (히어로 영역)
```css
/* Gradient 1 */
linear-gradient(90deg, #42DDFF 0%, #1170FF 46%)
/* Gradient 2 */
linear-gradient(135deg, #B940FF 0%, #25F57C 50%, #7230FF 100%)
/* 히어로 박스 규격 */
width: 1036px; height: 428px; position: absolute; top: -130px; opacity: 0.5;
```

### Typography

| 용도 | 변수 | 값 |
|------|------|-----|
| H1 | `--h1-size` | 32px / 700 / lh:36px |
| H2 | `--h2-size` | 24px / 700 / lh:30px |
| Body (medium-sb) | `--body-size` | 18px / 600 / lh:24px |
| Sub (small-r) | `--sub-size` | 16px / 400 / lh:22px |
| Caption | `--caption-size` | 14px / 400 / lh:20px |
| **LNB 메뉴 (xsmall-m)** | `--xsmall-m-size` | **14px / 500 / lh:20px** |
| Label | `--label-size` | 12px / 600 |

폰트: `Pretendard` (letter-spacing: -0.3px 공통)

### Spacing (4px 배수)
`--gap-4` / `--gap-8` / `--gap-10` / `--gap-12` / `--gap-16` / `--gap-20` / `--gap-24` / `--gap-32` / `--gap-40`

### Radius
| 변수 | 값 |
|------|-----|
| `--radius-xsmall` | 8px |
| `--radius-small` | 10px |
| `--radius-medium` | 12px |
| `--radius-large` | 16px |
| `--radius-full` | 9999px |

---

## 레이아웃 규격

### 전체 프레임
```css
display: flex;
width: 1920px;
height: 1080px;
flex-direction: column;
align-items: flex-start;
```

### 헤더
```css
display: flex;
width: 1920px;
height: 64px;
padding: 0 24px;
justify-content: space-between;
align-items: center;
flex-shrink: 0;
```
- 헤더 좌측 (breadcrumb 영역): `display:flex; height:32px; align-items:center; gap:16px; flex:1 0 0;`
- 헤더 우측 (버튼): `display:flex; justify-content:flex-end; align-items:center; gap:12px;`

### 3-column 바디
```
| LNB (max 220px) | Body (flex:1) | Right Panel (600px) |
```

**LNB**:
```css
display: flex;
max-width: 220px;
flex-direction: column;
align-items: flex-start;
gap: 16px;
flex: 1 0 0;
align-self: stretch;
border-radius: 12px;
background: #FFF;
```

**LNB 메뉴 아이템**:
```css
display: flex;
padding: 8px 10px;
align-items: center;
gap: 10px;
align-self: stretch;
border-radius: 8px;
font-size: 14px;
font-weight: 500;
line-height: 20px;
letter-spacing: -0.3px;
```
- 아이콘: `width:16px; height:16px; aspect-ratio:1/1;`
- Active 상태: `background: #F4F5F6; font-weight:600;`

**Body**:
```css
display: flex;
flex-direction: column;
align-items: center;
gap: 32px;
flex: 1 0 0;
align-self: stretch;
background: #FFFFFF;
border-radius: 12px;
```

**Right Panel**:
```css
display: flex;
width: 600px;
flex-direction: column;
align-items: flex-start;
align-self: stretch;
gap: 8px;
```

---

## 컴포넌트 명세

### 버튼
```html
<button class="btn btn-primary">텍스트</button>
<button class="btn btn-primary btn-lg">큰 버튼</button>
<button class="btn btn-secondary">취소</button>
<button class="btn btn-outline">아웃라인</button>
```
- height: 36px (기본) / 44px (btn-lg)
- radius: 8px

### 배지
```html
<span class="badge badge-primary">진행중</span>
<span class="badge badge-dday">D-14</span>
<span class="badge badge-done">완료</span>
<span class="badge badge-success">승인</span>
```

### 태그 (카테고리)
```html
<span class="tag tag-purple">아이디어톤</span>
<span class="tag tag-gray">기업사업교육2그룹</span>
```

### 통계 카드 (다크)
```html
<div class="stat-row">
  <div class="stat-c">
    <div class="stat-label">총상금</div>
    <div class="stat-val">1,000<em>만원</em></div>
  </div>
</div>
```
배경: `#3A3D50` / 카드: `#585D72; border-radius:8px;`

### 랭킹 카드
```html
<div class="rank-card r1">...</div>  <!-- 1위: purple gradient -->
<div class="rank-card r2">...</div>  <!-- 2위: #585D72 -->
<div class="rank-card r3">...</div>  <!-- 3위: #3D4152 -->
```

### 탭
```html
<div class="tabs">
  <div class="tab active" onclick="switchTab(this,'content-id')">탭명</div>
</div>
<div id="content-id">...</div>
<div id="content-id2" class="hidden">...</div>
```

---

## 사용자 역할 및 화면 구분

| 역할 | 화면 구분 | 비고 |
|------|----------|------|
| 참가자 | Front | MLP SSO |
| 동료평가자 | Front | 참가자 겸역 |
| 심사위원 | Front | 운영자가 지정 |
| 운영자 | Admin | MLP 컴포넌트 활용 |
| 시스템관리자 | SystemAdmin | 넥스젠 담당 |

---

## 주요 상태값 (대회 진행 단계)

```
Draft → 공개 → 접수중 → 제출마감 → 1차결과공개 → 2차심사중 → 종료
```

---

## 목업 구성 현황

| 파일 | 상태 | 내용 |
|------|------|------|
| `hackathon_1a.html` | ✅ 완료 | 1안: 과정 내 메뉴, 진행전/중 토글 |
| `hackathon_1b.html` | 🔲 미완 | 2안: 별도 팝업 (카운트다운, 독립 LNB) |
| Admin 화면 | 🔲 미완 | 운영자 대시보드, 심사관리, Anchoring |

---

## AI 심사 엔진 구조 (연동 참고)

```
제출물 → Document & Asset AI (파싱/구조화)
       → Evaluation AI (4개 영역 LLM 독립 평가)
          ├── 기획·전략 맥락 추론 엔진
          ├── 기술 논리 및 설계 검증 엔진
          ├── 구현 실증 및 검토 엔진
          └── 임팩트·신뢰 검증 엔진
       → Calibration Engine (가중치 적용 + Anchoring 보정)
       → Feedback AI (리포트 생성)
       → 운영자 승인 → 리더보드 반영
```

- 기본 LLM: Claude (특정 LLM 추가 시 별도 협의)
- Anchoring: 10% 샘플링, 상/중/하 보정, 운영자 승인 필요

---

## 참고 링크

- IA Table: https://ssmc-fn7y.vercel.app/hackathon_ia_v2.html
- 기획 허브: https://ssmc-fn7y.vercel.app/hackaton.html
- Prototype 1안: https://ssmc-fn7y.vercel.app/hackathon/hackathon_1a.html
- 피그마 원본
2안 진행 전- https://www.figma.com/design/21MkANJNpw1Ydw3aEB3pPM/%EC%A0%9C%EB%AA%A9-%EC%97%86%EC%9D%8C?node-id=2-2072&t=qw1orZ7ltLAFCUiF-11

2안 진행 중-

https://www.figma.com/design/21MkANJNpw1Ydw3aEB3pPM/%EC%A0%9C%EB%AA%A9-%EC%97%86%EC%9D%8C?node-id=5-920&t=qw1orZ7ltLAFCUiF-11

1안 진행 전 - 

https://www.figma.com/design/21MkANJNpw1Ydw3aEB3pPM/%EC%A0%9C%EB%AA%A9-%EC%97%86%EC%9D%8C?node-id=11-1525&t=qw1orZ7ltLAFCUiF-11

2안 진행 중
https://www.figma.com/design/21MkANJNpw1Ydw3aEB3pPM/%EC%A0%9C%EB%AA%A9-%EC%97%86%EC%9D%8C?node-id=11-3062&t=qw1orZ7ltLAFCUiF-11

** 피그마 원본 확인 불가 시 
"hackathon/images 폴더 내
ref_1a_before.png,ref_1a_during.png, ref_2a_before.png,ref_2a_during.png 참고 바람