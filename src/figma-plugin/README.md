# Fiber Twist Pattern Generator - Figma Plugin

근육 섬유의 해부학적 시각화를 위한 Figma 플러그인입니다.

## 📦 설치 방법

### 1. 파일 다운로드
다음 3개의 파일을 로컬 폴더에 저장하세요:
- `manifest.json`
- `code.js`
- `ui.html`

### 2. Figma Desktop에서 플러그인 로드

1. **Figma Desktop 앱**을 실행합니다 (웹 버전이 아닌 데스크톱 앱 필요)

2. 메뉴에서 다음을 선택:
   - **Plugins** → **Development** → **Import plugin from manifest...**

3. 저장한 `manifest.json` 파일을 선택합니다

4. 플러그인이 로드되었습니다! 🎉

## 🚀 사용 방법

### 플러그인 실행
1. Figma Desktop에서 파일을 엽니다
2. 메뉴에서 **Plugins** → **Development** → **Fiber Twist Pattern Generator** 선택
3. 플러그인 UI가 열립니다

### 패턴 생성 및 삽입
1. 우측 패널의 컨트롤로 패턴을 커스터마이즈합니다
2. 애니메이션 미리보기를 원하면 **Play** 버튼을 클릭
3. 만족스러운 패턴이 완성되면 **"Insert to Figma"** 버튼 클릭
4. 패턴이 Figma 캔버스에 이미지로 삽입됩니다!

### 주요 기능

#### 🎨 Pattern Controls
- **Line Thickness**: 선 두께 조절
- **Thickness Variation**: 두께 변화량
- **Motion Blur**: 모션 블러 효과
- **Bulge Amount**: 부풀림 정도
- **Overall Rotation**: 전체 회전
- **Wave Strength**: 웨이브 강도
- **Line Density**: 선 밀도
- **Color Repeats**: 색상 반복 횟수
- **Opacity**: 불투명도

#### 🎬 Animation Controls
- **Animation Type**: Pulse, Wave, Rotation, Flow
- **Speed**: 애니메이션 속도 (0.1x - 2.0x)
- **Play/Pause**: 애니메이션 미리보기

#### 🖼️ Export Options
- **Aspect Ratio**: 1:1, 3:4, 9:16, 16:9
- **Format**: PNG, JPG
- **Transparent Background**: PNG 투명 배경 지원
- **Background Color**: 배경색 선택

#### 🎨 Color Palette
- 6개의 해부학적 근육 섬유 팔레트
- 커스텀 색상 편집 가능
- **Randomize Pattern**: 랜덤 패턴 생성

#### ✨ Post Effects
- **Post Blur**: 후처리 블러
- **Film Grain**: 필름 그레인 효과

### 버튼 설명
- **⟲ (Reset)**: 모든 설정을 기본값으로 리셋
- **Randomize Pattern**: 새로운 랜덤 패턴 생성
- **Insert to Figma**: 현재 패턴을 Figma 캔버스에 삽입
- **↓ Download**: 패턴을 로컬에 다운로드 (PNG/JPG)

## 🛠️ 개발자 정보

### 파일 구조
```
figma-plugin/
├── manifest.json    # 플러그인 메타데이터
├── code.js         # Figma API 통신 코드
├── ui.html         # 플러그인 UI (전체 앱)
└── README.md       # 이 파일
```

### 수정하기
- **UI 수정**: `ui.html` 파일 편집
- **Figma API 로직 수정**: `code.js` 파일 편집
- **플러그인 설정 수정**: `manifest.json` 파일 편집

파일을 수정한 후:
1. Figma를 다시 시작하거나
2. **Plugins** → **Development** → **Reload plugin** 선택

## ⚠️ 주의사항

1. **Figma Desktop 필수**: 웹 버전에서는 개발 플러그인을 로드할 수 없습니다
2. **파일 위치**: 3개의 파일이 모두 같은 폴더에 있어야 합니다
3. **성능**: 높은 density 값은 렌더링이 느려질 수 있습니다

## 💡 팁

- **고해상도 출력**: 패턴은 항상 1600x1600px로 생성되어 고품질을 보장합니다
- **애니메이션**: 애니메이션은 미리보기용이며, Figma에 삽입되는 것은 정적 이미지입니다
- **투명 배경**: PNG 포맷 선택 시 투명 배경을 사용할 수 있습니다
- **색상 커스터마이즈**: 컬러 스와치를 클릭하여 개별 색상을 편집할 수 있습니다

## 🐛 문제 해결

### 플러그인이 로드되지 않음
- Figma Desktop 앱을 사용하고 있는지 확인
- 3개의 파일이 모두 같은 폴더에 있는지 확인
- Figma를 재시작해보세요

### 패턴이 Figma에 삽입되지 않음
- Figma 콘솔을 확인하세요 (Help → Toggle Developer Tools)
- "Insert to Figma" 버튼을 다시 클릭해보세요

### 애니메이션이 느림
- Line Density를 낮춰보세요
- Animation Speed를 조절해보세요

## 📝 라이선스

이 플러그인은 해부학적 시각화 목적으로 제작되었습니다.

---

**제작**: Fiber Twist Pattern Generator Team
**버전**: 1.0.0
