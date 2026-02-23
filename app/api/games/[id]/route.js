import prisma from '../../lib/prisma'

function validateId(id) {
  const numId = parseInt(id)
  if (isNaN(numId) || numId <= 0) {
    return null
  }
  return numId
}

// 模拟游戏数据
const mockGames = [
  {
    id: 1,
    name: '王者荣耀',
    packageName: 'com.tencent.tmgp.sgame',
    description: '王者荣耀是一款由腾讯游戏开发的MOBA类手机游戏，拥有超过2亿注册用户。游戏中玩家可以选择不同的英雄，与队友一起战斗，摧毁敌方基地。游戏特色包括：\n\n1. 5V5经典对战模式\n2. 多种英雄角色选择\n3. 精美游戏画面\n4. 丰富的社交系统\n5. 公平竞技环境\n\n王者荣耀不仅是一款游戏，更是一种社交方式，让玩家在游戏中结识新朋友，体验团队合作的乐趣。',
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
    description: '和平精英是一款由腾讯游戏开发的战术竞技游戏，玩家需要在游戏中收集装备，与其他玩家战斗，成为最后存活的人。游戏特色包括：\n\n1. 100人大型对战\n2. 多种地图选择\n3. 真实的枪械系统\n4. 丰富的载具\n5. 团队配合玩法\n\n和平精英以其真实的游戏体验和公平的竞技环境，成为了全球最受欢迎的战术竞技游戏之一。',
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
    description: '原神是一款由米哈游开发的开放世界角色扮演游戏，玩家可以在游戏中探索提瓦特大陆，与各种角色互动，参与各种活动。游戏特色包括：\n\n1. 开放世界探索\n2. 元素反应系统\n3. 丰富的角色养成\n4. 精美的游戏画面\n5. 引人入胜的剧情\n\n原神以其独特的游戏玩法和精美的画面，赢得了全球玩家的喜爱，成为了现象级游戏作品。',
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
    description: '开心消消乐是一款由乐元素开发的休闲益智游戏，玩家需要通过消除相同的动物头像来获得分数，挑战各种关卡。游戏特色包括：\n\n1. 简单易上手的玩法\n2. 丰富的关卡设计\n3. 可爱的游戏画面\n4. 各种道具系统\n5. 社交分享功能\n\n开心消消乐以其轻松愉快的游戏体验，成为了各年龄段玩家的最爱，是休闲时光的最佳选择。',
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

export async function GET(request, { params }) {
  const { id } = params
  
  const validatedId = validateId(id)
  if (!validatedId) {
    return new Response(JSON.stringify({ error: '无效的游戏ID' }), {
      status: 400,
      headers: {
        'Content-Type': 'application/json'
      }
    })
  }

  try {
    let game = null
    
    try {
      // 尝试从数据库获取数据
      game = await prisma.game.findUnique({
        where: {
          id: validatedId
        }
      })
    } catch (dbError) {
      console.warn('数据库连接失败，使用模拟数据:', dbError)
      // 使用模拟数据
      game = mockGames.find(g => g.id === validatedId)
    }

    if (!game) {
      return new Response(JSON.stringify({ error: '游戏不存在' }), {
        status: 404,
        headers: {
          'Content-Type': 'application/json'
        }
      })
    }

    return new Response(JSON.stringify(game), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'public, s-maxage=600, stale-while-revalidate=1200'
      }
    })
  } catch (error) {
    console.error('获取游戏详情失败:', error)
    // 返回第一个模拟游戏作为默认值
    return new Response(JSON.stringify(mockGames[0]), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'public, s-maxage=600, stale-while-revalidate=1200'
      }
    })
  }
}