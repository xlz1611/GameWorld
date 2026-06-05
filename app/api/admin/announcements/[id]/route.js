import prisma from '../../../lib/prisma'
import { verifyAdmin, adminResponse } from '../../../lib/adminAuth'

export async function PUT(request, { params }) {
  const auth = await verifyAdmin(request)
  if (!auth.verified) {
    return adminResponse(auth.error, auth.status)
  }

  const { id } = params

  try {
    const body = await request.json()
    const { title, content, type, isActive } = body

    const updateData = {}
    if (title !== undefined) updateData.title = title
    if (content !== undefined) updateData.content = content
    if (type !== undefined) updateData.type = type
    if (isActive !== undefined) updateData.isActive = isActive

    const updated = await prisma.announcement.update({
      where: { id: parseInt(id) },
      data: updateData
    })

    return new Response(JSON.stringify(updated), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    })
  } catch (error) {
    console.error('更新公告失败:', error)
    if (error.code === 'P2025') {
      return new Response(JSON.stringify({ error: '公告不存在' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' }
      })
    }
    return new Response(JSON.stringify({ error: '更新公告失败' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    })
  }
}

export async function DELETE(request, { params }) {
  const auth = await verifyAdmin(request)
  if (!auth.verified) {
    return adminResponse(auth.error, auth.status)
  }

  const { id } = params

  try {
    await prisma.announcement.delete({
      where: { id: parseInt(id) }
    })

    return new Response(JSON.stringify({ message: '公告删除成功' }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    })
  } catch (error) {
    console.error('删除公告失败:', error)
    if (error.code === 'P2025') {
      return new Response(JSON.stringify({ error: '公告不存在' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' }
      })
    }
    return new Response(JSON.stringify({ error: '删除公告失败' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    })
  }
}
