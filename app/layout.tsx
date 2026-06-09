import { Analytics } from '@vercel/analytics/next'
import type { Metadata } from 'next'
import { IBM_Plex_Sans_Arabic, Noto_Kufi_Arabic, Geist_Mono } from 'next/font/google'
import './globals.css'

const plexArabic = IBM_Plex_Sans_Arabic({
  variable: '--font-plex-arabic',
  subsets: ['arabic', 'latin'],
  weight: ['300', '400', '500', '600', '700'],
})

const kufiArabic = Noto_Kufi_Arabic({
  variable: '--font-kufi',
  subsets: ['arabic'],
  weight: ['400', '500', '600', '700', '800'],
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
})

export const metadata: Metadata = {
  title: 'منصة إدارة المعرفة | الديوان الملكي',
  description:
    'منصة إدارة المعرفة لمكتب شؤون المهمات والمبادرات — توثيق ونقل وتنظيم واستخدام المعرفة المؤسسية وفق نموذج SECI ومعايير ISO 30401 والنموذج الوطني للتميز.',
  generator: 'v0.app',
}

export const viewport = {
  themeColor: '#1f4d36',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="ar"
      dir="rtl"
      className={`${plexArabic.variable} ${kufiArabic.variable} ${geistMono.variable} bg-background`}
    >
      <body className="font-sans antialiased">
        {children}
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
