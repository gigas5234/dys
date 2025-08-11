import dynamic from "next/dynamic";
const WebcamAnalyzer = dynamic(() => import("@/components/WebcamAnalyzer"), { ssr: false });

export default function LivePage() {
  return (
    <main className="min-h-screen p-6">
      <h1 className="text-xl font-semibold mb-4">실시간 분석</h1>
      <WebcamAnalyzer />
    </main>
  );
}
