import { faker } from '@faker-js/faker'

import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()
async function main() {
  for (let i = 10; i < 20; i++) {
    const user = {
      username: faker.person.firstName(),
      email: faker.internet.email(),
      avatar: faker.image.avatar(),
      intra_id: i,
    }
      const record = await prisma.users.upsert({
      where: { email: user.email },
      update: {},
      create: {
        email: user.email,
        username: user.username,
        intra_id: user.intra_id,
        avatar: user.avatar
      },
    });
    console.log(record)
  }
}
main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
