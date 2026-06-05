import prisma from '../../lib/prisma'

function validateId(id) {
  const numId = parseInt(id)
  if (isNaN(numId) || numId <= 0) {
    return null
  }
  return numId
}

export async function GET(request, { params }) {
  const { id } = params
  
  const validatedId = validateId(id)
  if (!validatedId) {
    return new Response(JSON.stringify({ error: '无效的游戏ID' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' }
    })
  }

  try {
    const game = await prisma.game.findUnique({
      where: { id: validatedId }
    })

    if (!game) {
      return new Response(JSON.stringify({ error: '游戏不存在' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' }
      })
    }

    return new Response(JSON.stringify(game), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'public, s-maxage=600, stale-while-revalidate=1200'
      }
    })
  } catch (error) {
    console.error('获取游戏详情失败:', error)
    return new Response(JSON.stringify({ error: '获取游戏详情失败' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    })
  }
}
