import prisma from '../../lib/prisma'
import { verifyAdmin, adminResponse } from '../../lib/adminAuth'

export async function GET(request) {
  const auth = await verifyAdmin(request)
  if (!auth.verified) {
    return adminResponse(auth.error, auth.status)
  }

  try {
    const games = await prisma.game.findMany({
      orderBy: {
        createdAt: 'desc'
      }
    })
    return new Response(JSON.stringify(games), {
      status: 200,
      headers: {
        'Content-Type': 'application/json'
      }
    })
  } catch (error) {
    console.error('获取游戏列表失败:', error)
    return new Response(JSON.stringify({ error: '获取游戏列表失败' }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json'
      }
    })
  }
}
