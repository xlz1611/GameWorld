import { writeFileSync, mkdirSync, existsSync } from 'fs'
import { join, extname } from 'path'
import prisma from '../../lib/prisma'

export const runtime = 'nodejs'

const MAX_FILE_SIZE = 500 * 1024 * 1024 // 500MB
const MAX_ICON_SIZE = 10 * 1024 * 1024 // 10MB
const ALLOWED_ICON_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif']
const ALLOWED_APK_TYPES = ['application/vnd.android.package-archive', 'application/octet-stream']

function validateFile(file, maxSize, allowedTypes, fileType) {
  if (!file) {
    throw new Error(`未提供${fileType}文件`)
  }

  if (file.size > maxSize) {
    throw new Error(`${fileType}文件大小超过限制 (${maxSize / 1024 / 1024}MB)`)
  }

  if (!allowedTypes.includes(file.type)) {
    throw new Error(`${fileType}文件类型不支持`)
  }
}

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
}

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

    const gameData = { name, packageName, description, category, version, fileSize }
    
    try {
      validateGameData(gameData)
    } catch (validationError) {
      return new Response(JSON.stringify({ error: validationError.message }), {
        status: 400,
        headers: {
          'Content-Type': 'application/json'
        }
      })
    }

    try {
      validateFile(apkFile, MAX_FILE_SIZE, ALLOWED_APK_TYPES, 'APK')
    } catch (fileError) {
      return new Response(JSON.stringify({ error: fileError.message }), {
        status: 400,
        headers: {
          'Content-Type': 'application/json'
        }
      })
    }

    if (iconFile) {
      try {
        validateFile(iconFile, MAX_ICON_SIZE, ALLOWED_ICON_TYPES, '图标')
      } catch (iconError) {
        return new Response(JSON.stringify({ error: iconError.message }), {
          status: 400,
          headers: {
            'Content-Type': 'application/json'
          }
        })
      }
    }

    const uploadDir = join(process.cwd(), 'public', 'uploads')
    if (!existsSync(uploadDir)) {
      mkdirSync(uploadDir, { recursive: true })
    }

    let iconUrl = '/favicon-16x16.png'
    if (iconFile) {
      const iconExt = extname(iconFile.name)
      const iconFileName = `${Date.now()}_icon${iconExt}`
      const iconPath = join(uploadDir, iconFileName)
      const iconBuffer = Buffer.from(await iconFile.arrayBuffer())
      writeFileSync(iconPath, iconBuffer)
      iconUrl = `/uploads/${iconFileName}`
    }

    const apkExt = extname(apkFile.name)
    const apkFileName = `${Date.now()}_game${apkExt}`
    const apkPath = join(uploadDir, apkFileName)
    const apkBuffer = Buffer.from(await apkFile.arrayBuffer())
    writeFileSync(apkPath, apkBuffer)
    const apkUrl = `/uploads/${apkFileName}`

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
        isPublished: false,
        downloadCount: 0,
        rating: 0
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
    return new Response(JSON.stringify({ error: '上传游戏失败，请稍后重试' }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json'
      }
    })
  }
}
