import prisma from '../../../../lib/prisma'
import { verifyAdmin, adminResponse } from '../../../../lib/adminAuth'

export async function PUT(request, { params }) {
  const auth = await verifyAdmin(request)
  if (!auth.verified) {
    return adminResponse(auth.error, auth.status)
  }

  const { id } = params

  try {
    const { role } = await request.json()

    if (!role || !['admin', 'user'].includes(role)) {
      return new Response(
        JSON.stringify({ error: '无效的角色类型' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      )
    }

    const updatedUser = await prisma.user.update({
      where: { id: parseInt(id) },
      data: { role },
      select: { id: true, name: true, email: true, role: true }
    })

    return new Response(JSON.stringify(updatedUser), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    })
  } catch (error) {
    console.error('更新用户角色失败:', error)
    return new Response(
      JSON.stringify({ error: '更新用户角色失败' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    )
  }
}
