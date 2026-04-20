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
  title: "國立政治大學附屬高級中學",
  description: "政大附中學生網站",
  metadataBase: process.env.VERCEL_URL ? new URL(`https://${process.env.VERCEL_URL}`) : new URL(`http://localhost:${process.env.PORT || 3000}`),
  openGraph: {
    title: "國立政治大學附屬高級中學",
    description: "政大附中學生網站",
    url: "/",
    siteName: "政大附中學生網站",
    locale: "zh_TW",
    type: "website",
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