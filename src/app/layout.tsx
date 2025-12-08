// src/app/layout.tsx
import type { Metadata } from "next";
import "./globals.css"; // แก้ชื่อ/ที่อยู่ไฟล์ตามของจริง
export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: "Gift Recommendation",
  description: "Gift recommendation system",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
