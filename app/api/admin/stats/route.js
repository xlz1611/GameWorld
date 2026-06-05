import prisma from '../../lib/prisma'
import { verifyAdmin, adminResponse } from '../../lib/adminAuth'

export async function GET(request) {
  const auth = await verifyAdmin(request)
  if (!auth.verified) {
    return adminResponse(auth.error, auth.status)
  }

  try {
    const totalGames = await prisma.game.count()
    const totalDownloads = await prisma.game.aggregate({
      _sum: { downloadCount: true }
    })
    const totalUsers = await prisma.user.count()
    const publishedGames = await prisma.game.count({
      where: { isPublished: true }
    })

    return new Response(JSON.stringify({
      totalGames,
      totalDownloads: totalDownloads._sum.downloadCount || 0,
      totalUsers,
      publishedGames
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    })
  } catch (error) {
    console.error('获取统计数据失败:', error)
    return new Response(JSON.stringify({ error: '获取统计数据失败' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    })
  }
}
