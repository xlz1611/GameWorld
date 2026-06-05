import jwt from 'jsonwebtoken'

export async function POST(request) {
  const body = await request.json()

  try {
    // 验证管理员身份
    const JWT_SECRET = process.env.JWT_SECRET
    if (!JWT_SECRET) {
      throw new Error('服务未配置')
    }

    let token
    try {
      const payload = JSON.parse(body.clientPayload || '{}')
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

    // 使用纯 HTTP 调用 Vercel Blob API 生成上传令牌
    const BLOB_READ_WRITE_TOKEN = process.env.BLOB_READ_WRITE_TOKEN

    if (!BLOB_READ_WRITE_TOKEN) {
      throw new Error('Blob 服务未配置')
    }

    const response = await fetch(
      'https://blob.vercel.sh',
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${BLOB_READ_WRITE_TOKEN}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          pathname: body.pathname,
          contentType: body.contentType,
          size: body.size,
        }),
      }
    )

    if (!response.ok) {
      const errorData = await response.text()
      throw new Error(`Blob 上传失败: ${errorData}`)
    }

    const data = await response.json()
    return Response.json(data)

  } catch (error) {
    console.error('Upload URL error:', error)
    return Response.json({ error: error.message }, { status: 400 })
  }
}
