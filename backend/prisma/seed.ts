import { PrismaClient, Role } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  const users = [
    {
      name: 'Monis Siddiqi',
      email: 'monissiddiqi123@gmail.com',
      mobile: '+917557503282',
      password: 'Password@123',
      role: Role.USER,
    },
  ];

  //Adding User
  for (let index = 0; index < users.length; index++) {
    const user = users[index];
    await prisma.user.upsert({
      where: {
        email: user.email,
      },
      update: {},
      create: {
        email: user.email,
        mobile: user.mobile,
        password: await createHash(user.password),
        role: user.role as Role,
        UserProfile: {
          create: {
            name: user.name,
            profilePhoto: 'uploads/users/profile.png',
          },
        },
      },
    });
  }
}

const createHash = async (password: string): Promise<string> => {
  const salt = await bcrypt.genSalt();
  return await bcrypt.hash(password, salt);
};

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
