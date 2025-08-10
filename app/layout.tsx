import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: process.env.NEXT_PUBLIC_APP_NAME || "데연소",
  description: "AI 데이팅 코칭 플랫폼 - 데연소 (무료 Vercel 배포 스타터)",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <body className="min-h-screen bg-white text-gray-900 antialiased">
        <div className="mx-auto max-w-4xl px-6 py-10">
          <header className="flex items-center justify-between">
            <h1 className="text-2xl font-semibold">
              {process.env.NEXT_PUBLIC_APP_NAME || "데연소"}
            </h1>
            <a
              className="text-sm underline underline-offset-4 hover:opacity-80"
              href="/api/health"
            >
              Health
            </a>
          </header>
          <main className="mt-8">{children}</main>
          <footer className="mt-12 text-sm text-gray-500">© {new Date().getFullYear()} Deyeonso</footer>
        </div>
      </body>
    </html>
  );
}
