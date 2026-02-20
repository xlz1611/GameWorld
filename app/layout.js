import './globals.css'

const Layout = ({ children }) => {
  return (
    <html lang="zh-CN">
      <body>
        <div className="min-h-screen flex flex-col">
          <header className="glass sticky top-0 z-50 border-b border-white/10 backdrop-blur-xl">
            <div className="container mx-auto px-6 py-4">
              <div className="flex justify-between items-center">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-primary to-emerald-600 rounded-xl flex items-center justify-center glow">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <h1 className="text-2xl font-bold text-gradient">安卓游戏下载站</h1>
                </div>
                <nav>
                  <ul className="flex space-x-8">
                    <li>
                      <a href="/" className="text-foreground/80 hover:text-primary transition-colors duration-300 font-medium">首页</a>
                    </li>
                    <li>
                      <a href="/admin" className="text-foreground/80 hover:text-primary transition-colors duration-300 font-medium">管理端</a>
                    </li>
                  </ul>
                </nav>
              </div>
            </div>
          </header>
          <main className="flex-1 container mx-auto py-12 px-6">
            {children}
          </main>
          <footer className="glass border-t border-white/10 mt-auto">
            <div className="container mx-auto py-8 px-6">
              <div className="text-center">
                <p className="text-foreground/60 text-sm">© 2026 安卓游戏下载站. 保留所有权利.</p>
                <p className="text-foreground/40 text-xs mt-2">打造最好的游戏下载体验</p>
              </div>
            </div>
          </footer>
        </div>
      </body>
    </html>
  )
}

export default Layout
