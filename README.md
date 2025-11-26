# Store Management App (Hair City)

React Native 기반의 모바일 매장 관리 앱입니다. 매출·지출·고객·쿠폰 정보를 한 곳에서 확인하고 등록할 수 있도록 설계되었습니다.

## 📚 목차
- [프로젝트 개요](#프로젝트-개요)
- [주요 기능](#주요-기능)
- [기술 스택](#기술-스택)
- [프로젝트 구조](#프로젝트-구조)
- [시작하기](#시작하기)
- [환경 변수](#환경-변수)
- [개발 가이드](#개발-가이드)
- [빌드 및 배포](#빌드-및-배포)
- [문제 해결](#문제-해결)
- [라이선스 및 기여](#라이선스-및-기여)

## 프로젝트 개요
- 소규모 미용실·샵 운영자가 실시간으로 매장 지표를 관리할 수 있는 대시보드 앱
- 매출/지출 흐름, 고객 활동, 쿠폰 상태를 통합 관리
- Android와 iOS를 모두 지원하며 OTA 업데이트를 염두에 둔 구조

## 주요 기능
### 인증
- ID/비밀번호 로그인, 로그인 ID 저장, 자동 로그인, 토큰 자동 갱신
### 홈
- 오늘·월간 매출 카드, 일정 위젯, Quick Menu(매출·고객·지출 등록)
### 매출 & 지출
- 등록 모달(고객/서비스/카테고리/결제 선택), 일/월 차트, 상세 모달, Pull-to-refresh, 페이지네이션
### 고객
- 고객 CRUD, 이름·전화 즉시 검색, 기본 정보 및 최근 방문 이력
### 쿠폰
- 발급/사용/만료 상태 관리, 고객별 조회, 상태별 통계 카드

## 기술 스택
| 영역 | 사용 기술 |
| --- | --- |
| Core | React Native 0.81, React 19, TypeScript 5.8 |
| 상태 관리 | Redux Toolkit, React Redux |
| 네비게이션 | React Navigation (native, native-stack, bottom-tabs) |
| 네트워킹 | Axios, JWT Decode |
| UI/UX | RN Vector Icons, RN Calendars, RN Chart Kit, RN Toast Message, Safe Area Context |
| 스토리지 | AsyncStorage, React Native Keychain |
| 기타 | RN Config, RN Device Info |

## 프로젝트 구조
```
storeManageAppCli/
├── src/
│   ├── features/        # 인증·홈·매출·지출·고객·쿠폰 모듈
│   ├── shared/          # 공통 컴포넌트/서비스/유틸/스타일
│   ├── store/           # Redux store, slices
│   └── navigation/      # 전역 네비게이션 설정
├── assets/
├── App.tsx
├── package.json
└── ...
```

## 시작하기
### 요구사항
- Node.js 18 이상, npm 또는 yarn
- Android Studio / Xcode 등 React Native 개발 환경

### 설치 및 실행
```
git clone <repository-url>
cd storeManageAppCli
npm install          # 또는 yarn install
npm start            # 또는 yarn start
npm run android      # 또는 yarn android
npm run ios          # 또는 yarn ios
```

#### iOS 의존성
```
cd ios
bundle install
bundle exec pod install
cd ..
```

## 환경 변수
루트에 `.env` 파일을 만들고 다음 값을 설정하세요.
```
EMULATOR_API_URL=http://10.0.2.2:8080/api
PUBLIC_API_URL=http://your-api-server.com/api
```
`src/shared/services/apiClient.ts`에서 기본 URL과 타임아웃(기본 10초)을 조정할 수 있습니다.

## 개발 가이드
- TypeScript + 함수형 컴포넌트 + Hooks
- 경로 별칭: `@features`, `@shared`, `@components`, `@services`, `@utils`, `@types`, `@store`, `@assets`
- Redux Toolkit 기반 상태 관리, `loadingSlice`로 전역 로딩 제어
- Axios 인터셉터: 토큰 주입, 로딩 상태 시작/종료, 401 시 Refresh Token 갱신 및 자동 로그아웃 처리
- 스타일: `StyleSheet` 중심, 공통 스타일은 `src/shared/styles`, 태블릿 대응
- 테스트: `npm test` 또는 `yarn test`

## 빌드 및 배포
### Android
```
cd android
./gradlew assembleDebug
./gradlew assembleRelease
```

### iOS
```
cd ios
open storeManageAppCli.xcworkspace
# Xcode에서 Product → Archive 후 배포
```

## 문제 해결
- Metro 캐시 초기화: `npm start -- --reset-cache`
- 의존성 초기화: `rm -rf node_modules && npm install`
- iOS Pods 재설치: `cd ios && rm -rf Pods Podfile.lock && bundle exec pod install`
- Android 클린 빌드: `cd android && ./gradlew clean`
- API 연결 점검: `.env` URL, 기기 네트워크 권한 확인

## 라이선스 및 기여
- 이 프로젝트는 비공개로 운영됩니다.
- 기여 또는 문의는 프로젝트 관리자에게 연락하세요.
- 마지막 업데이트: 2024년

