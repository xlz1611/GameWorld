import prisma from '../../lib/prisma'
import { verifyAdmin, adminResponse } from '../../lib/adminAuth'

function formatBytes(bytes) {
  if (bytes === 0) return '0 B'
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

async function listBlobs() {
  const token = process.env.BLOB_READ_WRITE_TOKEN
  if (!token) return { blobs: [] }

  try {
    const res = await fetch('https://blob.vercel.sh/api/list', {
      headers: { Authorization: `Bearer ${token}` },
    })
    if (!res.ok) return { blobs: [] }
    return await res.json()
  } catch {
    return { blobs: [] }
  }
}

export async function GET(request) {
  const auth = await verifyAdmin(request)
  if (!auth.verified) {
    return adminResponse(auth.error, auth.status)
  }

  let dbStatus = 'connected'
  try {
    await prisma.$queryRaw`SELECT 1`
  } catch {
    dbStatus = 'error'
  }

  let storageBytes = 0
  try {
    const blobData = await listBlobs()
    if (blobData.blobs && Array.isArray(blobData.blobs)) {
      storageBytes = blobData.blobs.reduce((total, blob) => total + (blob.size || 0), 0)
    }
  } catch (error) {
    console.error('获取存储信息失败:', error)
  }

  return new Response(JSON.stringify({
    server: 'running',
    database: dbStatus,
    storage: {
      bytes: storageBytes,
      formatted: formatBytes(storageBytes)
    }
  }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' }
  })
}
