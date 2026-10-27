import { Router, Response } from 'express';
import prisma from '../lib/prisma';
import { authenticate, requireVendor, AuthRequest } from '../middleware/auth';
import { vendorApplicationSchema } from '../validators';

const router = Router();

// ─── Submit Application ────────────────────────────────────────────
router.post('/', authenticate, requireVendor, async (req: AuthRequest, res: Response) => {
  try {
    const data = vendorApplicationSchema.parse(req.body);

    // Check if user already has a pending/active application
    const existingApp = await prisma.vendorApplication.findFirst({
      where: {
        userId: req.user!.id,
        status: { notIn: ['REJECTED', 'CANCELLED'] },
      },
    });

    if (existingApp) {
      return res.status(400).json({
        error: 'You already have an active application. Please check your dashboard.',
      });
    }

    const application = await prisma.vendorApplication.create({
      data: {
        userId: req.user!.id,
        businessName: data.businessName,
        businessAddress: data.businessAddress,
        city: data.city,
        state: data.state,
        zipCode: data.zipCode,
        website: data.website || null,
        instagram: data.instagram || null,
        facebook: data.facebook || null,
        productCategory: data.productCategory as any,
        productDescription: data.productDescription,
        priceRange: data.priceRange || null,
        yearsInBusiness: data.yearsInBusiness ?? null,
        previousExperience: data.previousExperience || null,
        requestedWeekendId: data.requestedWeekendId || null,
        vendorPackage: data.vendorPackage as any,
        electricityRequired: data.electricityRequired,
        isFoodVendor: data.isFoodVendor,
        requiredPermits: data.requiredPermits || null,
        specialRequirements: data.specialRequirements || null,
        additionalComments: data.additionalComments || null,
        agreedToTerms: data.agreedToTerms,
        agreedAt: new Date(),
        status: 'PENDING',
      },
      include: {
        requestedWeekend: true,
      },
    });

    // Create payment record (unpaid)
    const amount = data.vendorPackage === 'FULL_SEASON' ? 800 : 200;
    await prisma.payment.create({
      data: {
        applicationId: application.id,
        amount,
        status: 'UNPAID',
      },
    });

    res.status(201).json({
      message: 'Thank you for applying to the Chardon Holiday Market. Your application has been received and will be reviewed by our team. Payment is only requested after approval.',
      application,
    });
  } catch (error: any) {
    if (error.name === 'ZodError') {
      return res.status(400).json({ error: 'Validation failed', details: error.errors });
    }
    console.error('Application submit error:', error);
    res.status(500).json({ error: 'Failed to submit application' });
  }
});

// ─── Get My Applications ───────────────────────────────────────────
router.get('/my', authenticate, requireVendor, async (req: AuthRequest, res: Response) => {
  try {
    const applications = await prisma.vendorApplication.findMany({
      where: { userId: req.user!.id },
      include: {
        requestedWeekend: true,
        payment: true,
        messages: {
          orderBy: { createdAt: 'desc' },
          take: 10,
        },
        uploadedFiles: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    res.json(applications);
  } catch {
    res.status(500).json({ error: 'Failed to fetch applications' });
  }
});

// ─── Get Application by ID ────────────────────────────────────────
router.get('/:id', authenticate, requireVendor, async (req: AuthRequest, res: Response) => {
  try {
    const id = String(req.params.id);
    const application = await prisma.vendorApplication.findFirst({
      where: {
        id,
        userId: req.user!.id,
      },
      include: {
        requestedWeekend: true,
        payment: true,
        messages: {
          orderBy: { createdAt: 'desc' },
        },
        uploadedFiles: true,
      },
    });

    if (!application) {
      return res.status(404).json({ error: 'Application not found' });
    }

    res.json(application);
  } catch {
    res.status(500).json({ error: 'Failed to fetch application' });
  }
});

// ─── Update Application ───────────────────────────────────────────
router.put('/:id', authenticate, requireVendor, async (req: AuthRequest, res: Response) => {
  try {
    const id = String(req.params.id);
    const application = await prisma.vendorApplication.findFirst({
      where: {
        id,
        userId: req.user!.id,
      },
    });

    if (!application) {
      return res.status(404).json({ error: 'Application not found' });
    }

    if (application.isLocked) {
      return res.status(403).json({ error: 'Application is locked and cannot be modified' });
    }

    if (['PAID', 'CONFIRMED', 'CANCELLED'].includes(application.status)) {
      return res.status(403).json({ error: 'Application cannot be modified in its current status' });
    }

    const updatable = [
      'businessName', 'businessAddress', 'city', 'state', 'zipCode',
      'website', 'instagram', 'facebook', 'productDescription',
      'priceRange', 'specialRequirements', 'additionalComments',
    ];

    const updateData: any = {};
    for (const field of updatable) {
      if (req.body[field] !== undefined) {
        updateData[field] = req.body[field];
      }
    }

    const updated = await prisma.vendorApplication.update({
      where: { id },
      data: updateData,
      include: { requestedWeekend: true, payment: true },
    });

    res.json(updated);
  } catch {
    res.status(500).json({ error: 'Failed to update application' });
  }
});

export default router;
