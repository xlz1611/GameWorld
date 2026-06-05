import prisma from '../../../lib/prisma'
import { verifyAdmin, adminResponse } from '../../../lib/adminAuth'

export async function DELETE(request, { params }) {
  const auth = await verifyAdmin(request)
  if (!auth.verified) {
    return adminResponse(auth.error, auth.status)
  }

  const { id } = params

  try {
    await prisma.comment.delete({
      where: {
        id: parseInt(id)
      }
    })
    return new Response(JSON.stringify({ message: '评论删除成功' }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    })
  } catch (error) {
    console.error('删除评论失败:', error)
    return new Response(JSON.stringify({ error: '删除评论失败' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    })
  }
}
