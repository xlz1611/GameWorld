import prisma from '../../lib/prisma'
import { verifyAdmin, adminResponse } from '../../lib/adminAuth'

const MAX_ICON_SIZE = 10 * 1024 * 1024 // 10MB
const ALLOWED_ICON_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif']

function validateGameData(data) {
  if (!data.name || data.name.trim().length === 0) {
    throw new Error('游戏名称不能为空')
  }
  if (!data.packageName || data.packageName.trim().length === 0) {
    throw new Error('包名不能为空')
  }
  if (!data.description || data.description.trim().length === 0) {
    throw new Error('游戏描述不能为空')
  }
  if (!data.category || data.category.trim().length === 0) {
    throw new Error('分类不能为空')
  }
  if (!data.version || data.version.trim().length === 0) {
    throw new Error('版本号不能为空')
  }
  if (!data.fileSize || data.fileSize.trim().length === 0) {
    throw new Error('文件大小不能为空')
  }
  if (!data.apkUrl || data.apkUrl.trim().length === 0) {
    throw new Error('APK文件未上传')
  }
}

export async function POST(request) {
  const auth = await verifyAdmin(request)
  if (!auth.verified) {
    return adminResponse(auth.error, auth.status)
  }

  try {
    const data = await request.json()

    try {
      validateGameData(data)
    } catch (validationError) {
      return new Response(JSON.stringify({ error: validationError.message }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      })
    }

    const game = await prisma.game.create({
      data: {
        name: data.name,
        packageName: data.packageName,
        description: data.description,
        category: data.category,
        iconUrl: data.iconUrl || '/favicon-16x16.png',
        apkUrl: data.apkUrl,
        version: data.version,
        fileSize: data.fileSize,
        isPublished: false,
        downloadCount: 0,
        rating: 0
      }
    })

    return new Response(JSON.stringify(game), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    })
  } catch (error) {
    console.error('创建游戏记录失败:', error)
    return new Response(JSON.stringify({ error: '创建游戏记录失败' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    })
  }
}
