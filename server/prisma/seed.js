// server/prisma/seed.js
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seed...');

  // 1. Create Default Admin User
  const adminEmail = 'admin@brancheslab.com';
  const existingAdmin = await prisma.user.findUnique({ where: { email: adminEmail } });

  if (!existingAdmin) {
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash('AdminPass2026!', salt);

    await prisma.user.create({
      data: {
        email: adminEmail,
        name: 'Branches Lab Admin',
        passwordHash,
        role: 'ADMIN'
      }
    });
    console.log('✅ Admin user created: admin@brancheslab.com / AdminPass2026!');
  } else {
    console.log('ℹ️ Admin user already exists.');
  }

  // 2. Seed Default Services
  const initialServices = [
    {
      title: 'Product Strategy & Discovery',
      slug: 'product-strategy-discovery',
      category: 'STRATEGY',
      description: 'Validate ideas before you invest. We run focused discovery sprints to define your roadmap, align stakeholders, and de-risk your biggest bets.',
      icon: '🎯',
      featured: true
    },
    {
      title: 'UX/UI Design & Prototyping',
      slug: 'ux-ui-design-prototyping',
      category: 'DESIGN',
      description: 'Beautiful interfaces grounded in research. We design experiences that feel intuitive, convert visitors into users, and keep them coming back.',
      icon: '✨',
      featured: true
    },
    {
      title: 'Custom Software Engineering',
      slug: 'custom-software-engineering',
      category: 'ENGINEERING',
      description: 'Full-stack development with an obsession for clean architecture. We build web apps, mobile platforms, and APIs that scale with your ambition.',
      icon: '🛠️',
      featured: true
    },
    {
      title: 'AI & Machine Learning',
      slug: 'ai-machine-learning',
      category: 'AI_DATA',
      description: 'Put intelligence to work. From predictive models to natural language processing, we embed AI where it creates real, measurable business value.',
      icon: '🤖',
      featured: true
    },
    {
      title: 'Cloud & DevOps',
      slug: 'cloud-devops',
      category: 'INFRASTRUCTURE',
      description: 'Ship faster with confidence. We architect cloud-native infrastructure, CI/CD pipelines, and monitoring systems that keep your product rock-solid.',
      icon: '☁️',
      featured: true
    },
    {
      title: 'Cybersecurity & Compliance',
      slug: 'cybersecurity-compliance',
      category: 'SECURITY',
      description: 'Protect what you\'ve built. We provide threat assessments, penetration testing, and compliance audits so you can grow without worry.',
      icon: '🔒',
      featured: true
    }
  ];

  for (const s of initialServices) {
    await prisma.service.upsert({
      where: { slug: s.slug },
      update: s,
      create: s
    });
  }
  console.log(`✅ Seeded ${initialServices.length} services.`);
  console.log('🌱 Database seed completed successfully.');
}

main()
  .catch((e) => {
    console.error('❌ Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
