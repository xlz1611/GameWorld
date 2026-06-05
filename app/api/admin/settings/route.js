import prisma from '../../lib/prisma'
import { verifyAdmin, adminResponse } from '../../lib/adminAuth'

export async function GET(request) {
  const auth = await verifyAdmin(request)
  if (!auth.verified) {
    return adminResponse(auth.error, auth.status)
  }

  try {
    const settings = await prisma.siteSetting.findMany()
    const result = {}
    for (const s of settings) {
      result[s.key] = s.value
    }
    return new Response(JSON.stringify({ settings: result }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    })
  } catch (error) {
    console.error('获取设置失败:', error)
    return new Response(JSON.stringify({ error: '获取设置失败' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    })
  }
}

export async function PUT(request) {
  const auth = await verifyAdmin(request)
  if (!auth.verified) {
    return adminResponse(auth.error, auth.status)
  }

  try {
    const body = await request.json()
    const { settings } = body

    if (!settings || typeof settings !== 'object') {
      return new Response(JSON.stringify({ error: '参数格式错误' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      })
    }

    const upserts = Object.entries(settings).map(([key, value]) =>
      prisma.siteSetting.upsert({
        where: { key },
        update: { value: String(value) },
        create: { key, value: String(value) }
      })
    )

    await Promise.all(upserts)

    return new Response(JSON.stringify({ message: '设置已保存' }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    })
  } catch (error) {
    console.error('保存设置失败:', error)
    return new Response(JSON.stringify({ error: '保存设置失败' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    })
  }
}
