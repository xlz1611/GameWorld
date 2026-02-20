import prisma from '../lib/prisma'

export async function GET() {
  try {
    const games = await prisma.game.findMany({
      where: {
        isPublished: true
      },
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
