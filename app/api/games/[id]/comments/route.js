import prisma from '../../../lib/prisma'
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

export async function GET(request, { params }) {
  const { id } = params
  const gameId = parseInt(id)

  if (isNaN(gameId) || gameId <= 0) {
    return new Response(
      JSON.stringify({ error: '无效的游戏ID' }),
      { status: 400, headers: { 'Content-Type': 'application/json' } }
    )
  }

  try {
    const comments = await prisma.comment.findMany({
      where: { gameId },
      include: {
        user: {
          select: { name: true, avatar: true }
        }
      },
      orderBy: { createdAt: 'desc' }
    })

    return new Response(JSON.stringify({ comments }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    })
  } catch (error) {
    console.error('获取评论失败:', error)
    return new Response(
      JSON.stringify({ error: '获取评论失败' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    )
  }
}

export async function POST(request, { params }) {
  const authHeader = request.headers.get('authorization')
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return new Response(
      JSON.stringify({ error: '请先登录' }),
      { status: 401, headers: { 'Content-Type': 'application/json' } }
    )
  }

  const token = authHeader.split(' ')[1]
  const decoded = verifyToken(token)

  if (!decoded) {
    return new Response(
      JSON.stringify({ error: '认证令牌已失效，请重新登录' }),
      { status: 401, headers: { 'Content-Type': 'application/json' } }
    )
  }

  const { id } = params
  const gameId = parseInt(id)

  if (isNaN(gameId) || gameId <= 0) {
    return new Response(
      JSON.stringify({ error: '无效的游戏ID' }),
      { status: 400, headers: { 'Content-Type': 'application/json' } }
    )
  }

  try {
    const body = await request.json()
    const { content, rating } = body

    if (!content || !content.trim()) {
      return new Response(
        JSON.stringify({ error: '评论内容不能为空' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      )
    }

    if (content.length > 500) {
      return new Response(
        JSON.stringify({ error: '评论内容不能超过500字' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      )
    }

    if (!rating || rating < 1 || rating > 5) {
      return new Response(
        JSON.stringify({ error: '评分必须在1-5之间' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      )
    }

    const game = await prisma.game.findUnique({ where: { id: gameId } })
    if (!game) {
      return new Response(
        JSON.stringify({ error: '游戏不存在' }),
        { status: 404, headers: { 'Content-Type': 'application/json' } }
      )
    }

    const comment = await prisma.comment.create({
      data: {
        content: content.trim(),
        rating,
        userId: decoded.id,
        gameId
      },
      include: {
        user: {
          select: { name: true, avatar: true }
        }
      }
    })

    const stats = await prisma.comment.aggregate({
      where: { gameId },
      _avg: { rating: true }
    })

    await prisma.game.update({
      where: { id: gameId },
      data: { rating: stats._avg.rating || 0 }
    })

    return new Response(JSON.stringify({ comment }), {
      status: 201,
      headers: { 'Content-Type': 'application/json' }
    })
  } catch (error) {
    console.error('发表评论失败:', error)
    return new Response(
      JSON.stringify({ error: '发表评论失败' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    )
  }
}
