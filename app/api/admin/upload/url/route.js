import { handleUpload } from '@vercel/blob/client'
import jwt from 'jsonwebtoken'

export async function POST(request) {
  const body = await request.json()

  try {
    const jsonResponse = await handleUpload({
      body,
      request,
      onBeforeGenerateToken: async (pathname, clientPayload) => {
        // 验证管理员身份
        const JWT_SECRET = process.env.JWT_SECRET
        if (!JWT_SECRET) {
          throw new Error('服务未配置')
        }

        let token
        try {
          const payload = JSON.parse(clientPayload || '{}')
          token = payload.token
        } catch {
          throw new Error('无效的认证信息')
        }

        if (!token) {
          throw new Error('未提供认证令牌')
        }

        try {
          const decoded = jwt.verify(token, JWT_SECRET)
          if (decoded.role !== 'admin') {
            throw new Error('权限不足')
          }
        } catch {
          throw new Error('认证令牌已失效')
        }
      },
    })

    return Response.json(jsonResponse)
  } catch (error) {
    return Response.json({ error: error.message }, { status: 400 })
  }
}
