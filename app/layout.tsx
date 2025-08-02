import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "공포의 기억을 걷는 - 회고 서비스",
  description: "당신의 무서웠던 경험을 3D 공간에서 회고하는 인터랙티브 서비스",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" className="dark">
      <body className="font-pretendard bg-black text-white antialiased">
        {children}
      </body>
    </html>
  );
}
