import prisma from '../../../lib/prisma'
import { verifyAdmin, adminResponse } from '../../../lib/adminAuth'

export async function DELETE(request, { params }) {
  const auth = await verifyAdmin(request)
  if (!auth.verified) return adminResponse(auth.error, auth.status)

  const { id } = params
  const userId = parseInt(id)
  if (isNaN(userId)) {
    return new Response(JSON.stringify({ error: '无效的用户ID' }), { status: 400, headers: { 'Content-Type': 'application/json' } })
  }

  if (auth.user.id === userId) {
    return new Response(JSON.stringify({ error: '不能删除自己的账号' }), { status: 400, headers: { 'Content-Type': 'application/json' } })
  }

  const targetUser = await prisma.user.findUnique({ where: { id: userId } })
  if (!targetUser) {
    return new Response(JSON.stringify({ error: '用户不存在' }), { status: 404, headers: { 'Content-Type': 'application/json' } })
  }
  if (targetUser.role === 'admin') {
    return new Response(JSON.stringify({ error: '不能删除管理员账号' }), { status: 400, headers: { 'Content-Type': 'application/json' } })
  }

  await prisma.user.delete({ where: { id: userId } })
  return new Response(JSON.stringify({ message: '用户删除成功' }), { status: 200, headers: { 'Content-Type': 'application/json' } })
}
