import { PrismaClient } from '@prisma/client';
import { hashPassword } from '../src/utils/auth';

const prisma = new PrismaClient();

async function main() {
    const email = 'demo@example.com';
    const password = 'password123';
    const passwordHash = await hashPassword(password);

    const user = await prisma.user.upsert({
        where: { email },
        update: {},
        create: {
            email,
            passwordHash,
            name: 'Demo User',
            habits: {
                create: [
                    {
                        title: 'Drink Water',
                        description: 'Drink 2L of water daily',
                        scheduleType: 'DAILY',
                        color: '#3B82F6',
                    },
                    {
                        title: 'Exercise',
                        description: '30 mins of cardio',
                        scheduleType: 'WEEKLY',
                        color: '#EF4444',
                    },
                ],
            },
        },
    });

    console.log({ user });
}

main()
    .then(async () => {
        await prisma.$disconnect();
    })
    .catch(async (e) => {
        console.error(e);
        await prisma.$disconnect();
        process.exit(1);
    });
