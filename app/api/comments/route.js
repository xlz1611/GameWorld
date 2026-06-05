import prisma from '../lib/prisma'

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url)
    const search = searchParams.get('search') || ''
    const limit = Math.min(parseInt(searchParams.get('limit') || '50', 10), 50)

    const where = search
      ? {
          OR: [
            { content: { contains: search } },
            { game: { name: { contains: search } } }
          ]
        }
      : {}

    const comments = await prisma.comment.findMany({
      where,
      include: {
        user: {
          select: {
            name: true,
            avatar: true
          }
        },
        game: {
          select: {
            name: true,
            iconUrl: true,
            category: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      },
      take: limit
    })

    return new Response(JSON.stringify({ comments }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    })
  } catch (error) {
    console.error('获取评论动态失败:', error)
    return new Response(JSON.stringify({ comments: [] }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    })
  }
}
