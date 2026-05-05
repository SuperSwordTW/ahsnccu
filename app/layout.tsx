// app/layout.tsx
import type { Metadata } from "next";
import { LXGW_WenKai_TC } from "next/font/google";
import { Analytics } from '@vercel/analytics/next';
import { SpeedInsights } from '@vercel/speed-insights/next';
import "./globals.css";

const siteFont = LXGW_WenKai_TC({ 
  subsets: ["latin"],
  weight: ["300", "400", "700"],
  variable: "--font-noto-sans-tc",
});

export const metadata: Metadata = {
  title: "政大附中學生網站 | 國立政治大學附屬高級中學 (AHSNCCU)",
  description: "政大附中官方學生資訊平台。提供最新校園公告、各年級分類資訊、學生專區及校園行事曆。",
  keywords: ["政大附中", "國立政治大學附屬高級中學", "AHSNCCU", "政大附中學生網站", "校園公告", "學生專區", "行事曆", "政大附中公告", "政大附中學生專區", "政大附中行事曆", "政大附中官網", "政大附中網站"],
  metadataBase: new URL(
  process.env.NODE_ENV === 'production'
    ? 'https://ahsnccu.vercel.app' // <-- Change this to your actual custom domain
    : process.env.VERCEL_URL
    ? `https://${process.env.VERCEL_URL}`
    : `http://localhost:${process.env.PORT || 3000}`
  ),
  openGraph: {
    title: "政大附中學生網站 | 國立政治大學附屬高級中學 (AHSNCCU)",
    description: "政大附中官方學生資訊平台。提供最新校園公告、學生專區及校園行事曆。",
    url: "/",
    siteName: "政大附中學生網站",
    locale: "zh_TW",
    type: "website",
  },
  alternates: {
    canonical: "/",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-TW" style={{ fontSize: "110%" }}>
      {/* Changed bg-neutral-50 to bg-neutral-100 to give slightly more contrast against the white app container */}
      <body className={`${siteFont.className} bg-neutral-100 text-neutral-900 antialiased`}>
        {children}
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}