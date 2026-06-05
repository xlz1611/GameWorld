import './globals.css'
import { ThemeProvider } from './lib/ThemeContext'
import { UserProvider } from './lib/UserContext'
import ToastContainer from './components/ui/Toast'
import GlobalLoader from './components/ui/GlobalLoader'
import AnnouncementBar from './components/features/AnnouncementBar'

export const metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'),
  title: {
    default: '游戏世界 - GameWorld - 安卓游戏下载平台',
    template: '%s | 游戏世界 | GameWorld'
  },
  description: '探索超过10,000款精品安卓游戏，免费下载、高速下载、官方正版。游戏世界(GameWorld)为您提供最好的游戏下载体验。',
  keywords: ['安卓游戏', '游戏下载', '免费游戏', '手机游戏', 'Android游戏', '游戏平台'],
  authors: [{ name: '游戏世界团队' }],
  creator: '游戏世界 GameWorld',
  publisher: '游戏世界 GameWorld',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: 'website',
    locale: 'zh_CN',
    url: '/',
    siteName: '游戏世界 GameWorld',
    title: '游戏世界 - GameWorld - 安卓游戏下载平台',
    description: '探索超过10,000款精品安卓游戏，免费下载、高速下载、官方正版。',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: '游戏世界 GameWorld Logo'
      }
    ]
  },
  twitter: {
    card: 'summary_large_image',
    title: '游戏世界 - GameWorld - 安卓游戏下载平台',
    description: '探索超过10,000款精品安卓游戏，免费下载、高速下载、官方正版。',
    images: ['/og-image.png'],
    creator: '@游戏世界GameWorld'
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
  verification: {
    google: 'google-site-verification-code',
    yandex: 'yandex-verification-code',
  },
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon-16x16.png',
    apple: '/apple-touch-icon.png',
  },
  manifest: '/manifest.json',
}

const Layout = ({ children }) => {
  return (
    <html lang="zh-CN">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet" />
      </head>
      <body>
        <ThemeProvider>
          <UserProvider>
            <GlobalLoader />
            <ToastContainer />
            <div className="min-h-screen flex flex-col">
              <AnnouncementBar />
              <main className="flex-1">
                {children}
              </main>
              <footer className="glass border-t border-white/10 mt-auto">
                <div className="container mx-auto py-8 px-6">
                  <div className="text-center">
          <p className="text-muted text-sm">© 2026 游戏世界 GameWorld. 保留所有权利.</p>
          <p className="text-muted/60 text-xs mt-2">打造最好的游戏下载体验</p>
        </div>
                </div>
              </footer>
            </div>
          </UserProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}

export default Layout