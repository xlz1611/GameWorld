import prisma from '../../lib/prisma'
import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET

function verifyToken(token) {
  if (!JWT_SECRET) return null
  try {
    return jwt.verify(token, JWT_SECRET)
  } catch {
    return null
  }
}

export async function PUT(request) {
  if (!JWT_SECRET) {
    return new Response(
      JSON.stringify({ error: '服务未配置' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    )
  }

  const authHeader = request.headers.get('authorization')
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return new Response(
      JSON.stringify({ error: '未提供认证令牌' }),
      { status: 401, headers: { 'Content-Type': 'application/json' } }
    )
  }

  const token = authHeader.split(' ')[1]
  const decoded = verifyToken(token)

  if (!decoded) {
    return new Response(
      JSON.stringify({ error: '认证令牌已失效，请重新登录', needRelogin: true }),
      { status: 401, headers: { 'Content-Type': 'application/json' } }
    )
  }

  try {
    const body = await request.json()
    const { name, avatar } = body

    const updateData = {}
    if (name !== undefined) {
      if (typeof name !== 'string' || name.trim().length === 0) {
        return new Response(
          JSON.stringify({ error: '用户名不能为空' }),
          { status: 400, headers: { 'Content-Type': 'application/json' } }
        )
      }
      updateData.name = name.trim()
    }
    if (avatar !== undefined) {
      updateData.avatar = avatar
    }

    if (Object.keys(updateData).length === 0) {
      return new Response(
        JSON.stringify({ error: '没有需要更新的字段' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      )
    }

    const updatedUser = await prisma.user.update({
      where: { id: decoded.id },
      data: updateData,
      select: { id: true, name: true, email: true, avatar: true, role: true }
    })

    return new Response(JSON.stringify(updatedUser), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    })
  } catch (error) {
    console.error('更新用户信息失败:', error)
    return new Response(
      JSON.stringify({ error: '更新用户信息失败' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    )
  }
}
