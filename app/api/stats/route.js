import prisma from '../lib/prisma'

export async function GET(request) {
  try {
    let stats = {
      totalGames: 0,
      totalDownloads: 0,
      totalUsers: 0
    }

    try {
      // 获取游戏总数
      const gamesCount = await prisma.game.count({
        where: { isPublished: true }
      })

      // 获取所有游戏的下载量总和
      const games = await prisma.game.findMany({
        where: { isPublished: true },
        select: { downloadCount: true }
      })
      const totalDownloads = games.reduce((sum, game) => sum + (game.downloadCount || 0), 0)

      // 获取用户总数
      const usersCount = await prisma.user.count()

      stats = {
        totalGames: gamesCount,
        totalDownloads: totalDownloads,
        totalUsers: usersCount
      }
    } catch (dbError) {
      console.warn('数据库连接失败，返回默认统计数据:', dbError)
      // 数据库错误时返回默认数据
      stats = {
        totalGames: 0,
        totalDownloads: 0,
        totalUsers: 0
      }
    }

    return new Response(JSON.stringify(stats), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=120'
      }
    })
  } catch (error) {
    console.error('获取统计数据失败:', error)
    return new Response(JSON.stringify({
      totalGames: 0,
      totalDownloads: 0,
      totalUsers: 0
    }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=120'
      }
    })
  }
}
