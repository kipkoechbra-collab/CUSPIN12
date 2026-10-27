import prisma from './lib/prisma';
import bcrypt from 'bcryptjs';

async function seed() {
  console.log('🌱 Seeding database...');

  // Create admin user
  const adminPassword = await bcrypt.hash('admin123456', 12);
  const admin = await prisma.user.upsert({
    where: { email: 'admin@chardonholidaymarket.com' },
    update: {},
    create: {
      email: 'admin@chardonholidaymarket.com',
      passwordHash: adminPassword,
      firstName: 'Market',
      lastName: 'Admin',
      role: 'ADMIN',
      emailVerified: true,
    },
  });
  console.log('✅ Admin user created:', admin.email);

  // Create Market Weekends
  const weekends = await Promise.all([
    prisma.marketWeekend.upsert({
      where: { id: 'weekend-1' },
      update: {},
      create: {
        id: 'weekend-1',
        title: 'Weekend 1',
        description: 'Opening Weekend of the Chardon Holiday Market',
        startDate: new Date('2026-11-28'),
        endDate: new Date('2026-11-29'),
        openingHours: 'Saturday 10AM-8PM, Sunday 11AM-6PM',
        location: 'Chardon Square, Chardon, Ohio',
        vendorCapacity: 50,
        availableSpaces: 50,
        sortOrder: 1,
      },
    }),
    prisma.marketWeekend.upsert({
      where: { id: 'weekend-2' },
      update: {},
      create: {
        id: 'weekend-2',
        title: 'Weekend 2',
        description: 'Second Weekend of the Chardon Holiday Market',
        startDate: new Date('2026-12-04'),
        endDate: new Date('2026-12-06'),
        openingHours: 'Friday 5PM-9PM, Saturday 10AM-8PM, Sunday 11AM-6PM',
        location: 'Chardon Square, Chardon, Ohio',
        vendorCapacity: 50,
        availableSpaces: 50,
        sortOrder: 2,
      },
    }),
    prisma.marketWeekend.upsert({
      where: { id: 'weekend-3' },
      update: {},
      create: {
        id: 'weekend-3',
        title: 'Weekend 3',
        description: 'Third Weekend of the Chardon Holiday Market',
        startDate: new Date('2026-12-11'),
        endDate: new Date('2026-12-13'),
        openingHours: 'Friday 5PM-9PM, Saturday 10AM-8PM, Sunday 11AM-6PM',
        location: 'Chardon Square, Chardon, Ohio',
        vendorCapacity: 50,
        availableSpaces: 50,
        sortOrder: 3,
      },
    }),
    prisma.marketWeekend.upsert({
      where: { id: 'weekend-4' },
      update: {},
      create: {
        id: 'weekend-4',
        title: 'Weekend 4',
        description: 'Final Weekend & Grand Finale of the Chardon Holiday Market',
        startDate: new Date('2026-12-18'),
        endDate: new Date('2026-12-20'),
        openingHours: 'Friday 5PM-9PM, Saturday 10AM-8PM, Sunday 11AM-6PM',
        location: 'Chardon Square, Chardon, Ohio',
        vendorCapacity: 50,
        availableSpaces: 50,
        sortOrder: 4,
      },
    }),
  ]);
  console.log(`✅ ${weekends.length} market weekends created`);

  // Create FAQs
  const faqs = await Promise.all([
    prisma.fAQ.upsert({
      where: { id: 'faq-1' },
      update: {},
      create: {
        id: 'faq-1',
        question: 'When is the Chardon Holiday Market?',
        answer: 'The market runs for four weekends: November 28-29, December 4-6, December 11-13, and December 18-20, 2026.',
        category: 'General',
        sortOrder: 1,
      },
    }),
    prisma.fAQ.upsert({
      where: { id: 'faq-2' },
      update: {},
      create: {
        id: 'faq-2',
        question: 'Where is the market located?',
        answer: 'The Chardon Holiday Market is held at Chardon Square in the heart of downtown Chardon, Ohio.',
        category: 'General',
        sortOrder: 2,
      },
    }),
    prisma.fAQ.upsert({
      where: { id: 'faq-3' },
      update: {},
      create: {
        id: 'faq-3',
        question: 'Is there an admission fee?',
        answer: 'No! The Chardon Holiday Market is free to attend. Come enjoy the festivities, shopping, food, and entertainment at no cost.',
        category: 'General',
        sortOrder: 3,
      },
    }),
    prisma.fAQ.upsert({
      where: { id: 'faq-4' },
      update: {},
      create: {
        id: 'faq-4',
        question: 'How do I become a vendor?',
        answer: 'Click the "Become a Vendor" button on our website to fill out an application. Applications are reviewed by our team, and approved vendors will receive payment instructions. Vendor fees are $200 for a single weekend or $800 for the full season.',
        category: 'Vendors',
        sortOrder: 4,
      },
    }),
    prisma.fAQ.upsert({
      where: { id: 'faq-5' },
      update: {},
      create: {
        id: 'faq-5',
        question: 'What are the vendor fees?',
        answer: 'Single Weekend Vendor: $200 (includes vendor space for one weekend, website listing, and vendor map inclusion). Full Season Vendor: $800 (includes space for all four weekends, website listing, vendor map inclusion, and social media mention).',
        category: 'Vendors',
        sortOrder: 5,
      },
    }),
    prisma.fAQ.upsert({
      where: { id: 'faq-6' },
      update: {},
      create: {
        id: 'faq-6',
        question: 'Is parking available?',
        answer: 'Yes, free parking is available throughout downtown Chardon. Additional overflow parking will be designated during market weekends.',
        category: 'General',
        sortOrder: 6,
      },
    }),
    prisma.fAQ.upsert({
      where: { id: 'faq-7' },
      update: {},
      create: {
        id: 'faq-7',
        question: 'How can I become a sponsor?',
        answer: 'We offer various sponsorship levels from Community to Platinum. Visit our Sponsors page or contact us to learn about sponsorship opportunities and benefits.',
        category: 'Sponsors',
        sortOrder: 7,
      },
    }),
    prisma.fAQ.upsert({
      where: { id: 'faq-8' },
      update: {},
      create: {
        id: 'faq-8',
        question: 'Will there be food and drinks available?',
        answer: 'Absolutely! Our market features a variety of food vendors offering warm beverages, baked goods, specialty foods, and holiday treats. Enjoy hot cocoa, mulled cider, and festive snacks while you shop.',
        category: 'General',
        sortOrder: 8,
      },
    }),
  ]);
  console.log(`✅ ${faqs.length} FAQs created`);

  // Create Announcements
  const announcements = await Promise.all([
    prisma.announcement.upsert({
      where: { id: 'ann-1' },
      update: {},
      create: {
        id: 'ann-1',
        title: 'Vendor Applications Now Open!',
        content: 'Bringing the Magic of European Christmas Markets to Chardon Square • Vendor & Sponsor Applications Now Open',
        isActive: true,
        isPinned: true,
      },
    }),
  ]);
  console.log(`✅ ${announcements.length} announcements created`);

  // Create default site settings
  const settings = [
    { key: 'eventTitle', value: 'Chardon Holiday Market' },
    { key: 'eventDescription', value: 'A European-Inspired Christmas Market in the Heart of Chardon' },
    { key: 'eventLocation', value: 'Chardon Square, Chardon, Ohio' },
    { key: 'openingDate', value: '2026-11-28' },
    { key: 'closingDate', value: '2026-12-20' },
    { key: 'applicationOpenDate', value: '2026-06-01' },
    { key: 'applicationCloseDate', value: '2026-10-31' },
    { key: 'singleWeekendPrice', value: '200' },
    { key: 'fullSeasonPrice', value: '800' },
  ];

  for (const setting of settings) {
    await prisma.siteSettings.upsert({
      where: { key: setting.key },
      update: { value: setting.value },
      create: { id: setting.key, key: setting.key, value: setting.value },
    });
  }
  console.log(`✅ ${settings.length} site settings created`);

  console.log('\n🎄 Seed completed successfully!');
  console.log('   Admin login: admin@chardonholidaymarket.com / admin123456');
}

seed()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
