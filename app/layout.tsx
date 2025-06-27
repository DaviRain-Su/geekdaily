import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { SpeedInsights } from '@vercel/speed-insights/next';
import { Analytics } from '@vercel/analytics/react';
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "极客日报 - 技术文章聚合平台",
  description: "每日精选技术文章和资源聚合，获取最新的技术动态和开发资源",
  keywords: ["极客日报", "技术文章", "开发资源", "编程", "技术资讯", "软件开发"],
  authors: [{ name: "极客日报" }],
  creator: "极客日报",
  publisher: "极客日报",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://geekdaily.vercel.app'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: "极客日报 - 技术文章聚合平台",
    description: "每日精选技术文章和资源聚合，获取最新的技术动态和开发资源",
    url: 'https://geekdaily.vercel.app',
    siteName: '极客日报',
    locale: 'zh_CN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: "极客日报 - 技术文章聚合平台",
    description: "每日精选技术文章和资源聚合，获取最新的技术动态和开发资源",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
        <SpeedInsights />
        <Analytics />
      </body>
    </html>
  );
}
