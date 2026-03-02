import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "순간 — 찰나의 기록",
  description: "모든 기록은 고객님의 기기에만 안전하게 보관됩니다.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body>{children}</body>
    </html>
  );
}
