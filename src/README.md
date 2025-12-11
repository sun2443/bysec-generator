# Fiber Twist Pattern Generator

근육 섬유의 해부학적 시각화를 위한 3D 트위스트 효과 패턴 생성기

## 기능

- ✨ 3D 트위스트 효과가 있는 부드러운 리본 같은 패턴
- 🎨 해부학적 근육 섬유 색상 팔레트
- 🔧 포괄적인 컨트롤 (두께, 밀도, 회전, 웨이브 등)
- 📐 종횡비 조절 (1:1, 16:9, 9:16, 4:3, 3:4)
- 🎭 3단계 레이어 시스템 (Background, Middle, Front)
- 💾 이미지 업로드 및 레이어별 조절
- 🔄 Save as Basic / Return to Basic 기능
- 📥 PNG/JPG 내보내기

## 배포 방법

### Vercel 배포

1. **프로젝트를 GitHub에 업로드**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin [YOUR_GITHUB_REPO_URL]
   git push -u origin main
   ```

2. **Vercel에 배포**
   - [Vercel](https://vercel.com)에 접속
   - "New Project" 클릭
   - GitHub 레포지토리 연결
   - 자동으로 배포 시작

3. **완료!**
   - Vercel이 자동으로 URL 생성
   - `https://your-project.vercel.app` 형태의 링크 공유

### 로컬 실행

```bash
# 의존성 설치
npm install

# 개발 서버 실행
npm run dev

# 프로덕션 빌드
npm run build

# 프리뷰
npm run preview
```

## 사용 방법

1. **패턴 조절**: 좌측 패널에서 다양한 파라미터 조절
2. **레이어 관리**: 우측 패널에서 레이어 가시성, 불투명도, 이미지 업로드
3. **기본 패턴 저장**: "Save as Basic" 버튼으로 현재 패턴 저장
4. **패턴 복원**: "Return to Basic" 버튼으로 저장된 패턴 복원
5. **내보내기**: 하단의 다운로드 버튼으로 PNG/JPG 저장

## 기술 스택

- React 18
- TypeScript
- Vite
- Tailwind CSS 4.0
- Canvas API
- Lucide Icons

## 라이선스

MIT License
