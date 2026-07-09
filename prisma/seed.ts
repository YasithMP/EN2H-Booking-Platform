import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';
import * as bcrypt from 'bcrypt';
import 'dotenv/config';

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
    console.log('Seeding database...');

    // 1. Create a default admin user
    const adminEmail = 'admin@example.com';
    const existingAdmin = await prisma.user.findUnique({
        where: { email: adminEmail },
    });

    if (!existingAdmin) {
        const hashedPassword = await bcrypt.hash('adminpassword', 10);
        const admin = await prisma.user.create({
            data: {
                email: adminEmail,
                password: hashedPassword,
            },
        });
        console.log(`Created default user: ${admin.email}`);
    } else {
        console.log(`Default user already exists: ${existingAdmin.email}`);
    }

    // 2. Create default services
    const services = [
        {
            title: 'General Consultation',
            description: 'A standard health and wellness consultation.',
            duration: 30,
            price: 50.0,
            isActive: true,
        },
        {
            title: 'Physiotherapy Session',
            description: 'Physical therapy and rehab session with a trained specialist.',
            duration: 45,
            price: 75.0,
            isActive: true,
        },
        {
            title: 'Dental Cleaning',
            description: 'Professional dental cleaning and oral checkup.',
            duration: 60,
            price: 120.0,
            isActive: true,
        },
        {
            title: 'Discontinued Diagnostic',
            description: 'An old testing service that is no longer offered.',
            duration: 15,
            price: 25.0,
            isActive: false, // inactive service for testing validators!
        },
    ];

    for (const service of services) {
        const existingService = await prisma.service.findFirst({
            where: { title: service.title },
        });

        if (!existingService) {
            const created = await prisma.service.create({
                data: service,
            });
            console.log(`Created service: ${created.title} (ID: ${created.id})`);
        } else {
            console.log(`Service already exists: ${existingService.title}`);
        }
    }

    console.log('Seeding completed.');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
