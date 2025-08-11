# 데연소 Vercel Starter (Free Plan)

Next.js(App Router) + Tailwind 템플릿. GitHub에 올리고 Vercel에서 Import하면 즉시 배포됩니다.

## 로컬 실행
```bash
# 1) 의존성 설치
npm i
# 또는
yarn
# 또는
pnpm i

# 2) 개발 서버
npm run dev
# http://localhost:3000
```

## 환경 변수
`.env.example` 파일을 `.env.local`로 복사하고 값을 채우세요.
Vercel 대시보드에도 동일한 키를 **Project Settings → Environment Variables**에서 추가하세요.

### 백엔드 연결 설정
```bash
# 로컬 개발 시
BACKEND_URL=http://127.0.0.1:8000

# 런팟 배포 시 (실제 런팟 URL로 변경)
BACKEND_URL=https://your-runpod-instance.runpod.io
```

## 백엔드 배포 (RunPod)

### 1. RunPod에서 컨테이너 생성
- RunPod 대시보드에서 새 Pod 생성
- Docker 이미지: `python:3.10-slim`
- 포트: 8000 노출

### 2. 백엔드 코드 업로드
```bash
# cam_backend 폴더를 RunPod에 업로드
# 또는 Git에서 클론
git clone <your-repo>
cd cam_backend
```

### 3. 의존성 설치 및 실행
```bash
pip install -r requirements.txt
python app.py
```

### 4. 프론트엔드 환경 변수 설정
런팟에서 제공하는 URL을 프론트엔드 환경 변수에 설정:
```bash
BACKEND_URL=https://your-runpod-instance.runpod.io
```

## 배포 (Vercel)
- GitHub에 푸시 → https://vercel.com/new 에서 Import
- 프레임워크는 자동 감지(Next.js)
- Build Command: `next build` (기본값)
- Output: `.next` (기본값)

## 유의사항 (무료 플랜)
- Edge Runtime(이 라우트는 1초 제한) 또는 Serverless Functions(10초 제한)을 용도에 맞게 사용하세요.
- 장기적으로 응답이 긴 API는 Background Job/Queue로 분리하는 것을 권장합니다.
