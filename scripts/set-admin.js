const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
  const users = await prisma.user.findMany({
    orderBy: { id: 'asc' },
    take: 1
  })

  if (users.length > 0) {
    const updated = await prisma.user.update({
      where: { id: users[0].id },
      data: { role: 'admin' }
    })
    console.log(`已将用户 ${updated.name} (${updated.email}) 设为管理员`)
  } else {
    console.log('数据库中没有用户')
  }

  await prisma.$disconnect()
}

main()
