import prisma from '../../../lib/prisma'

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
    console.error('获取游戏失败:', error)
    return new Response(JSON.stringify({ error: '获取游戏失败' }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json'
      }
    })
  }
}

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

export async function PUT(request, { params }) {
  const { id } = params
  const data = await request.json()

  try {
    const updatedGame = await prisma.game.update({
      where: {
        id: parseInt(id)
      },
      data: {
        name: data.name,
        packageName: data.packageName,
        description: data.description,
        category: data.category,
        version: data.version,
        fileSize: data.fileSize
      }
    })
    return new Response(JSON.stringify(updatedGame), {
      status: 200,
      headers: {
        'Content-Type': 'application/json'
      }
    })
  } catch (error) {
    console.error('更新游戏失败:', error)
    return new Response(JSON.stringify({ error: '更新游戏失败' }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json'
      }
    })
  }
}
