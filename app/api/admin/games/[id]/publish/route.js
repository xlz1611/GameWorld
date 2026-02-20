import prisma from '../../../../lib/prisma'

export async function PUT(request, { params }) {
  const { id } = params
  const { isPublished } = await request.json()

  try {
    const updatedGame = await prisma.game.update({
      where: {
        id: parseInt(id)
      },
      data: {
        isPublished
      }
    })
    return new Response(JSON.stringify(updatedGame), {
      status: 200,
      headers: {
        'Content-Type': 'application/json'
      }
    })
  } catch (error) {
    console.error('更新游戏状态失败:', error)
    return new Response(JSON.stringify({ error: '更新游戏状态失败' }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json'
      }
    })
  }
}
