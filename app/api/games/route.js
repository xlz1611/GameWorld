import prisma from '../lib/prisma'

function validateAndSanitizeInput(input) {
  if (typeof input !== 'string') return input
  return input
    .replace(/[<>]/g, '')
    .replace(/javascript:/gi, '')
    .replace(/on\w+=/gi, '')
    .trim()
}



export async function GET(request) {
  try {
    const url = new URL(request.url)
    const category = url.searchParams.get('category')
    const search = url.searchParams.get('search')
    
    let games = []
    
    try {
      // 尝试从数据库获取数据
      const where = { isPublished: true }
      
      if (category && category !== '全部') {
        where.category = validateAndSanitizeInput(category)
      }
      
      if (search && search.trim() !== '') {
        const sanitizedSearch = validateAndSanitizeInput(search)
        where.OR = [
          { name: { contains: sanitizedSearch, mode: 'insensitive' } },
          { description: { contains: sanitizedSearch, mode: 'insensitive' } },
          { category: { contains: sanitizedSearch, mode: 'insensitive' } }
        ]
      }
      
      games = await prisma.game.findMany({
        where,
        orderBy: {
          createdAt: 'desc'
        },
        take: 100
      })
    } catch (dbError) {
      console.warn('数据库连接失败，返回空数组:', dbError)
      // 数据库错误时返回空数组
      games = []
    }
    
    return new Response(JSON.stringify(games), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600'
      }
    })
  } catch (error) {
    console.error('获取游戏列表失败:', error)
    return new Response(JSON.stringify([]), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600'
      }
    })
  }
}