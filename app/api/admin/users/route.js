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
            { name: { contains: search } },
            { email: { contains: search } }
          ]
        }
      : {}

    const [users, total] = await Promise.all([
      prisma.user.findMany({
        where,
        select: {
          id: true,
          name: true,
          email: true,
          avatar: true,
          role: true,
          createdAt: true
        },
        orderBy: { createdAt: 'desc' }
      }),
      prisma.user.count({ where })
    ])

    return new Response(JSON.stringify({ users, total }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    })
  } catch (error) {
    console.error('获取用户列表失败:', error)
    return new Response(
      JSON.stringify({ error: '获取用户列表失败' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    )
  }
}
