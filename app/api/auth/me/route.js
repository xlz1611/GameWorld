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

export async function GET(request) {
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
    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
      select: { id: true, name: true, email: true, avatar: true, role: true }
    })

    if (!user) {
      return new Response(
        JSON.stringify({ error: '用户不存在' }),
        { status: 404, headers: { 'Content-Type': 'application/json' } }
      )
    }

    return new Response(JSON.stringify(user), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    })
  } catch (error) {
    console.error('获取用户信息失败:', error)
    return new Response(
      JSON.stringify({ error: '获取用户信息失败' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    )
  }
}
