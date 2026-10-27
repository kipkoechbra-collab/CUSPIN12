import { Router, Response } from 'express';
import prisma from '../lib/prisma';
import { contactSchema, newsletterSchema, sponsorApplicationSchema } from '../validators';

const router = Router();

// ─── Get Active Market Weekends ────────────────────────────────────
router.get('/weekends', async (_req, res: Response) => {
  try {
    const weekends = await prisma.marketWeekend.findMany({
      where: { isActive: true },
      orderBy: { sortOrder: 'asc' },
    });
    res.json(weekends);
  } catch {
    res.status(500).json({ error: 'Failed to fetch weekends' });
  }
});

// ─── Get Public Vendors ────────────────────────────────────────────
router.get('/vendors', async (req, res: Response) => {
  try {
    const { category, weekend } = req.query;
    const where: any = {
      isPublicListing: true,
      status: { in: ['PAID', 'CONFIRMED'] },
    };
    if (category) where.productCategory = category;
    if (weekend) where.requestedWeekendId = weekend;

    const vendors = await prisma.vendorApplication.findMany({
      where,
      select: {
        id: true,
        businessName: true,
        productCategory: true,
        productDescription: true,
        website: true,
        instagram: true,
        facebook: true,
        vendorPackage: true,
        requestedWeekend: true,
        uploadedFiles: {
          take: 1,
          select: { url: true, originalName: true },
        },
      },
      orderBy: { businessName: 'asc' },
    });

    res.json(vendors);
  } catch {
    res.status(500).json({ error: 'Failed to fetch vendors' });
  }
});

// ─── Get Active Sponsors ───────────────────────────────────────────
router.get('/sponsors', async (_req, res: Response) => {
  try {
    const sponsors = await prisma.sponsor.findMany({
      where: { isActive: true },
      orderBy: [{ level: 'asc' }, { sortOrder: 'asc' }],
    });
    res.json(sponsors);
  } catch {
    res.status(500).json({ error: 'Failed to fetch sponsors' });
  }
});

// ─── Get Active Announcements ──────────────────────────────────────
router.get('/announcements', async (_req, res: Response) => {
  try {
    const now = new Date();
    const announcements = await prisma.announcement.findMany({
      where: {
        isActive: true,
        OR: [
          { startDate: null, endDate: null },
          { startDate: { lte: now }, endDate: null },
          { startDate: null, endDate: { gte: now } },
          { startDate: { lte: now }, endDate: { gte: now } },
        ],
      },
      orderBy: [{ isPinned: 'desc' }, { createdAt: 'desc' }],
    });
    res.json(announcements);
  } catch {
    res.status(500).json({ error: 'Failed to fetch announcements' });
  }
});

// ─── Get Active FAQs ──────────────────────────────────────────────
router.get('/faqs', async (_req, res: Response) => {
  try {
    const faqs = await prisma.fAQ.findMany({
      where: { isActive: true },
      orderBy: { sortOrder: 'asc' },
    });
    res.json(faqs);
  } catch {
    res.status(500).json({ error: 'Failed to fetch FAQs' });
  }
});

// ─── Submit Contact Message ────────────────────────────────────────
router.post('/contact', async (req, res: Response) => {
  try {
    const data = contactSchema.parse(req.body);

    const message = await prisma.contactMessage.create({ data });

    res.status(201).json({
      message: 'Thank you for your message. We will get back to you soon!',
      id: message.id,
    });
  } catch (error: any) {
    if (error.name === 'ZodError') {
      return res.status(400).json({ error: 'Validation failed', details: error.errors });
    }
    res.status(500).json({ error: 'Failed to send message' });
  }
});

// ─── Newsletter Signup ─────────────────────────────────────────────
router.post('/newsletter', async (req, res: Response) => {
  try {
    const data = newsletterSchema.parse(req.body);

    const existing = await prisma.newsletterSubscriber.findUnique({
      where: { email: data.email },
    });

    if (existing) {
      if (!existing.isActive) {
        await prisma.newsletterSubscriber.update({
          where: { email: data.email },
          data: { isActive: true },
        });
        return res.json({ message: 'Welcome back! You have been re-subscribed.' });
      }
      return res.json({ message: 'You are already subscribed!' });
    }

    await prisma.newsletterSubscriber.create({ data });

    res.status(201).json({ message: 'Thank you for subscribing to our newsletter!' });
  } catch (error: any) {
    if (error.name === 'ZodError') {
      return res.status(400).json({ error: 'Validation failed', details: error.errors });
    }
    res.status(500).json({ error: 'Failed to subscribe' });
  }
});

// ─── Sponsor Application ──────────────────────────────────────────
router.post('/sponsor-application', async (req, res: Response) => {
  try {
    const data = sponsorApplicationSchema.parse(req.body);

    await prisma.sponsorApplication.create({ data });

    res.status(201).json({
      message: 'Thank you for your interest in sponsoring the Chardon Holiday Market! Our team will be in touch soon.',
    });
  } catch (error: any) {
    if (error.name === 'ZodError') {
      return res.status(400).json({ error: 'Validation failed', details: error.errors });
    }
    res.status(500).json({ error: 'Failed to submit sponsor application' });
  }
});

// ─── Get Site Settings (public) ────────────────────────────────────
router.get('/settings', async (_req, res: Response) => {
  try {
    const settings = await prisma.siteSettings.findMany();
    const settingsMap: Record<string, string> = {};
    settings.forEach(s => { settingsMap[s.key] = s.value; });
    res.json(settingsMap);
  } catch {
    res.status(500).json({ error: 'Failed to fetch settings' });
  }
});

export default router;
