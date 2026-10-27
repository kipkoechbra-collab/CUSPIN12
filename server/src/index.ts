import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { config } from './config';
import authRoutes from './routes/auth';
import applicationRoutes from './routes/applications';
import adminRoutes from './routes/admin';
import publicRoutes from './routes/public';

const app = express();

// ─── Security ──────────────────────────────────────────────────────
app.use(helmet({
  crossOriginResourcePolicy: { policy: 'cross-origin' },
}));

app.use(cors({
  origin: config.clientUrl,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

// ─── Rate Limiting ─────────────────────────────────────────────────
const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: { error: 'Too many requests, please try again later.' },
});

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  message: { error: 'Too many authentication attempts. Please try again later.' },
});

const formLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 10,
  message: { error: 'Too many submissions. Please try again later.' },
});

// ─── Body Parsing ──────────────────────────────────────────────────
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// ─── Static Files ──────────────────────────────────────────────────
app.use('/uploads', express.static(config.upload.dir));

// ─── Routes ────────────────────────────────────────────────────────
app.use('/api/auth', authLimiter, authRoutes);
app.use('/api/applications', generalLimiter, applicationRoutes);
app.use('/api/admin', generalLimiter, adminRoutes);
app.use('/api/public', generalLimiter, publicRoutes);

// Apply form limiter to specific public POST routes
app.use('/api/public/contact', formLimiter);
app.use('/api/public/newsletter', formLimiter);
app.use('/api/public/sponsor-application', formLimiter);

// ─── Health Check ──────────────────────────────────────────────────
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// ─── Error Handling ────────────────────────────────────────────────
app.use((err: any, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error('Unhandled error:', err);
  res.status(500).json({
    error: config.env === 'development' ? err.message : 'Internal server error',
  });
});

// ─── Start Server ──────────────────────────────────────────────────
app.listen(config.port, () => {
  console.log(`🎄 Chardon Holiday Market API running on port ${config.port}`);
  console.log(`   Environment: ${config.env}`);
  console.log(`   Client URL: ${config.clientUrl}`);
});

export default app;
