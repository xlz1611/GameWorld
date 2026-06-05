import jwt from 'jsonwebtoken'
import prisma from './prisma'

const JWT_SECRET = process.env.JWT_SECRET

if (!JWT_SECRET) {
  console.error('警告: JWT_SECRET 环境变量未设置，管理员验证将不可用')
}

function verifyToken(token) {
  if (!JWT_SECRET) return null
  try {
    return jwt.verify(token, JWT_SECRET)
  } catch {
    return null
  }
}

export async function verifyAdmin(request) {
  if (!JWT_SECRET) {
    return { verified: false, error: '服务未配置', status: 503 }
  }

  const authHeader = request.headers.get('authorization')
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return { verified: false, error: '未提供认证令牌', status: 401 }
  }

  const token = authHeader.split(' ')[1]

  const decoded = verifyToken(token)

  if (!decoded) {
    return { verified: false, error: '认证令牌已失效，请重新登录', status: 401 }
  }

  if (decoded.role === 'admin') {
    return { verified: true, user: decoded }
  }

  try {
    const dbUser = await prisma.user.findUnique({
      where: { id: decoded.id },
      select: { role: true }
    })
    if (dbUser && dbUser.role === 'admin') {
      return { verified: true, user: { ...decoded, role: 'admin' } }
    }
  } catch {}

  return { verified: false, error: '权限不足，需要管理员权限', status: 403 }
}

export function adminResponse(error, status = 403) {
  return new Response(
    JSON.stringify({ error }),
    {
      status,
      headers: { 'Content-Type': 'application/json' }
    }
  )
}
