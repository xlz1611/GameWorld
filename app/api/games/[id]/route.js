import prisma from '../../lib/prisma'

export async function GET(request, { params }) {
  const { id } = params

  try {
    const game = await prisma.game.findUnique({
      where: {
        id: parseInt(id)
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

    return new Response(JSON.stringify(game), {
      status: 200,
      headers: {
        'Content-Type': 'application/json'
      }
    })
  } catch (error) {
    console.error('获取游戏详情失败:', error)
    return new Response(JSON.stringify({ error: '获取游戏详情失败' }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json'
      }
    })
  }
}
