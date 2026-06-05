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
            { title: { contains: search } },
            { content: { contains: search } }
          ]
        }
      : {}

    const [announcements, total] = await Promise.all([
      prisma.announcement.findMany({
        where,
        orderBy: { createdAt: 'desc' }
      }),
      prisma.announcement.count({ where })
    ])

    return new Response(JSON.stringify({ announcements, total }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    })
  } catch (error) {
    console.error('获取公告列表失败:', error)
    return new Response(JSON.stringify({ error: '获取公告列表失败' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    })
  }
}

export async function POST(request) {
  const auth = await verifyAdmin(request)
  if (!auth.verified) {
    return adminResponse(auth.error, auth.status)
  }

  try {
    const body = await request.json()
    const { title, content, type, isActive } = body

    if (!title || !content) {
      return new Response(JSON.stringify({ error: '标题和内容不能为空' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      })
    }

    const announcement = await prisma.announcement.create({
      data: {
        title,
        content,
        type: type || 'info',
        isActive: isActive !== undefined ? isActive : true
      }
    })

    return new Response(JSON.stringify(announcement), {
      status: 201,
      headers: { 'Content-Type': 'application/json' }
    })
  } catch (error) {
    console.error('创建公告失败:', error)
    return new Response(JSON.stringify({ error: '创建公告失败' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    })
  }
}
