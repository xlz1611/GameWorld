import prisma from '../../../lib/prisma'

const downloadLimit = new Map()
const DOWNLOAD_COOLDOWN = 60000

export async function POST(request, { params }) {
  const { id } = params
  const gameId = parseInt(id)

  if (isNaN(gameId) || gameId <= 0) {
    return new Response(JSON.stringify({ error: '无效的游戏ID' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' }
    })
  }

  const ip = request.headers.get('x-forwarded-for') ||
             request.headers.get('x-real-ip') ||
             request.headers.get('host') || 'unknown'
  const limitKey = `${ip}-${id}`
  const lastDownload = downloadLimit.get(limitKey)
  if (lastDownload && Date.now() - lastDownload < DOWNLOAD_COOLDOWN) {
    const game = await prisma.game.findUnique({ where: { id: gameId } })
    return new Response(JSON.stringify({ success: true, downloadCount: game?.downloadCount || 0, cooldown: true }), { status: 200, headers: { 'Content-Type': 'application/json' } })
  }
  downloadLimit.set(limitKey, Date.now())

  try {
    const game = await prisma.game.findUnique({
      where: { id: gameId }
    })

    if (!game) {
      return new Response(JSON.stringify({ error: '游戏不存在' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' }
      })
    }

    const updatedGame = await prisma.game.update({
      where: { id: gameId },
      data: {
        downloadCount: { increment: 1 }
      }
    })

    return new Response(JSON.stringify({
      success: true,
      downloadCount: updatedGame.downloadCount
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    })
  } catch (error) {
    console.error('更新下载计数失败:', error)
    return new Response(JSON.stringify({ error: '更新下载计数失败' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    })
  }
}
