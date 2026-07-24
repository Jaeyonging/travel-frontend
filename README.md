# 강원 플랜잇 (Gangwon Plan-It)

SNS 링크 하나로 강원도 여행 일정을 만들어 주는 웹앱입니다. 지금은 프론트엔드만 구현한 프로토타입입니다.

유튜브나 인스타그램 링크를 붙여넣으면 AI가 영상 속 강원도 여행지를 찾아냅니다. 찾아낸 장소는 한국관광공사 OpenAPI로 실제로 있는 곳인지 확인하고, 카카오지도에서 계산한 거리와 소요시간을 반영해서 실제로 다닐 수 있는 일정으로 만들어 줍니다.

> 아직 백엔드가 없습니다. 화면에 보이는 데이터는 모두 `src/data` 폴더의 목업 JSON이고, 어떤 링크를 넣어도 미리 준비된 분석 결과 중 하나가 나옵니다.

## 실행 방법

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # 배포용 빌드, 결과는 dist 폴더
npm run preview  # 빌드 결과 확인, 서비스 워커까지 동작합니다
```

PWA 아이콘을 다시 만들려면 `node scripts/gen-icons.mjs`를 실행하세요. 192, 512, 180 크기의 PNG가 생성됩니다.

## 화면 구성

모바일 앱처럼 보이도록 만들었습니다. 데스크톱에서도 가운데에 480px 폭으로 앱 화면이 뜨고, 아래쪽 탭 5개로 이동합니다.

| 경로 | 화면 | 내용 |
| --- | --- | --- |
| `/` | 홈 | 맨 위에 SNS 링크 입력창이 있고, 아래로 내리면 진행 중인 여행, 담은 곳, 인기 장소, 콘텐츠 목록, 축제, 권역, 테마 모음이 나옵니다 |
| `/extract/result` | 분석 결과 | 분석 진행 화면을 보여준 뒤 찾아낸 장소를 목록으로 띄웁니다. 확정, 유력, 확인필요 세 단계로 표시하고 한 번에 담을 수 있습니다 |
| `/explore` | 탐색 | 검색창, 권역과 카테고리 필터, 정렬 기능 |
| `/saved` | 담은 곳 | 담아둔 장소를 지도와 목록으로 보여주고, 아래쪽에 일정 만들기 버튼이 있습니다 |
| `/plan/new` | 일정 만들기 | 기간, 이동수단, 동행, 취향, 일정 밀도를 한 화면에서 고릅니다 |
| `/plan/:id` | 일정 결과 | Day 탭, 동선 지도, 이동 거리와 시간이 표시된 타임라인, 권역 경고, 장소를 뺐을 때 대체 장소 추천, 공유 기능 |
| `/trips` | 내 일정 | 저장한 일정 목록 |
| `/my` | MY | 프로필, 등록한 콘텐츠, 앱 설치, 로드맵 |

### 기획서 내용이 구현된 위치

- SNS 링크로 장소 자동 추출: `/`와 `/extract/result`
- 공공데이터 검증 세 단계(확정, 유력, 확인필요): `VerifyChip` 컴포넌트와 장소 상세 화면의 "공공데이터 검증" 영역
- 통합 여행 후보함: `/saved`, SNS에서 담은 것과 AI 추천, 직접 추가한 것을 구분해서 보여줍니다
- AI 일정 자동 생성과 동선 보기: `/plan/new`와 `/plan/:id`
- 권역 기반 설계와 일정 분리 제안: 홈의 권역 섹션과 일정 결과 화면의 경고 배너
- 대체 장소 추천: 일정에서 장소를 빼면 근처 후보 3곳을 제안합니다

## PWA와 스토어 배포

설치해서 쓸 수 있는 웹앱으로 만들어 두었습니다.

- `public/manifest.webmanifest`에 앱 이름, 아이콘, 전체화면 설정, 바로가기, 공유 대상 설정이 들어 있습니다. 공유 대상 설정 덕분에 인스타그램이나 유튜브 앱의 공유 버튼으로 링크를 바로 보낼 수 있습니다.
- `public/sw.js`는 앱 화면을 캐시에 저장해 두고, 인터넷이 끊겼을 때 대신 보여줍니다. 개발 중에는 캐시 때문에 헷갈릴 수 있어서 빌드된 앱에서만 동작합니다.
- `src/hooks/usePwaInstall.ts`는 홈 화면에 추가하기 기능을 담당합니다. MY 탭의 "앱으로 설치하기" 버튼에서 씁니다.

스토어에 올릴 때는 이렇게 하면 됩니다.

1. `npm run build`로 만든 `dist` 폴더를 HTTPS 도메인에 올립니다. 한 페이지짜리 앱이라 모든 경로가 `index.html`로 연결되도록 설정해야 합니다.
2. 구글 플레이는 [PWABuilder](https://pwabuilder.com)나 Bubblewrap으로 감싼 뒤 AAB 파일을 올립니다. `assetlinks.json`으로 도메인이 내 것임을 증명하는 과정이 필요합니다.
3. 앱스토어는 PWA를 그대로 올릴 수 없어서 PWABuilder의 iOS 패키지나 Capacitor로 한 번 감싸야 합니다.
4. 스토어 스크린샷과 대표 이미지는 따로 준비해야 합니다.

## 기술 스택

React 18, TypeScript, Vite 5, Tailwind CSS 3, React Router 6을 썼습니다. 외부 UI 라이브러리는 쓰지 않았습니다.

## 폴더 구조

역할별로 나누는 방식과 기능별로 나누는 방식을 섞었습니다. 화면 파일은 조립만 하고, 실제 UI 조각은 `features`와 `components`에 들어 있습니다.

```
src/
  app/                 앱 시작점. Provider 구성, 라우터, 경로 상수
    App.tsx  AppProviders.tsx  AppRouter.tsx  routes.ts
  pages/               화면 9개. 조립만 담당하고 100줄에서 190줄 사이입니다
  features/            기능별 UI와 훅, 유틸
    home/              링크 입력창, 축제와 권역, 테마 모음 카드
    places/            장소 카드와 목록, 상세 화면, 검증 배지, 검색 필터 훅
    sns/               SNS 썸네일과 원본 카드, 추출 결과 목록, 분석 훅
    itinerary/         일정 상단 영역, 요약, 경고, Day 탭, 타임라인, 대체 장소, 생성 훅
    settings/          개발용 오류 테스트 화면
  components/          어디서나 쓰는 공용 컴포넌트
    ui/                Button, Chip, Sheet, Section, StatRow, EmptyState 등 한 파일에 하나씩
    layout/            AppShell, BottomTabBar, PageTransition, TopBar, navigation
    feedback/          ErrorBoundary, ErrorState, LoadingScreen, OfflineBanner, ToastProvider
    icon/              Icon 컴포넌트와 아이콘 path 데이터
    photo/             일러스트 그리는 부분. Photo, scenes, moods, random
    map/               목업 지도. MockMap, projection, geometry, coastline, MapMarker
  store/               전역 상태. Context와 셀렉터 훅
  hooks/               useAsync, useOnlineStatus, usePwaInstall, useTimedSteps
  lib/
    api/               errors, http, mockApi, simulate. 백엔드 붙일 때 여기를 고칩니다
    constants/         place, trip. 라벨과 선택지, 색상
    format/            date, number
    cn.ts geo.ts scene.ts
  types/               domain.ts는 데이터 모델, api.ts는 요청과 응답
  data/                목업 JSON
```

### 코드 작성 규칙

- 한 파일에 컴포넌트 하나만 둡니다. 어디서나 쓰는 건 `components/ui`에, 특정 기능에서만 쓰는 건 `features` 아래 각 폴더에 넣습니다.
- 폴더마다 `index.ts`를 두고 그 파일을 통해서만 가져다 씁니다. `@/features/places`처럼 폴더 이름으로 가져오면 되고, 안쪽 파일 경로를 알 필요가 없습니다.
- 화면 파일에서 데이터를 만들지 않습니다. 서버 호출은 `lib/api`, 상태는 `store`, 계산은 각 기능 폴더의 `utils`에 둡니다.
- 라벨이나 문구를 코드 여기저기에 흩어놓지 않습니다. 카테고리, 검증 단계, 이동수단 이름은 모두 `lib/constants`에 모아뒀습니다.

## 에러 처리

세 겹으로 막습니다.

| 어디서 | 파일 | 무엇을 잡는지 |
| --- | --- | --- |
| 앱 전체 | `app/AppProviders.tsx` | Provider와 라우터가 시작할 때 나는 오류 |
| 화면마다 | `components/layout/AppShell.tsx` | 화면을 그리다 나는 오류. 아래 탭은 그대로 남고, 다른 화면으로 이동하면 저절로 복구됩니다 |
| 요청 실패 | `hooks/useAsync`와 `components/feedback/ErrorState` | 서버 요청이 실패했을 때 |

어떤 오류가 나든 `lib/api/errors.ts`의 `ApiError` 하나로 바꿔서 다룹니다. 종류마다 사용자에게 보여줄 문구가 정해져 있습니다.

- `offline`은 인터넷이 끊긴 경우입니다. 요청을 보내기 전에 확인하고, 화면 위쪽에 배너를 계속 띄웁니다.
- `network`와 `timeout`은 서버에 닿지 못한 경우입니다. 15초가 지나면 요청을 끊습니다.
- `unauthorized(401)`, `forbidden(403)`, `notFound(404)`는 다시 시도해도 똑같기 때문에 재시도 버튼을 감춥니다.
- `rateLimit(429)`은 공공데이터 조회 한도를 넘긴 경우입니다.
- 그 밖에 `server(5xx)`, `parse`, `unknown`이 있습니다.

### 오류 화면 확인하는 법

백엔드가 없어도 실제 실패 상황을 그대로 볼 수 있습니다.

- 주소 뒤에 `?simulate=403`을 붙이면 403 화면이 뜹니다. `?simulate=0`은 인터넷 끊김, `?simulate=429`와 `?simulate=500`도 됩니다. 되돌리려면 `?simulate=off`를 붙이세요.
- MY 탭에 있는 "개발자, 오류 화면 테스트"에서 골라도 됩니다. 다음 요청부터 적용됩니다.
- 오프라인 배너는 브라우저 개발자 도구의 Network 탭에서 Offline을 켜면 볼 수 있습니다.

## 백엔드 붙일 때 고칠 곳

- `src/lib/api/mockApi.ts`: `analyzeSnsUrl`과 `generateItinerary` 안쪽을 `http.ts`의 `request()` 호출로 바꾸면 됩니다. 화면 코드는 건드리지 않아도 됩니다.
- `src/store/AppStoreContext.tsx`: 지금은 JSON을 메모리에 올려두고 씁니다. 서버에서 받아오도록 바꾸세요.
- `src/components/map/MockMap.tsx`: 카카오지도 SDK로 교체하세요.
- `src/components/photo`: 관광공사 이미지 조회 결과인 `firstimage`로 교체하세요.
