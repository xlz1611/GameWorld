import { writeFileSync, mkdirSync, existsSync } from 'fs'
import { join, extname } from 'path'
import prisma from '../../lib/prisma'

export const runtime = 'nodejs'

export async function POST(request) {
  try {
    const formData = await request.formData()
    
    const name = formData.get('name')
    const packageName = formData.get('packageName')
    const description = formData.get('description')
    const category = formData.get('category')
    const version = formData.get('version')
    const fileSize = formData.get('fileSize')
    const iconFile = formData.get('icon')
    const apkFile = formData.get('apk')

    // 确保上传目录存在
    const uploadDir = join(process.cwd(), 'public', 'uploads')
    if (!existsSync(uploadDir)) {
      mkdirSync(uploadDir, { recursive: true })
    }

    // 保存图标文件
    const iconExt = extname(iconFile.name)
    const iconFileName = `${Date.now()}_icon${iconExt}`
    const iconPath = join(uploadDir, iconFileName)
    const iconBuffer = Buffer.from(await iconFile.arrayBuffer())
    writeFileSync(iconPath, iconBuffer)
    const iconUrl = `/uploads/${iconFileName}`

    // 保存APK文件
    const apkExt = extname(apkFile.name)
    const apkFileName = `${Date.now()}_game${apkExt}`
    const apkPath = join(uploadDir, apkFileName)
    const apkBuffer = Buffer.from(await apkFile.arrayBuffer())
    writeFileSync(apkPath, apkBuffer)
    const apkUrl = `/uploads/${apkFileName}`

    // 保存游戏信息到数据库
    const game = await prisma.game.create({
      data: {
        name,
        packageName,
        description,
        category,
        iconUrl,
        apkUrl,
        version,
        fileSize,
        isPublished: false
      }
    })

    return new Response(JSON.stringify(game), {
      status: 200,
      headers: {
        'Content-Type': 'application/json'
      }
    })
  } catch (error) {
    console.error('上传游戏失败:', error)
    return new Response(JSON.stringify({ error: '上传游戏失败' }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json'
      }
    })
  }
}
