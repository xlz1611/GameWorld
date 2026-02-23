import prisma from '../lib/prisma'

function validateAndSanitizeInput(input) {
  if (typeof input !== 'string') return input
  return input
    .replace(/[<>]/g, '')
    .replace(/javascript:/gi, '')
    .replace(/on\w+=/gi, '')
    .trim()
}

// 模拟游戏数据
const mockGames = [
  {
    id: 1,
    name: '王者荣耀',
    packageName: 'com.tencent.tmgp.sgame',
    description: '王者荣耀是一款由腾讯游戏开发的MOBA类手机游戏，拥有超过2亿注册用户。游戏中玩家可以选择不同的英雄，与队友一起战斗，摧毁敌方基地。',
    category: '动作游戏',
    iconUrl: 'https://img.gkbcdn.com/game/icon/20240115/1705289139210689825.png',
    apkUrl: 'https://example.com/download/1',
    version: '3.9.0.7834',
    fileSize: '2.5GB',
    isPublished: true,
    createdAt: new Date(),
    updatedAt: new Date(),
    downloadCount: 1250000000,
    rating: 4.8
  },
  {
    id: 2,
    name: '和平精英',
    packageName: 'com.tencent.tmgp.pubgmhd',
    description: '和平精英是一款由腾讯游戏开发的战术竞技游戏，玩家需要在游戏中收集装备，与其他玩家战斗，成为最后存活的人。',
    category: '动作游戏',
    iconUrl: 'https://img.gkbcdn.com/game/icon/20240115/1705289139210689825.png',
    apkUrl: 'https://example.com/download/2',
    version: '1.26.13',
    fileSize: '1.8GB',
    isPublished: true,
    createdAt: new Date(),
    updatedAt: new Date(),
    downloadCount: 860000000,
    rating: 4.7
  },
  {
    id: 3,
    name: '原神',
    packageName: 'com.miHoYo.GenshinImpact',
    description: '原神是一款由米哈游开发的开放世界角色扮演游戏，玩家可以在游戏中探索提瓦特大陆，与各种角色互动，参与各种活动。',
    category: '角色扮演',
    iconUrl: 'https://img.gkbcdn.com/game/icon/20240115/1705289139210689825.png',
    apkUrl: 'https://example.com/download/3',
    version: '4.4.0',
    fileSize: '3.2GB',
    isPublished: true,
    createdAt: new Date(),
    updatedAt: new Date(),
    downloadCount: 680000000,
    rating: 4.9
  },
  {
    id: 4,
    name: '开心消消乐',
    packageName: 'com.happyelements.AndroidAnimal',
    description: '开心消消乐是一款由乐元素开发的休闲益智游戏，玩家需要通过消除相同的动物头像来获得分数，挑战各种关卡。',
    category: '休闲益智',
    iconUrl: 'https://img.gkbcdn.com/game/icon/20240115/1705289139210689825.png',
    apkUrl: 'https://example.com/download/4',
    version: '1.124.0',
    fileSize: '180MB',
    isPublished: true,
    createdAt: new Date(),
    updatedAt: new Date(),
    downloadCount: 520000000,
    rating: 4.6
  },
  {
    id: 5,
    name: '王者荣耀',
    packageName: 'com.tencent.tmgp.sgame',
    description: '王者荣耀是一款由腾讯游戏开发的MOBA类手机游戏，拥有超过2亿注册用户。游戏中玩家可以选择不同的英雄，与队友一起战斗，摧毁敌方基地。',
    category: '动作游戏',
    iconUrl: 'https://img.gkbcdn.com/game/icon/20240115/1705289139210689825.png',
    apkUrl: 'https://example.com/download/1',
    version: '3.9.0.7834',
    fileSize: '2.5GB',
    isPublished: true,
    createdAt: new Date(),
    updatedAt: new Date(),
    downloadCount: 1250000000,
    rating: 4.8
  },
  {
    id: 6,
    name: '和平精英',
    packageName: 'com.tencent.tmgp.pubgmhd',
    description: '和平精英是一款由腾讯游戏开发的战术竞技游戏，玩家需要在游戏中收集装备，与其他玩家战斗，成为最后存活的人。',
    category: '动作游戏',
    iconUrl: 'https://img.gkbcdn.com/game/icon/20240115/1705289139210689825.png',
    apkUrl: 'https://example.com/download/2',
    version: '1.26.13',
    fileSize: '1.8GB',
    isPublished: true,
    createdAt: new Date(),
    updatedAt: new Date(),
    downloadCount: 860000000,
    rating: 4.7
  },
  {
    id: 7,
    name: '原神',
    packageName: 'com.miHoYo.GenshinImpact',
    description: '原神是一款由米哈游开发的开放世界角色扮演游戏，玩家可以在游戏中探索提瓦特大陆，与各种角色互动，参与各种活动。',
    category: '角色扮演',
    iconUrl: 'https://img.gkbcdn.com/game/icon/20240115/1705289139210689825.png',
    apkUrl: 'https://example.com/download/3',
    version: '4.4.0',
    fileSize: '3.2GB',
    isPublished: true,
    createdAt: new Date(),
    updatedAt: new Date(),
    downloadCount: 680000000,
    rating: 4.9
  },
  {
    id: 8,
    name: '开心消消乐',
    packageName: 'com.happyelements.AndroidAnimal',
    description: '开心消消乐是一款由乐元素开发的休闲益智游戏，玩家需要通过消除相同的动物头像来获得分数，挑战各种关卡。',
    category: '休闲益智',
    iconUrl: 'https://img.gkbcdn.com/game/icon/20240115/1705289139210689825.png',
    apkUrl: 'https://example.com/download/4',
    version: '1.124.0',
    fileSize: '180MB',
    isPublished: true,
    createdAt: new Date(),
    updatedAt: new Date(),
    downloadCount: 520000000,
    rating: 4.6
  }
]

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
      console.warn('数据库连接失败，使用模拟数据:', dbError)
      // 使用模拟数据
      games = mockGames.filter(game => {
        let match = true
        if (category && category !== '全部') {
          match = match && game.category === category
        }
        if (search && search.trim() !== '') {
          const searchLower = search.toLowerCase().trim()
          match = match && (
            game.name.toLowerCase().includes(searchLower) ||
            game.description.toLowerCase().includes(searchLower) ||
            game.category.toLowerCase().includes(searchLower)
          )
        }
        return match
      })
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
    return new Response(JSON.stringify(mockGames), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600'
      }
    })
  }
}