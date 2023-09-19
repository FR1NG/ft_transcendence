import { faker } from '@faker-js/faker'

import { GameStatus, Games, PrismaClient, Users } from '@prisma/client'
const prisma = new PrismaClient()

function getRandom(min: number, max: number) {
  return Math.floor(Math.random() * (max - min) + min);
}

async function seedLeags() {
  console.log('seeding leags')
  const leags = [
     {id: 1, name: "Wood"} ,
     {id: 2, name: "Silver"} ,
     {id: 3, name: "Gold"} ,
     {id: 4, name: "Legend"} ,
  ];
  leags.forEach(async el => {
    console.log(el)
    await prisma.leag.create({
      data: {
        id: el.id,
        name: el.name
      }
    })
  })
}

async function seedUsers() {
  console.log('creating users');
  const users: Users[] = [];
  for (let i = 10; i < 20; i++) {
    const user = {
      email: faker.internet.email(),
      username: faker.person.firstName(),
      avatar: faker.image.avatar(),
      intra_id: getRandom(1, 234234434),
    }
    console.log('user to be created')
    console.log(user)
    const record = await prisma.users.upsert({
      where: { email: user.email },
      update: {},
      create: {
        email: user.email,
        username: user.username,
        intra_id: user.intra_id,
        avatar: user.avatar,
      },
    });
    users.push(record);
  }
  return users;
}

const seedGames = async (users: Users[]) => {
 console.log('seeding games')
  // const statuses: GameStatus[] = ['STARTED', 'FINISHED', 'CEATED'];
   const games: Games[] = [];
  const otherId = users[getRandom(1, 10)].id;
  const ids = [otherId, users[0].id];
  for (let i = 0; i < 15; i++) {
    const hostId = ids[getRandom(0,2)];
    const guestId = ids.indexOf(otherId) === 1 ? ids[0] : ids[1];
    const record = await prisma.games.create({
      data: {
        hostId: hostId,
        guestId: guestId,
        status: 'FINISHED',
        winnerId: users[0].id, 
        winnerScore: 10,
        loserScore: getRandom(0, 10)
      }
    });
    games.push(record);
  }
  return games;
}

async function main() {
  await seedLeags();
  const users = await seedUsers();
  const games = await seedGames(users);
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
