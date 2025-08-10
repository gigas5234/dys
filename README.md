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

## 배포 (Vercel)
- GitHub에 푸시 → https://vercel.com/new 에서 Import
- 프레임워크는 자동 감지(Next.js)
- Build Command: `next build` (기본값)
- Output: `.next` (기본값)

## 유의사항 (무료 플랜)
- Edge Runtime(이 라우트는 1초 제한) 또는 Serverless Functions(10초 제한)을 용도에 맞게 사용하세요.
- 장기적으로 응답이 긴 API는 Background Job/Queue로 분리하는 것을 권장합니다.
