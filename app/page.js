'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Search, Gamepad2, Star, Download } from 'lucide-react'

const Home = () => {
  const [games, setGames] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [filteredGames, setFilteredGames] = useState([])

  useEffect(() => {
    const fetchGames = async () => {
      try {
        const res = await fetch('/api/games')
        if (res.ok) {
          const data = await res.json()
          setGames(data)
          setFilteredGames(data)
        }
      } catch (error) {
        console.error('获取游戏列表失败:', error)
      }
    }

    fetchGames()
  }, [])

  useEffect(() => {
    if (searchTerm) {
      setFilteredGames(games.filter(game => 
        game.name.toLowerCase().includes(searchTerm.toLowerCase())
      ))
    } else {
      setFilteredGames(games)
    }
  }, [searchTerm, games])

  return (
    <div>
      <div className="mb-12">
        <div className="text-center mb-8">
          <h2 className="text-4xl font-bold mb-4 text-gradient">探索精彩游戏世界</h2>
          <p className="text-foreground/60 text-lg">发现、下载、畅玩 - 您的专属游戏天堂</p>
        </div>
        <div className="relative max-w-2xl mx-auto">
          <input
            type="text"
            placeholder="搜索您喜欢的游戏..."
            className="input w-full pl-14 text-lg"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Search className="absolute left-5 top-4 h-6 w-6 text-foreground/40" />
        </div>
      </div>

      {filteredGames.length === 0 ? (
        <div className="text-center py-20">
          <Gamepad2 className="w-24 h-24 mx-auto mb-6 text-foreground/20" />
          <p className="text-foreground/60 text-xl mb-2">暂无游戏</p>
          <p className="text-foreground/40">敬请期待更多精彩游戏</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {filteredGames.map((game) => (
            <Link key={game.id} href={`/games/${game.id}`} className="card group">
              <div className="flex flex-col">
                <div className="relative mb-6 overflow-hidden rounded-xl">
                  <div className="aspect-square bg-gradient-to-br from-muted to-muted-hover flex items-center justify-center">
                    <img 
                      src={game.iconUrl} 
                      alt={game.name} 
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                  </div>
                  <div className="absolute top-3 right-3 bg-black/60 backdrop-blur-sm px-3 py-1 rounded-full">
                    <span className="text-xs font-medium text-white">{game.category}</span>
                  </div>
                </div>
                
                <h3 className="text-xl font-bold mb-3 group-hover:text-primary transition-colors line-clamp-1">{game.name}</h3>
                
                <div className="flex items-center justify-between mb-4 text-sm text-foreground/60">
                  <div className="flex items-center space-x-1">
                    <Star className="w-4 h-4 fill-primary text-primary" />
                    <span>4.5</span>
                  </div>
                  <span>{game.version}</span>
                </div>
                
                <div className="flex items-center justify-between text-sm text-foreground/60 mb-6">
                  <span>{game.fileSize}</span>
                  <span className="text-primary">免费下载</span>
                </div>
                
                <button className="btn btn-primary w-full flex items-center justify-center space-x-2">
                  <Download className="w-5 h-5" />
                  <span>立即下载</span>
                </button>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}

export default Home
