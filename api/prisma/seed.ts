import { faker } from '@faker-js/faker'

import { GameStatus, Games, PrismaClient, Users } from '@prisma/client'
const prisma = new PrismaClient()

function getRandom(min: number, max: number) {
  return Math.floor(Math.random() * (max - min) + min);
}

async function seedLeags() {
  console.log('seeding leags')
  const leags = [
     {id: 1, name: "Bronze"},
     {id: 2, name: "Silver"},
     {id: 3, name: "Gold"} ,
     {id: 4, name: "platinum"} ,
     {id: 5, name: "diamond"} ,
     {id: 6, name: "heroic"} ,
     {id: 7, name: "Master"} ,
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
      // points: getRandom(1, 5000)
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

const hchakoub = async () => {
  const user = await prisma.users.create({
    data: {
      email: 'hchakoub@student.1337.ma',
      username: 'hchakoub',
      avatar: 'https://cdn.intra.42.fr/users/8274a9f7c70a8331a1b719c1eaf39417/medium_hchakoub.jpg',
      intra_id: 90322,
      points: getRandom(1, 5000),
      leagId: 4
  } 
  });
  return user;
}

const seedGames = async (users: Users[]) => {
 console.log('seeding games')
  // const statuses: GameStatus[] = ['STARTED', 'FINISHED', 'CEATED'];
   const games: Games[] = [];
    const hchakoub = await prisma.users.findUnique({
    where: {
      username: 'hchakoub'
    }
  });
  if(!hchakoub)
    throw new Error('hchakoub not found');
  for (let i = 0; i < 100; i++) {
  const otherId = users[getRandom(1, 10)].id;
  const ids = [otherId, hchakoub.id];
    const hostId = ids[getRandom(0,2)];
    const guestId = ids.indexOf(hostId) === 1 ? ids[0] : ids[1];
    const record = await prisma.games.create({
      data: {
        hostId: hostId,
        guestId: guestId,
        status: 'FINISHED',
        winnerId: ids[getRandom(0,2)], 
        winnerScore: 10,
        loserScore: getRandom(0, 10)
      }
    });
    await prisma.users.update({
      where: {
        id: record.winnerId
      },
      data: {
        points: {
          increment: 1
        }
      }
    });
    games.push(record);
  }
  return games;
}

async function main() {
  await seedLeags();
  await hchakoub();
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
