# Store Management App (Hair City)

매장 관리를 위한 React Native 모바일 애플리케이션입니다. 매출, 지출, 고객, 쿠폰 관리를 통합적으로 제공합니다.

## 📋 목차

- [주요 기능](#주요-기능)
- [기술 스택](#기술-스택)
- [프로젝트 구조](#프로젝트-구조)
- [시작하기](#시작하기)
- [환경 설정](#환경-설정)
- [주요 기능 상세](#주요-기능-상세)
- [개발 가이드](#개발-가이드)
- [빌드 및 배포](#빌드-및-배포)

## 🎯 주요 기능

### 1. 인증 시스템
- 사용자 로그인/로그아웃
- 자동 로그인 (Refresh Token 기반)
- 토큰 자동 갱신
- 로그인 ID 기억하기

### 2. 홈 화면
- 오늘 매출 현황 표시
- 일정 관리 (추가, 수정, 삭제, 완료 처리)
- Quick Menu (매출 등록, 고객 등록, 지출 등록)
- 날짜별 일정 조회

### 3. 매출 관리
- 매출 등록 (고객 선택, 서비스, 쿠폰, 포인트 사용)
- 일별/월별 매출 차트
- 오늘/이번 달 매출 요약
- 날짜별 매출 목록 조회
- 매출 상세 정보 및 삭제

### 4. 지출 관리
- 지출 등록 (카테고리, 금액, 메모)
- 일별/월별 지출 차트
- 오늘/이번 달 지출 요약
- 날짜별 지출 목록 조회
- 지출 상세 정보 및 삭제

### 5. 고객 관리
- 고객 등록/수정/삭제
- 고객 검색 (이름, 전화번호)
- 고객 상세 정보 조회
- 최근 방문 이력 표시

### 6. 쿠폰 관리
- 쿠폰 발급 (고객별)
- 쿠폰 사용/미사용 상태 관리
- 쿠폰 필터링 (전체/사용가능/사용됨/만료됨)
- 고객별 쿠폰 조회

## 🛠 기술 스택

### Core
- **React Native** 0.81.0
- **React** 19.1.0
- **TypeScript** 5.8.3

### 상태 관리
- **Redux Toolkit** 2.8.2
- **React Redux** 9.2.0

### 네비게이션
- **React Navigation** 7.x
  - `@react-navigation/native`
  - `@react-navigation/native-stack`
  - `@react-navigation/bottom-tabs`

### 네트워킹
- **Axios** 1.11.0
- **JWT Decode** 4.0.0

### UI/UX
- **React Native Vector Icons** 10.3.0
- **React Native Calendars** 1.1306.0
- **React Native Chart Kit** 6.12.0
- **React Native Toast Message** 2.3.3
- **React Native Safe Area Context** 5.6.1

### 스토리지
- **AsyncStorage** 2.2.0
- **React Native Keychain** 10.0.0

### 기타
- **React Native Config** 1.5.6 (환경 변수 관리)
- **React Native Device Info** 14.0.4 (기기 정보)

## 📁 프로젝트 구조

```
storeManageAppCli/
├── src/
│   ├── features/              # 기능별 모듈
│   │   ├── auth/             # 인증 관련
│   │   │   ├── screens/      # LoginScreen.tsx
│   │   │   ├── hooks/        # useOrientation.ts
│   │   │   ├── types/        # 타입 정의
│   │   │   └── styles/       # 스타일
│   │   ├── home/             # 홈 화면
│   │   │   ├── screens/      # HomeScreen.tsx
│   │   │   ├── components/  # AddScheduleModal.tsx
│   │   │   └── styles/
│   │   ├── sales/            # 매출 관리
│   │   │   ├── screens/      # SalesScreen.tsx
│   │   │   ├── components/   # SalesRegisterModal, SalesDetailModal 등
│   │   │   ├── hooks/        # useSalesData.ts
│   │   │   ├── services/     # salesService.ts
│   │   │   ├── types/        # sales.types.ts
│   │   │   └── styles/
│   │   ├── expense/          # 지출 관리
│   │   │   ├── screens/      # ExpenseScreen.tsx
│   │   │   ├── components/   # ExpenseRegisterModal, ExpenseDetailModal
│   │   │   ├── hooks/        # useExpenseData.ts
│   │   │   ├── services/     # expenseService.ts
│   │   │   ├── types/        # expense.types.ts
│   │   │   └── styles/
│   │   ├── customer/         # 고객 관리
│   │   │   ├── screens/      # CustomerScreen.tsx
│   │   │   ├── components/   # CustomerModal, CustomerDetailModal
│   │   │   └── types/        # customerTypes.ts
│   │   └── coupon/           # 쿠폰 관리
│   │       ├── screens/      # CouponScreen.tsx
│   │       ├── components/   # CouponModal, CouponCard 등
│   │       ├── services/
│   │       ├── types/
│   │       └── styles/
│   ├── shared/               # 공유 컴포넌트 및 유틸리티
│   │   ├── components/       # 공통 컴포넌트
│   │   │   ├── TabNavigator.tsx
│   │   │   ├── CalendarModal.tsx
│   │   │   ├── CustomTextInput.tsx
│   │   │   ├── GlobalSpinner.tsx
│   │   │   ├── InlineSpinner.tsx
│   │   │   ├── LoadingDots.tsx
│   │   │   └── ThemedText.tsx
│   │   ├── services/         # 공통 서비스
│   │   │   ├── apiClient.ts  # Axios 인스턴스 및 인터셉터
│   │   │   ├── authService.ts
│   │   │   └── tokenManager.ts
│   │   ├── utils/            # 유틸리티 함수
│   │   │   ├── alertUtils.ts
│   │   │   ├── debugUtils.ts
│   │   │   └── navigateUtils.ts
│   │   ├── styles/           # 공통 스타일
│   │   ├── types/            # 공통 타입
│   │   └── config/           # 설정 파일
│   │       └── calendarConfig.ts
│   ├── store/                # Redux Store
│   │   ├── index.ts
│   │   └── loadingSlice.ts
│   └── navigation/           # 네비게이션 설정
├── assets/                   # 이미지 및 리소스
├── android/                  # Android 네이티브 코드
├── ios/                      # iOS 네이티브 코드
├── App.tsx                   # 앱 진입점
├── index.js                  # 엔트리 포인트
├── package.json
├── tsconfig.json
├── babel.config.js
└── metro.config.js
```

## 🚀 시작하기

### 필수 요구사항

- **Node.js** >= 18
- **npm** 또는 **yarn**
- **React Native 개발 환경**
  - Android: Android Studio, JDK
  - iOS: Xcode, CocoaPods (macOS만)

### 설치

1. **저장소 클론**
```bash
git clone <repository-url>
cd storeManageAppCli
```

2. **의존성 설치**
```bash
npm install
# 또는
yarn install
```

3. **iOS 의존성 설치** (iOS만 해당)
```bash
cd ios
bundle install
bundle exec pod install
cd ..
```

### 실행

1. **Metro 번들러 시작**
```bash
npm start
# 또는
yarn start
```

2. **앱 실행**

**Android:**
```bash
npm run android
# 또는
yarn android
```

**iOS:**
```bash
npm run ios
# 또는
yarn ios
```

## ⚙️ 환경 설정

### 환경 변수 설정

프로젝트 루트에 `.env` 파일을 생성하고 다음 변수들을 설정하세요:

```env
# 에뮬레이터용 API URL
EMULATOR_API_URL=http://10.0.2.2:8080/api

# 실제 기기용 API URL
PUBLIC_API_URL=http://your-api-server.com/api
```

### API 클라이언트 설정

`src/shared/services/apiClient.ts`에서 API 기본 URL과 타임아웃을 설정할 수 있습니다.

- **기본 타임아웃**: 10초
- **자동 토큰 갱신**: Access Token 만료 시 자동으로 Refresh Token으로 갱신
- **로딩 상태 관리**: 모든 API 요청에 대해 자동으로 로딩 상태 관리

## 📱 주요 기능 상세

### 인증 시스템

#### 로그인
- 사용자 ID와 비밀번호로 로그인
- 로그인 ID 기억하기 기능
- 자동 로그인 (Refresh Token 유효 시)

#### 토큰 관리
- **Access Token**: API 요청 시 사용, 짧은 유효 기간
- **Refresh Token**: Access Token 갱신용, 긴 유효 기간
- 자동 토큰 갱신 (3일 전에 Refresh Token 갱신)
- 토큰 만료 시 자동 로그아웃

### 홈 화면

#### 오늘 매출 카드
- 실시간 오늘 매출 금액 표시
- API에서 자동으로 업데이트

#### 일정 관리
- 날짜별 일정 추가/수정/삭제
- 일정 완료 처리
- 날짜 네비게이션 (이전/다음 날)
- 캘린더 모달로 날짜 선택
- 일정 최대 3개 표시, 더보기 기능

#### Quick Menu
- **매출 등록**: 매출 등록 화면으로 이동
- **고객 등록**: 고객 등록 모달 열기
- **지출 등록**: 지출 등록 모달 열기

### 매출 관리

#### 매출 등록
- 고객 선택 (기존 고객 또는 게스트)
- 서비스 선택 및 금액 입력
- 쿠폰 적용
- 포인트 사용
- 결제 수단 선택 (카드/현금)
- 방문 날짜 및 시간 설정

#### 매출 조회
- 오늘/이번 달 매출 요약
- 일별/월별 매출 차트 (Line Chart)
- 날짜별 매출 목록
- 매출 상세 정보 모달
- Pull-to-refresh 지원
- 페이지네이션 (더보기)

#### 차트 기능
- 일별/월별 전환
- 차트 점 클릭 시 상세 정보 툴팁 표시
- 날짜 범위 표시

### 지출 관리

#### 지출 등록
- 카테고리 선택 (임대료, 급여, 재료비, 기타 등)
- 금액 입력
- 메모 입력
- 지출 날짜 선택

#### 지출 조회
- 오늘/이번 달 지출 요약
- 일별/월별 지출 차트 (Line Chart)
- 날짜별 지출 목록
- 지출 상세 정보 모달
- Pull-to-refresh 지원
- 페이지네이션 (더보기)

### 고객 관리

#### 고객 CRUD
- 고객 등록 (이름, 전화번호)
- 고객 수정
- 고객 삭제 (확인 다이얼로그)
- 고객 목록 조회

#### 검색 기능
- 이름 또는 전화번호로 검색
- 실시간 필터링
- 이름 순 정렬

#### 고객 상세
- 고객 기본 정보
- 최근 방문 이력
- 관련 매출 정보

### 쿠폰 관리

#### 쿠폰 발급
- 고객 선택
- 쿠폰 정보 입력 (이름, 할인율, 유효기간)
- 쿠폰 발급

#### 쿠폰 조회
- 전체/사용가능/사용됨/만료됨 필터링
- 고객별 필터링
- 쿠폰 통계 (전체/사용가능/사용됨/만료됨 개수)
- Pull-to-refresh 지원

## 💻 개발 가이드

### 코드 스타일

- **TypeScript** 사용
- **함수형 컴포넌트** 및 **Hooks** 사용
- **경로 별칭** 사용 (`@features`, `@shared`, `@components` 등)

### 경로 별칭

프로젝트에서 사용하는 경로 별칭:

- `@features/*` → `src/features/*`
- `@shared/*` → `src/shared/*`
- `@components/*` → `src/shared/components/*`
- `@services/*` → `src/shared/services/*`
- `@utils/*` → `src/shared/utils/*`
- `@types/*` → `src/shared/types/*`
- `@store` → `src/store`
- `@assets/*` → `assets/*`

### 상태 관리

- **Redux Toolkit** 사용
- 현재 구현된 Slice:
  - `loadingSlice`: 전역 로딩 상태 관리

### API 통신

- **Axios** 기반 HTTP 클라이언트
- **인터셉터**를 통한 자동 처리:
  - 요청: 토큰 추가, 로딩 시작
  - 응답: 데이터 변환, 로딩 종료, 에러 처리
  - 토큰 갱신: 401 에러 시 자동 Refresh Token 갱신

### 컴포넌트 구조

각 Feature는 다음과 같은 구조를 가집니다:

```
feature/
├── screens/        # 화면 컴포넌트
├── components/     # 기능별 컴포넌트
├── hooks/          # 커스텀 훅
├── services/       # API 서비스
├── types/          # 타입 정의
└── styles/         # 스타일
```

### 스타일링

- **StyleSheet** 사용
- 공통 스타일은 `src/shared/styles`에 정의
- 반응형 디자인 지원 (태블릿/모바일)

### 테스트

```bash
npm test
# 또는
yarn test
```

## 📦 빌드 및 배포

### Android 빌드

1. **디버그 APK 빌드**
```bash
cd android
./gradlew assembleDebug
```

2. **릴리즈 APK 빌드**
```bash
cd android
./gradlew assembleRelease
```

### iOS 빌드

1. **Xcode에서 프로젝트 열기**
```bash
cd ios
open storeManageAppCli.xcworkspace
```

2. **Xcode에서 빌드 및 배포**
   - Product → Archive
   - App Store Connect에 업로드

## 🔧 문제 해결

### 일반적인 문제

1. **Metro 번들러 캐시 문제**
```bash
npm start -- --reset-cache
```

2. **node_modules 재설치**
```bash
rm -rf node_modules
npm install
```

3. **iOS Pod 재설치**
```bash
cd ios
rm -rf Pods Podfile.lock
bundle exec pod install
```

4. **Android 빌드 클린**
```bash
cd android
./gradlew clean
```

### API 연결 문제

- `.env` 파일의 API URL 확인
- 에뮬레이터: `EMULATOR_API_URL` 사용
- 실제 기기: `PUBLIC_API_URL` 사용
- 네트워크 권한 확인 (Android: `AndroidManifest.xml`)

## 📝 라이선스

이 프로젝트는 비공개 프로젝트입니다.

## 👥 기여

프로젝트 기여에 대한 문의는 프로젝트 관리자에게 연락하세요.

---

**마지막 업데이트**: 2024년
