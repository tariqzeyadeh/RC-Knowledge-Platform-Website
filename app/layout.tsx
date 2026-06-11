import { Analytics } from '@vercel/analytics/next'
import type { Metadata } from 'next'
import { IBM_Plex_Sans_Arabic, Noto_Kufi_Arabic, Geist_Mono } from 'next/font/google'
import { AppShellProvider } from '@/components/layout/shell-provider'
import { getDir } from '@/i18n'
import { getServerDictionary, getServerLocale } from '@/i18n/server'
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

export async function generateMetadata(): Promise<Metadata> {
  const dict = await getServerDictionary()
  return {
    title: dict.org.platform,
    description: dict.pages.home.heroDesc,
    generator: 'v0.app',
  }
}

export const viewport = {
  themeColor: '#1f4d36',
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const locale = await getServerLocale()
  const dir = getDir(locale)

  return (
    <html
      lang={locale}
      dir={dir}
      suppressHydrationWarning
      className={`${plexArabic.variable} ${kufiArabic.variable} ${geistMono.variable} bg-background`}
    >
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var m=document.cookie.match(/(?:^|; )locale=([^;]*)/);var l=m?m[1]:'ar';if(l!=='en')l='ar';document.documentElement.lang=l;document.documentElement.dir=l==='ar'?'rtl':'ltr';}catch(e){}})();`,
          }}
        />
      </head>
      <body className="font-sans antialiased">
        <AppShellProvider>{children}</AppShellProvider>
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
