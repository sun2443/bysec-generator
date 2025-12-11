# 🚀 Vercel 배포 가이드

## 단계별 배포 방법

### 1️⃣ 준비 단계

모든 코드가 저장되어 있으니, 이제 코드를 다운로드해야 합니다.

**Figma Make에서 코드 다운로드:**
- 프로젝트 전체를 ZIP 파일로 다운로드
- 압축 해제

---

### 2️⃣ GitHub 레포지토리 생성

1. **GitHub 접속**: https://github.com
2. **로그인** (계정이 없다면 무료로 가입)
3. **New Repository 클릭** (우측 상단 + 버튼)
4. **레포지토리 설정**:
   - Repository name: `fiber-pattern-generator` (원하는 이름)
   - Public (무료) 선택
   - "Create repository" 클릭

---

### 3️⃣ 코드를 GitHub에 업로드

#### 방법 A: GitHub 웹 인터페이스 (쉬운 방법)

1. GitHub 레포지토리 페이지에서 "uploading an existing file" 클릭
2. 다운로드한 모든 파일을 드래그 앤 드롭
3. "Commit changes" 클릭

#### 방법 B: Git CLI (개발자용)

```bash
# 프로젝트 폴더로 이동
cd fiber-pattern-generator

# Git 초기화
git init

# 모든 파일 추가
git add .

# 커밋
git commit -m "Initial commit: Fiber Twist Pattern Generator"

# GitHub 레포지토리 연결 (YOUR_USERNAME을 본인 GitHub 아이디로 변경)
git remote add origin https://github.com/YOUR_USERNAME/fiber-pattern-generator.git

# 업로드
git branch -M main
git push -u origin main
```

---

### 4️⃣ Vercel에 배포

1. **Vercel 접속**: https://vercel.com
2. **GitHub로 로그인** (무료)
3. **"Add New..." → "Project" 클릭**
4. **GitHub 레포지토리 연결**:
   - "Import Git Repository" 선택
   - 방금 만든 레포지토리 선택
   - "Import" 클릭
5. **자동 설정 확인**:
   - Framework Preset: Vite (자동 감지됨)
   - Build Command: `npm run build` (자동 설정됨)
   - Output Directory: `dist` (자동 설정됨)
   - "Deploy" 클릭!

---

### 5️⃣ 배포 완료! 🎉

- 2-3분 후 배포 완료
- Vercel이 자동으로 URL 생성:
  - 예: `https://fiber-pattern-generator.vercel.app`
  - 또는 `https://fiber-pattern-generator-abc123.vercel.app`

**이 링크를 복사해서 외부인에게 공유하면 끝!**

---

## ⚡ 추가 기능

### 커스텀 도메인 연결 (선택사항)

1. Vercel 프로젝트 → Settings → Domains
2. 본인 소유 도메인 추가 가능
3. 예: `pattern.yourdomain.com`

### 자동 업데이트

- GitHub에 코드를 푸시하면 Vercel이 자동으로 재배포
- 항상 최신 버전 유지

---

## 🆘 문제 해결

### 빌드 실패 시:

1. Vercel 대시보드에서 "Deployments" → "Build Logs" 확인
2. 오류 메시지 확인
3. 필요시 도움 요청

### 이미지/에셋이 안 보일 때:

- `figma:asset` import가 정상 작동하는지 확인
- `/imports` 폴더의 파일들이 모두 업로드되었는지 확인

---

## 📞 연락처

문제가 있으면 언제든지 물어보세요!

---

## ✅ 체크리스트

배포 전 확인사항:

- [ ] 모든 코드 파일이 저장됨
- [ ] GitHub 계정 생성 완료
- [ ] GitHub 레포지토리 생성 완료
- [ ] 코드 업로드 완료
- [ ] Vercel 계정 생성 완료
- [ ] Vercel에 레포지토리 연결 완료
- [ ] 배포 성공!
- [ ] 링크 테스트 완료
- [ ] 외부인에게 링크 공유!
