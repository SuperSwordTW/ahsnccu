// app/layout.tsx
import type { Metadata } from "next";
import { LXGW_WenKai_TC } from "next/font/google";
import "./globals.css";

const siteFont = LXGW_WenKai_TC({ 
  subsets: ["latin"],
  weight: ["300", "400", "700"],
  variable: "--font-noto-sans-tc",
});

export const metadata: Metadata = {
  title: "國立政治大學 附屬高級中學",
  description: "政大附中學生入口網站",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-TW">
      {/* Changed bg-neutral-50 to bg-neutral-100 to give slightly more contrast against the white app container */}
      <body className={`${siteFont.className} bg-neutral-100 text-neutral-900 antialiased`}>
        {children}
      </body>
    </html>
  );
}