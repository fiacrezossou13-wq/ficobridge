import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const hashedPassword = await bcrypt.hash('FicoBridge2024!', 12);

  const user = await prisma.user.upsert({
    where: { email: 'fico@example.com' },
    update: {},
    create: {
      email: 'fico@example.com',
      password: hashedPassword,
      firstName: 'Fico',
      lastName: 'Bridge',
      role: 'USER',
      twoFAEnabled: true,
    },
  });

  const applications = [
    {
      company: 'Bouygues Construction',
      position: 'Apprenti Ingénieur Génie Civil',
      city: 'Paris',
      sector: 'Génie Civil',
      contractType: 'ALTERNANCE',
      salary: '1800€/mois',
      platform: 'LinkedIn',
      status: 'INTERVIEW',
      sentAt: new Date('2024-01-15'),
      interviewAt: new Date('2024-01-25'),
    },
    {
      company: 'Eiffage Génie Civil',
      position: "Apprenti Chargé d'Affaires",
      city: 'Lyon',
      sector: 'Génie Civil',
      contractType: 'ALTERNANCE',
      salary: '1700€/mois',
      platform: 'Indeed',
      status: 'SENT',
      sentAt: new Date('2024-01-20'),
    },
    {
      company: 'Vinci Construction',
      position: 'Apprenti Conducteur de Travaux',
      city: 'Marseille',
      sector: 'Construction',
      contractType: 'ALTERNANCE',
      salary: '1900€/mois',
      platform: 'Welcome to the Jungle',
      status: 'OFFER',
      sentAt: new Date('2024-01-10'),
      interviewAt: new Date('2024-01-18'),
      responseAt: new Date('2024-01-22'),
    },
    {
      company: 'Colas',
      position: 'Apprenti Ingénieur Travaux',
      city: 'Bordeaux',
      sector: 'Routes & Infrastructures',
      contractType: 'ALTERNANCE',
      salary: '1750€/mois',
      platform: 'LinkedIn',
      status: 'REJECTED',
      sentAt: new Date('2024-01-05'),
      responseAt: new Date('2024-01-15'),
    },
    {
      company: 'Dumez',
      position: 'Apprenti Ingénieur Projet',
      city: 'Nantes',
      sector: 'Génie Civil',
      contractType: 'ALTERNANCE',
      salary: '1800€/mois',
      platform: 'Indeed',
      status: 'FOLLOWUP',
      sentAt: new Date('2024-01-22'),
      followUpAt: new Date('2024-01-29'),
    },
  ];

  for (const app of applications) {
    await prisma.application.create({
      data: { ...app, userId: user.id },
    });
  }

  console.log('✅ Database seeded successfully');
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });
