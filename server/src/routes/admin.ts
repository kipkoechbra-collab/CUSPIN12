import { Router, Response } from 'express';
import prisma from '../lib/prisma';
import { authenticate, requireAdmin, AuthRequest } from '../middleware/auth';
import bcrypt from 'bcryptjs';
import {
  faqSchema, announcementSchema, marketWeekendSchema, sponsorSchema,
} from '../validators';

const router = Router();

// All admin routes require authentication + admin role
router.use(authenticate, requireAdmin);

// ═══════════════════════════════════════════════════════════════════
// DASHBOARD STATS
// ═══════════════════════════════════════════════════════════════════

router.get('/stats', async (req: AuthRequest, res: Response) => {
  try {
    const [
      totalApplications,
      pendingApplications,
      underReviewApplications,
      approvedApplications,
      rejectedApplications,
      awaitingPayment,
      paidApplications,
      confirmedApplications,
      singleWeekend,
      fullSeason,
      totalRevenue,
      totalSpaces,
      contactMessages,
      newsletterSubs,
    ] = await Promise.all([
      prisma.vendorApplication.count(),
      prisma.vendorApplication.count({ where: { status: 'PENDING' } }),
      prisma.vendorApplication.count({ where: { status: 'UNDER_REVIEW' } }),
      prisma.vendorApplication.count({ where: { status: 'APPROVED' } }),
      prisma.vendorApplication.count({ where: { status: 'REJECTED' } }),
      prisma.vendorApplication.count({ where: { status: 'AWAITING_PAYMENT' } }),
      prisma.vendorApplication.count({ where: { status: 'PAID' } }),
      prisma.vendorApplication.count({ where: { status: 'CONFIRMED' } }),
      prisma.vendorApplication.count({ where: { vendorPackage: 'SINGLE_WEEKEND' } }),
      prisma.vendorApplication.count({ where: { vendorPackage: 'FULL_SEASON' } }),
      prisma.payment.aggregate({ where: { status: 'PAID' }, _sum: { amount: true } }),
      prisma.marketWeekend.aggregate({ _sum: { availableSpaces: true } }),
      prisma.contactMessage.count({ where: { isRead: false } }),
      prisma.newsletterSubscriber.count({ where: { isActive: true } }),
    ]);

    // Applications by category
    const categoryStats = await prisma.vendorApplication.groupBy({
      by: ['productCategory'],
      _count: { productCategory: true },
    });

    // Applications by weekend
    const weekendStats = await prisma.vendorApplication.groupBy({
      by: ['requestedWeekendId'],
      _count: { requestedWeekendId: true },
    });

    // Applications by status
    const statusStats = await prisma.vendorApplication.groupBy({
      by: ['status'],
      _count: { status: true },
    });

    res.json({
      totalApplications,
      pendingApplications,
      underReviewApplications,
      approvedVendors: approvedApplications + awaitingPayment + paidApplications + confirmedApplications,
      rejectedApplications,
      awaitingPayment,
      paidVendors: paidApplications + confirmedApplications,
      confirmedApplications,
      singleWeekendVendors: singleWeekend,
      fullSeasonVendors: fullSeason,
      totalRevenue: totalRevenue._sum.amount || 0,
      availableSpaces: totalSpaces._sum.availableSpaces || 0,
      unreadMessages: contactMessages,
      newsletterSubscribers: newsletterSubs,
      charts: {
        byCategory: categoryStats,
        byWeekend: weekendStats,
        byStatus: statusStats,
      },
    });
  } catch (error) {
    console.error('Stats error:', error);
    res.status(500).json({ error: 'Failed to fetch stats' });
  }
});

// ═══════════════════════════════════════════════════════════════════
// APPLICATION MANAGEMENT
// ═══════════════════════════════════════════════════════════════════

router.get('/applications', async (req: AuthRequest, res: Response) => {
  try {
    const { status, category, package: pkg, weekend, search, page = '1', limit = '20' } = req.query;

    const where: any = {};
    if (status) where.status = status as any;
    if (category) where.productCategory = category as any;
    if (pkg) where.vendorPackage = pkg as any;
    if (weekend) where.requestedWeekendId = String(weekend);
    if (search) {
      where.OR = [
        { businessName: { contains: String(search), mode: 'insensitive' } },
        { user: { firstName: { contains: String(search), mode: 'insensitive' } } },
        { user: { lastName: { contains: String(search), mode: 'insensitive' } } },
        { user: { email: { contains: String(search), mode: 'insensitive' } } },
      ];
    }

    const skip = (parseInt(String(page)) - 1) * parseInt(String(limit));

    const [applications, total] = await Promise.all([
      prisma.vendorApplication.findMany({
        where,
        include: {
          user: { select: { id: true, firstName: true, lastName: true, email: true, phone: true } },
          requestedWeekend: true,
          payment: true,
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: parseInt(String(limit)),
      }),
      prisma.vendorApplication.count({ where }),
    ]);

    res.json({
      applications,
      total,
      page: parseInt(String(page)),
      totalPages: Math.ceil(total / parseInt(String(limit))),
    });
  } catch (error) {
    console.error('Fetch applications error:', error);
    res.status(500).json({ error: 'Failed to fetch applications' });
  }
});

router.get('/applications/:id', async (req: AuthRequest, res: Response) => {
  try {
    const id = String(req.params.id);
    const application = await prisma.vendorApplication.findUnique({
      where: { id },
      include: {
        user: { select: { id: true, firstName: true, lastName: true, email: true, phone: true } },
        requestedWeekend: true,
        payment: true,
        messages: { orderBy: { createdAt: 'desc' } },
        uploadedFiles: true,
      },
    });

    if (!application) {
      return res.status(404).json({ error: 'Application not found' });
    }

    // Fetch audit log for this application
    const auditLog = await prisma.adminAuditLog.findMany({
      where: { entityType: 'APPLICATION', entityId: id },
      include: { user: { select: { firstName: true, lastName: true } } },
      orderBy: { createdAt: 'desc' },
    });

    res.json({ application, auditLog });
  } catch {
    res.status(500).json({ error: 'Failed to fetch application' });
  }
});

// ─── Update Application Status ────────────────────────────────────
router.patch('/applications/:id/status', async (req: AuthRequest, res: Response) => {
  try {
    const id = String(req.params.id);
    const { status, reviewNotes } = req.body;
    const validStatuses = [
      'PENDING', 'UNDER_REVIEW', 'APPROVED', 'REJECTED',
      'AWAITING_PAYMENT', 'PAID', 'CONFIRMED', 'CANCELLED',
    ];

    if (!validStatuses.includes(status)) {
      return res.status(400).json({ error: 'Invalid status' });
    }

    const application = await prisma.vendorApplication.findUnique({
      where: { id },
      include: { payment: true },
    });

    if (!application) {
      return res.status(404).json({ error: 'Application not found' });
    }

    const oldStatus = application.status;

    const updateData: any = {
      status,
      reviewedBy: req.user!.id,
      reviewedAt: new Date(),
    };

    if (reviewNotes !== undefined) {
      updateData.reviewNotes = reviewNotes;
    }

    // If approved, set to awaiting payment
    if (status === 'APPROVED') {
      updateData.status = 'AWAITING_PAYMENT';
      if (application.payment) {
        await prisma.payment.update({
          where: { applicationId: application.id },
          data: { status: 'PAYMENT_REQUESTED' },
        });
      }
    }

    const updated = await prisma.vendorApplication.update({
      where: { id },
      data: updateData,
      include: { user: { select: { firstName: true, lastName: true, email: true } }, payment: true },
    });

    // Create audit log
    await prisma.adminAuditLog.create({
      data: {
        userId: req.user!.id,
        action: `STATUS_CHANGE`,
        entityType: 'APPLICATION',
        entityId: id,
        oldValue: JSON.stringify({ status: oldStatus }),
        newValue: JSON.stringify({ status: updated.status, reviewNotes }),
      },
    });

    res.json(updated);
  } catch (error) {
    console.error('Status update error:', error);
    res.status(500).json({ error: 'Failed to update status' });
  }
});

// ─── Toggle Public Listing ─────────────────────────────────────────
router.patch('/applications/:id/public', async (req: AuthRequest, res: Response) => {
  try {
    const id = String(req.params.id);
    const { isPublicListing } = req.body;
    const updated = await prisma.vendorApplication.update({
      where: { id },
      data: { isPublicListing },
    });

    await prisma.adminAuditLog.create({
      data: {
        userId: req.user!.id,
        action: 'TOGGLE_PUBLIC_LISTING',
        entityType: 'APPLICATION',
        entityId: id,
        newValue: JSON.stringify({ isPublicListing }),
      },
    });

    res.json(updated);
  } catch {
    res.status(500).json({ error: 'Failed to update listing visibility' });
  }
});

// ─── Lock/Unlock Application ───────────────────────────────────────
router.patch('/applications/:id/lock', async (req: AuthRequest, res: Response) => {
  try {
    const id = String(req.params.id);
    const { isLocked } = req.body;
    const updated = await prisma.vendorApplication.update({
      where: { id },
      data: { isLocked },
    });

    await prisma.adminAuditLog.create({
      data: {
        userId: req.user!.id,
        action: isLocked ? 'LOCK_APPLICATION' : 'UNLOCK_APPLICATION',
        entityType: 'APPLICATION',
        entityId: id,
      },
    });

    res.json(updated);
  } catch {
    res.status(500).json({ error: 'Failed to toggle application lock' });
  }
});

// ─── Send Message to Vendor ────────────────────────────────────────
router.post('/applications/:id/messages', async (req: AuthRequest, res: Response) => {
  try {
    const id = String(req.params.id);
    const { subject, content } = req.body;
    const message = await prisma.message.create({
      data: {
        applicationId: id,
        senderId: req.user!.id,
        subject,
        content,
        isFromAdmin: true,
      },
    });

    res.status(201).json(message);
  } catch {
    res.status(500).json({ error: 'Failed to send message' });
  }
});

// ═══════════════════════════════════════════════════════════════════
// PAYMENT MANAGEMENT
// ═══════════════════════════════════════════════════════════════════

router.get('/payments', async (req: AuthRequest, res: Response) => {
  try {
    const { status } = req.query;
    const where: any = {};
    if (status) where.status = status as any;

    const payments = await prisma.payment.findMany({
      where,
      include: {
        application: {
          include: {
            user: { select: { firstName: true, lastName: true, email: true } },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    res.json(payments);
  } catch {
    res.status(500).json({ error: 'Failed to fetch payments' });
  }
});

router.patch('/payments/:id/mark-paid', async (req: AuthRequest, res: Response) => {
  try {
    const id = String(req.params.id);
    const { transactionRef, note } = req.body;

    const payment = await prisma.payment.findUnique({
      where: { id },
      include: { application: true },
    });

    if (!payment) {
      return res.status(404).json({ error: 'Payment not found' });
    }

    const updated = await prisma.payment.update({
      where: { id },
      data: {
        status: 'PAID',
        isManualPayment: true,
        manualPaymentNote: note || 'Manually marked as paid by admin',
        markedPaidBy: req.user!.id,
        transactionRef: transactionRef || `MANUAL-${Date.now()}`,
        paymentDate: new Date(),
      },
    });

    // Update application status
    await prisma.vendorApplication.update({
      where: { id: payment.applicationId },
      data: { status: 'PAID' },
    });

    // Audit log
    await prisma.adminAuditLog.create({
      data: {
        userId: req.user!.id,
        action: 'MARK_PAYMENT_RECEIVED',
        entityType: 'PAYMENT',
        entityId: id,
        newValue: JSON.stringify({ transactionRef, note }),
      },
    });

    res.json(updated);
  } catch {
    res.status(500).json({ error: 'Failed to mark payment' });
  }
});

router.patch('/payments/:id/refund', async (req: AuthRequest, res: Response) => {
  try {
    const id = String(req.params.id);
    const { refundAmount, note } = req.body;

    const payment = await prisma.payment.findUnique({ where: { id } });
    if (!payment) return res.status(404).json({ error: 'Payment not found' });

    const updated = await prisma.payment.update({
      where: { id },
      data: {
        status: 'REFUNDED',
        refundDate: new Date(),
        refundAmount: refundAmount || payment.amount,
      },
    });

    await prisma.adminAuditLog.create({
      data: {
        userId: req.user!.id,
        action: 'REFUND_PAYMENT',
        entityType: 'PAYMENT',
        entityId: id,
        newValue: JSON.stringify({ refundAmount, note }),
      },
    });

    res.json(updated);
  } catch {
    res.status(500).json({ error: 'Failed to process refund' });
  }
});

// ═══════════════════════════════════════════════════════════════════
// MARKET WEEKENDS
// ═══════════════════════════════════════════════════════════════════

router.get('/weekends', async (_req, res: Response) => {
  try {
    const weekends = await prisma.marketWeekend.findMany({ orderBy: { sortOrder: 'asc' } });
    res.json(weekends);
  } catch {
    res.status(500).json({ error: 'Failed to fetch weekends' });
  }
});

router.post('/weekends', async (req: AuthRequest, res: Response) => {
  try {
    const data = marketWeekendSchema.parse(req.body);
    const weekend = await prisma.marketWeekend.create({
      data: {
        ...data,
        startDate: new Date(data.startDate),
        endDate: new Date(data.endDate),
      },
    });

    await prisma.adminAuditLog.create({
      data: {
        userId: req.user!.id,
        action: 'CREATE_WEEKEND',
        entityType: 'MARKET_WEEKEND',
        entityId: weekend.id,
        newValue: JSON.stringify(data),
      },
    });

    res.status(201).json(weekend);
  } catch (error: any) {
    if (error.name === 'ZodError') return res.status(400).json({ error: 'Validation failed', details: error.errors });
    res.status(500).json({ error: 'Failed to create weekend' });
  }
});

router.put('/weekends/:id', async (req: AuthRequest, res: Response) => {
  try {
    const id = String(req.params.id);
    const data = marketWeekendSchema.parse(req.body);
    const weekend = await prisma.marketWeekend.update({
      where: { id },
      data: {
        ...data,
        startDate: new Date(data.startDate),
        endDate: new Date(data.endDate),
      },
    });

    await prisma.adminAuditLog.create({
      data: {
        userId: req.user!.id,
        action: 'UPDATE_WEEKEND',
        entityType: 'MARKET_WEEKEND',
        entityId: id,
        newValue: JSON.stringify(data),
      },
    });

    res.json(weekend);
  } catch (error: any) {
    if (error.name === 'ZodError') return res.status(400).json({ error: 'Validation failed', details: error.errors });
    res.status(500).json({ error: 'Failed to update weekend' });
  }
});

router.delete('/weekends/:id', async (req: AuthRequest, res: Response) => {
  try {
    const id = String(req.params.id);
    await prisma.marketWeekend.delete({ where: { id } });

    await prisma.adminAuditLog.create({
      data: {
        userId: req.user!.id,
        action: 'DELETE_WEEKEND',
        entityType: 'MARKET_WEEKEND',
        entityId: id,
      },
    });

    res.json({ message: 'Weekend deleted' });
  } catch {
    res.status(500).json({ error: 'Failed to delete weekend' });
  }
});

// ═══════════════════════════════════════════════════════════════════
// SPONSORS
// ═══════════════════════════════════════════════════════════════════

router.get('/sponsors', async (_req, res: Response) => {
  try {
    const sponsors = await prisma.sponsor.findMany({ orderBy: { sortOrder: 'asc' } });
    res.json(sponsors);
  } catch {
    res.status(500).json({ error: 'Failed to fetch sponsors' });
  }
});

router.post('/sponsors', async (req: AuthRequest, res: Response) => {
  try {
    const data = sponsorSchema.parse(req.body);
    const sponsor = await prisma.sponsor.create({ data });
    res.status(201).json(sponsor);
  } catch (error: any) {
    if (error.name === 'ZodError') return res.status(400).json({ error: 'Validation failed', details: error.errors });
    res.status(500).json({ error: 'Failed to create sponsor' });
  }
});

router.put('/sponsors/:id', async (req: AuthRequest, res: Response) => {
  try {
    const id = String(req.params.id);
    const data = sponsorSchema.parse(req.body);
    const sponsor = await prisma.sponsor.update({ where: { id }, data });
    res.json(sponsor);
  } catch (error: any) {
    if (error.name === 'ZodError') return res.status(400).json({ error: 'Validation failed', details: error.errors });
    res.status(500).json({ error: 'Failed to update sponsor' });
  }
});

router.delete('/sponsors/:id', async (req: AuthRequest, res: Response) => {
  try {
    const id = String(req.params.id);
    await prisma.sponsor.delete({ where: { id } });
    res.json({ message: 'Sponsor deleted' });
  } catch {
    res.status(500).json({ error: 'Failed to delete sponsor' });
  }
});

// Sponsor Applications
router.get('/sponsor-applications', async (_req, res: Response) => {
  try {
    const apps = await prisma.sponsorApplication.findMany({ orderBy: { createdAt: 'desc' } });
    res.json(apps);
  } catch {
    res.status(500).json({ error: 'Failed to fetch sponsor applications' });
  }
});

router.patch('/sponsor-applications/:id', async (req: AuthRequest, res: Response) => {
  try {
    const id = String(req.params.id);
    const { status } = req.body;
    const app = await prisma.sponsorApplication.update({
      where: { id },
      data: { status },
    });
    res.json(app);
  } catch {
    res.status(500).json({ error: 'Failed to update sponsor application' });
  }
});

// ═══════════════════════════════════════════════════════════════════
// ANNOUNCEMENTS
// ═══════════════════════════════════════════════════════════════════

router.get('/announcements', async (_req, res: Response) => {
  try {
    const announcements = await prisma.announcement.findMany({ orderBy: { createdAt: 'desc' } });
    res.json(announcements);
  } catch {
    res.status(500).json({ error: 'Failed to fetch announcements' });
  }
});

router.post('/announcements', async (req: AuthRequest, res: Response) => {
  try {
    const data = announcementSchema.parse(req.body);
    const announcement = await prisma.announcement.create({
      data: {
        ...data,
        startDate: data.startDate ? new Date(data.startDate) : null,
        endDate: data.endDate ? new Date(data.endDate) : null,
      },
    });
    res.status(201).json(announcement);
  } catch (error: any) {
    if (error.name === 'ZodError') return res.status(400).json({ error: 'Validation failed', details: error.errors });
    res.status(500).json({ error: 'Failed to create announcement' });
  }
});

router.put('/announcements/:id', async (req: AuthRequest, res: Response) => {
  try {
    const id = String(req.params.id);
    const data = announcementSchema.parse(req.body);
    const announcement = await prisma.announcement.update({
      where: { id },
      data: {
        ...data,
        startDate: data.startDate ? new Date(data.startDate) : null,
        endDate: data.endDate ? new Date(data.endDate) : null,
      },
    });
    res.json(announcement);
  } catch (error: any) {
    if (error.name === 'ZodError') return res.status(400).json({ error: 'Validation failed', details: error.errors });
    res.status(500).json({ error: 'Failed to update announcement' });
  }
});

router.delete('/announcements/:id', async (req: AuthRequest, res: Response) => {
  try {
    const id = String(req.params.id);
    await prisma.announcement.delete({ where: { id } });
    res.json({ message: 'Announcement deleted' });
  } catch {
    res.status(500).json({ error: 'Failed to delete announcement' });
  }
});

// ═══════════════════════════════════════════════════════════════════
// FAQs
// ═══════════════════════════════════════════════════════════════════

router.get('/faqs', async (_req, res: Response) => {
  try {
    const faqs = await prisma.fAQ.findMany({ orderBy: { sortOrder: 'asc' } });
    res.json(faqs);
  } catch {
    res.status(500).json({ error: 'Failed to fetch FAQs' });
  }
});

router.post('/faqs', async (req: AuthRequest, res: Response) => {
  try {
    const data = faqSchema.parse(req.body);
    const faq = await prisma.fAQ.create({ data });
    res.status(201).json(faq);
  } catch (error: any) {
    if (error.name === 'ZodError') return res.status(400).json({ error: 'Validation failed', details: error.errors });
    res.status(500).json({ error: 'Failed to create FAQ' });
  }
});

router.put('/faqs/:id', async (req: AuthRequest, res: Response) => {
  try {
    const id = String(req.params.id);
    const data = faqSchema.parse(req.body);
    const faq = await prisma.fAQ.update({ where: { id }, data });
    res.json(faq);
  } catch (error: any) {
    if (error.name === 'ZodError') return res.status(400).json({ error: 'Validation failed', details: error.errors });
    res.status(500).json({ error: 'Failed to update FAQ' });
  }
});

router.delete('/faqs/:id', async (req: AuthRequest, res: Response) => {
  try {
    const id = String(req.params.id);
    await prisma.fAQ.delete({ where: { id } });
    res.json({ message: 'FAQ deleted' });
  } catch {
    res.status(500).json({ error: 'Failed to delete FAQ' });
  }
});

// ═══════════════════════════════════════════════════════════════════
// CONTACT MESSAGES
// ═══════════════════════════════════════════════════════════════════

router.get('/messages', async (req: AuthRequest, res: Response) => {
  try {
    const { unread } = req.query;
    const where: any = {};
    if (unread === 'true') where.isRead = false;

    const messages = await prisma.contactMessage.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    });
    res.json(messages);
  } catch {
    res.status(500).json({ error: 'Failed to fetch messages' });
  }
});

router.patch('/messages/:id/read', async (req: AuthRequest, res: Response) => {
  try {
    const id = String(req.params.id);
    const message = await prisma.contactMessage.update({
      where: { id },
      data: { isRead: true },
    });
    res.json(message);
  } catch {
    res.status(500).json({ error: 'Failed to mark message as read' });
  }
});

router.delete('/messages/:id', async (req: AuthRequest, res: Response) => {
  try {
    const id = String(req.params.id);
    await prisma.contactMessage.delete({ where: { id } });
    res.json({ message: 'Message deleted' });
  } catch {
    res.status(500).json({ error: 'Failed to delete message' });
  }
});

// ═══════════════════════════════════════════════════════════════════
// NEWSLETTER
// ═══════════════════════════════════════════════════════════════════

router.get('/newsletter', async (_req, res: Response) => {
  try {
    const subscribers = await prisma.newsletterSubscriber.findMany({
      orderBy: { subscribedAt: 'desc' },
    });
    res.json(subscribers);
  } catch {
    res.status(500).json({ error: 'Failed to fetch subscribers' });
  }
});

// ═══════════════════════════════════════════════════════════════════
// AUDIT LOG
// ═══════════════════════════════════════════════════════════════════

router.get('/audit-log', async (req: AuthRequest, res: Response) => {
  try {
    const { entityType, entityId, page = '1', limit = '50' } = req.query;
    const where: any = {};
    if (entityType) where.entityType = String(entityType);
    if (entityId) where.entityId = String(entityId);

    const skip = (parseInt(String(page)) - 1) * parseInt(String(limit));

    const [logs, total] = await Promise.all([
      prisma.adminAuditLog.findMany({
        where,
        include: { user: { select: { firstName: true, lastName: true, email: true } } },
        orderBy: { createdAt: 'desc' },
        skip,
        take: parseInt(String(limit)),
      }),
      prisma.adminAuditLog.count({ where }),
    ]);

    res.json({ logs, total });
  } catch {
    res.status(500).json({ error: 'Failed to fetch audit log' });
  }
});

// ═══════════════════════════════════════════════════════════════════
// ADMIN MANAGEMENT
// ═══════════════════════════════════════════════════════════════════

router.get('/admins', async (_req, res: Response) => {
  try {
    const admins = await prisma.user.findMany({
      where: { role: 'ADMIN' },
      select: { id: true, email: true, firstName: true, lastName: true, isActive: true, createdAt: true },
    });
    res.json(admins);
  } catch {
    res.status(500).json({ error: 'Failed to fetch admins' });
  }
});

router.post('/admins', async (req: AuthRequest, res: Response) => {
  try {
    const { email, password, firstName, lastName } = req.body;
    const passwordHash = await bcrypt.hash(password, 12);

    const admin = await prisma.user.create({
      data: {
        email,
        passwordHash,
        firstName,
        lastName,
        role: 'ADMIN',
        emailVerified: true,
      },
      select: { id: true, email: true, firstName: true, lastName: true, role: true },
    });

    await prisma.adminAuditLog.create({
      data: {
        userId: req.user!.id,
        action: 'CREATE_ADMIN',
        entityType: 'USER',
        entityId: admin.id,
        newValue: JSON.stringify({ email, firstName, lastName }),
      },
    });

    res.status(201).json(admin);
  } catch {
    res.status(500).json({ error: 'Failed to create admin' });
  }
});

// ═══════════════════════════════════════════════════════════════════
// SITE SETTINGS
// ═══════════════════════════════════════════════════════════════════

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

router.put('/settings', async (req: AuthRequest, res: Response) => {
  try {
    const updates = req.body as Record<string, string>;

    for (const [key, value] of Object.entries(updates)) {
      await prisma.siteSettings.upsert({
        where: { key },
        create: { id: key, key, value: String(value) },
        update: { value: String(value) },
      });
    }

    await prisma.adminAuditLog.create({
      data: {
        userId: req.user!.id,
        action: 'UPDATE_SETTINGS',
        entityType: 'SITE_SETTINGS',
        newValue: JSON.stringify(updates),
      },
    });

    res.json({ message: 'Settings updated' });
  } catch {
    res.status(500).json({ error: 'Failed to update settings' });
  }
});

export default router;
