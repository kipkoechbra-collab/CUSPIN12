import { Router, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import prisma from '../lib/prisma';
import { config } from '../config';
import { registerSchema, loginSchema } from '../validators';
import { authenticate, AuthRequest } from '../middleware/auth';

const router = Router();

// Generate tokens
function generateTokens(userId: string) {
  const accessToken = jwt.sign({ userId }, config.jwt.secret, {
    expiresIn: config.jwt.expiresIn as any,
  });
  const refreshToken = jwt.sign({ userId }, config.jwt.refreshSecret, {
    expiresIn: config.jwt.refreshExpiresIn as any,
  });
  return { accessToken, refreshToken };
}

// ─── Register ──────────────────────────────────────────────────────
router.post('/register', async (req, res: Response) => {
  try {
    const data = registerSchema.parse(req.body);

    const existing = await prisma.user.findUnique({ where: { email: data.email } });
    if (existing) {
      return res.status(400).json({ error: 'An account with this email already exists' });
    }

    const passwordHash = await bcrypt.hash(data.password, 12);

    const user = await prisma.user.create({
      data: {
        email: data.email,
        passwordHash,
        firstName: data.firstName,
        lastName: data.lastName,
        phone: data.phone,
        role: 'VENDOR',
      },
      select: { id: true, email: true, firstName: true, lastName: true, role: true },
    });

    const tokens = generateTokens(user.id);

    res.status(201).json({
      user,
      ...tokens,
    });
  } catch (error: any) {
    if (error.name === 'ZodError') {
      return res.status(400).json({ error: 'Validation failed', details: error.errors });
    }
    console.error('Register error:', error);
    res.status(500).json({ error: 'Registration failed' });
  }
});

// ─── Login ─────────────────────────────────────────────────────────
router.post('/login', async (req, res: Response) => {
  try {
    const data = loginSchema.parse(req.body);

    const user = await prisma.user.findUnique({ where: { email: data.email } });
    if (!user || !user.isActive) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const validPassword = await bcrypt.compare(data.password, user.passwordHash);
    if (!validPassword) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const tokens = generateTokens(user.id);

    res.json({
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
      },
      ...tokens,
    });
  } catch (error: any) {
    if (error.name === 'ZodError') {
      return res.status(400).json({ error: 'Validation failed', details: error.errors });
    }
    console.error('Login error:', error);
    res.status(500).json({ error: 'Login failed' });
  }
});

// ─── Refresh Token ─────────────────────────────────────────────────
router.post('/refresh', async (req, res: Response) => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) {
      return res.status(400).json({ error: 'Refresh token required' });
    }

    const decoded = jwt.verify(refreshToken, config.jwt.refreshSecret) as any;
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: { id: true, isActive: true },
    });

    if (!user || !user.isActive) {
      return res.status(401).json({ error: 'Invalid refresh token' });
    }

    const tokens = generateTokens(user.id);
    res.json(tokens);
  } catch {
    res.status(401).json({ error: 'Invalid refresh token' });
  }
});

// ─── Get Current User ──────────────────────────────────────────────
router.get('/me', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user!.id },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        phone: true,
        role: true,
        createdAt: true,
      },
    });
    res.json(user);
  } catch {
    res.status(500).json({ error: 'Failed to fetch user' });
  }
});

// ─── Setup Admin (One-time) ────────────────────────────────────────
router.post('/setup-admin', async (req, res: Response) => {
  try {
    const { email, password, firstName, lastName, setupKey } = req.body;

    if (setupKey !== config.adminSetupKey) {
      return res.status(403).json({ error: 'Invalid setup key' });
    }

    // Check if admin already exists
    const existingAdmin = await prisma.user.findFirst({ where: { role: 'ADMIN' } });
    if (existingAdmin) {
      return res.status(400).json({ error: 'Admin account already exists. Use the admin panel to create additional admins.' });
    }

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

    const tokens = generateTokens(admin.id);

    res.status(201).json({ user: admin, ...tokens });
  } catch (error: any) {
    console.error('Setup admin error:', error);
    res.status(500).json({ error: 'Failed to create admin' });
  }
});

export default router;
