import prisma from '../../lib/prisma'
import { verifyAdmin, adminResponse } from '../../lib/adminAuth'

export async function GET(request) {
  const auth = await verifyAdmin(request)
  if (!auth.verified) {
    return adminResponse(auth.error, auth.status)
  }

  try {
    const { searchParams } = new URL(request.url)
    const search = searchParams.get('search') || ''

    const where = search
      ? {
          OR: [
            { content: { contains: search } },
            { user: { name: { contains: search } } }
          ]
        }
      : {}

    const [comments, total] = await Promise.all([
      prisma.comment.findMany({
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
              name: true
            }
          }
        },
        orderBy: {
          createdAt: 'desc'
        }
      }),
      prisma.comment.count({ where })
    ])

    return new Response(JSON.stringify({ comments, total }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    })
  } catch (error) {
    console.error('获取评论列表失败:', error)
    return new Response(JSON.stringify({ error: '获取评论列表失败' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    })
  }
}
