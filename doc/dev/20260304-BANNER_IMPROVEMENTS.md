# Banner 컴포넌트 개선 문서
### 0. Windsurf
- **SWE-1.5 모델 사용**

## 변경사항 요약

### 1. 동적 위치 고정 기능
- **변경 내용**: Banner 컴포넌트를 브라우저 크기에 맞춰 동적으로 상단에 고정
- **구현 방식**: CSS `position: fixed` 속성 사용으로 상단 고정
- **반응형 디자인**: 모바일 환경에서 높이 자동 조절 (60px → 50px)

### 2. 숨기기 기능 추가
- **변경 내용**: 상단에 Title만 표시하고, 하단에 숨기기 버튼(아래 화살표) 추가
- **구현 방식**: 
  - `isHidden` 상태값으로 숨김/표시 제어
  - SVG 아이콘으로 화살표 버튼 구현
  - 클릭 시 배너가 상단으로 슬라이드되며 숨겨짐
- **애니메이션**: 0.3초 ease-in-out 전환 효과

### 3. 메인 콘텐츠 동적 크기 조절
- **변경 내용**: 배너 숨김 상태에 따라 main-content 영역 동적 크기 조절
- **구현 방식**:
  - 배너 표시 시: `margin-top: 60px` (모바일: 50px)
  - 배너 숨김 시: `margin-top: 1rem`
  - 부드러운 전환 애니메이션 적용

## 기술적 상세

### 수정된 파일

#### `src/components/Banner.tsx`
- `BannerProps` 인터페이스 추가 (`isHidden`, `onToggleHide`)
- 숨기기 버튼 및 SVG 아이콘 추가
- 불필요한 subtitle 및 placeholder 제거

#### `src/components/Banner.css`
- `position: fixed`로 상단 고정 구현
- `.banner-hidden` 클래스로 숨김 상태 스타일링
- `.hide-button` 및 `.arrow-icon` 스타일 추가
- 반응형 디자인 개선

#### `src/App.tsx`
- `isBannerHidden` 상태 추가
- `toggleBanner` 함수 구현
- Banner 컴포넌트에 props 전달
- main-content에 동적 클래스 적용

#### `src/App.css`
- `.main-content`에 `margin-top` 및 `transition` 추가
- `.main-content.banner-hidden` 클래스 추가
- 모바일 반응형 `margin-top` 조절

### 주요 특징

1. **반응형 디자인**: 데스크톱(60px)과 모바일(50px)에서 다른 높이 적용
2. **부드러운 애니메이션**: 모든 전환에 0.3초 ease-in-out 효과
3. **접근성**: `aria-label`로 스크린 리더 지원
4. **상태 관리**: 부모 컴포넌트에서 숨김 상태 중앙 관리

## 사용 방법

- 숨기기/표시: 배너 우측의 화살표 버튼 클릭
- 반응형: 브라우저 크기에 따라 자동 조절
- 상태 유지: 사용자가 선택한 숨김/표시 상태 유지

## 테스트 권장사항

1. 데스크톱/모바일 반응형 테스트
2. 숨기기/표시 애니메이션 테스트
3. main-content 크기 조절 테스트
4. 접근성 테스트 (키보드 네비게이션, 스크린 리더)
