import prisma from '../../../lib/prisma'
import { verifyAdmin, adminResponse } from '../../../lib/adminAuth'

const MAX_FILE_SIZE = 500 * 1024 * 1024

async function deleteBlob(url) {
  const token = process.env.BLOB_READ_WRITE_TOKEN
  if (!url || !token || !url.includes('blob.vercel-storage.com')) return

  try {
    // 从 URL 中提取 pathname: https://*.blob.vercelstorage.com/pathname
    const urlObj = new URL(url)
    // Vercel Blob URL 格式: https://<store-id>.public.blob.vercel-storage.com/<pathname>
    // 或: https://<store-id>.blob.vercelstorage.com/<pathname>
    const pathname = urlObj.pathname.replace(/^\//, '')

    await fetch(`https://blob.vercel.sh/api/delete/${pathname}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    })
  } catch (e) {
    console.error('删除Blob文件失败:', e)
  }
}

export async function GET(request, { params }) {
  const auth = await verifyAdmin(request)
  if (!auth.verified) {
    return adminResponse(auth.error, auth.status)
  }

  const { id } = params

  try {
    const game = await prisma.game.findUnique({
      where: { id: parseInt(id) }
    })

    if (!game) {
      return new Response(JSON.stringify({ error: '游戏不存在' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' }
      })
    }

    return new Response(JSON.stringify(game), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    })
  } catch (error) {
    console.error('获取游戏失败:', error)
    return new Response(JSON.stringify({ error: '获取游戏失败' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    })
  }
}

export async function DELETE(request, { params }) {
  const auth = await verifyAdmin(request)
  if (!auth.verified) {
    return adminResponse(auth.error, auth.status)
  }

  const { id } = params

  try {
    const game = await prisma.game.findUnique({
      where: { id: parseInt(id) }
    })

    if (game) {
      // 删除 Vercel Blob 中的文件
      if (game.iconUrl) await deleteBlob(game.iconUrl)
      if (game.apkUrl) await deleteBlob(game.apkUrl)
    }

    await prisma.game.delete({
      where: { id: parseInt(id) }
    })

    return new Response(JSON.stringify({ message: '游戏删除成功' }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    })
  } catch (error) {
    console.error('删除游戏失败:', error)
    return new Response(JSON.stringify({ error: '删除游戏失败' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    })
  }
}

export async function PUT(request, { params }) {
  const auth = await verifyAdmin(request)
  if (!auth.verified) {
    return adminResponse(auth.error, auth.status)
  }

  const { id } = params

  try {
    const data = await request.json()

    const updateData = {
      name: data.name,
      category: data.category,
      version: data.version,
      fileSize: data.fileSize,
      isPublished: data.isPublished === 'true' || data.isPublished === true
    }

    if (data.description !== null && data.description !== undefined) {
      updateData.description = data.description
    }

    // 如果提供了新的 APK URL（客户端已上传到 Vercel Blob）
    if (data.apkUrl) {
      updateData.apkUrl = data.apkUrl
    }

    // 如果提供了新的图标 URL
    if (data.iconUrl) {
      updateData.iconUrl = data.iconUrl
    }

    const updatedGame = await prisma.game.update({
      where: { id: parseInt(id) },
      data: updateData
    })

    return new Response(JSON.stringify(updatedGame), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    })
  } catch (error) {
    console.error('更新游戏失败:', error)
    return new Response(JSON.stringify({ error: '更新游戏失败' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    })
  }
}
