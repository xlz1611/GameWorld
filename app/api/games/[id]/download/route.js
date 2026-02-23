import prisma from '../../../lib/prisma'

// 模拟游戏数据，用于数据库不可用时
const mockGames = [
  { id: 1, downloadCount: 1250000000 },
  { id: 2, downloadCount: 860000000 },
  { id: 3, downloadCount: 680000000 },
  { id: 4, downloadCount: 520000000 },
  { id: 5, downloadCount: 1250000000 },
  { id: 6, downloadCount: 860000000 },
  { id: 7, downloadCount: 680000000 },
  { id: 8, downloadCount: 520000000 }
]

// 模拟下载计数存储（仅用于演示）
let mockDownloadCounts = {};
mockGames.forEach(game => {
  mockDownloadCounts[game.id] = game.downloadCount;
});

export async function POST(request, { params }) {
  const { id } = params
  const gameId = parseInt(id)

  try {
    // 尝试从数据库更新
    try {
      const game = await prisma.game.findUnique({
        where: {
          id: gameId
        }
      })

      if (!game) {
        return new Response(JSON.stringify({ error: '游戏不存在' }), {
          status: 404,
          headers: {
            'Content-Type': 'application/json'
          }
        })
      }

      const updatedGame = await prisma.game.update({
        where: {
          id: gameId
        },
        data: {
          downloadCount: {
            increment: 1
          }
        }
      })

      return new Response(JSON.stringify({ 
        success: true, 
        downloadCount: updatedGame.downloadCount 
      }), {
        status: 200,
        headers: {
          'Content-Type': 'application/json'
        }
      })
    } catch (dbError) {
      console.warn('数据库连接失败，使用模拟数据:', dbError)
      // 使用模拟数据
      if (!mockDownloadCounts[gameId]) {
        // 如果游戏ID不存在，初始化计数
        mockDownloadCounts[gameId] = 0;
      }
      mockDownloadCounts[gameId]++;

      return new Response(JSON.stringify({ 
        success: true, 
        downloadCount: mockDownloadCounts[gameId],
        message: '使用模拟数据' 
      }), {
        status: 200,
        headers: {
          'Content-Type': 'application/json'
        }
      })
    }
  } catch (error) {
    console.error('更新下载计数失败:', error)
    return new Response(JSON.stringify({ error: '更新下载计数失败' }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json'
      }
    })
  }
}