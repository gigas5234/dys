export default function Home() {
  return (
    <section className="space-y-6">
      <h2 className="text-3xl font-bold">Vercel 무료 플랜 배포 준비 완료 🎉</h2>
      <p className="text-gray-700 leading-7">
        이 템플릿은 Next.js(App Router) + Tailwind로 구성되어 있어요.
        GitHub에 푸시한 뒤 Vercel에서 Import하면 바로 배포됩니다.
      </p>
      <ul className="list-disc pl-5 space-y-2 text-gray-800">
        <li><code>.env.example</code>를 복사해 환경변수를 채우세요.</li>
        <li>API 상태 확인: <a className="underline" href="/api/health">/api/health</a></li>
        <li>브랜치 전략: <code>main</code> → Production, PR → Preview</li>
      </ul>
    </section>
  );
}
