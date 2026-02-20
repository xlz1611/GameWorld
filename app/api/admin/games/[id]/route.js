import prisma from '../../../lib/prisma'

export async function DELETE(request, { params }) {
  const { id } = params

  try {
    await prisma.game.delete({
      where: {
        id: parseInt(id)
      }
    })
    return new Response(JSON.stringify({ message: '游戏删除成功' }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json'
      }
    })
  } catch (error) {
    console.error('删除游戏失败:', error)
    return new Response(JSON.stringify({ error: '删除游戏失败' }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json'
      }
    })
  }
}
