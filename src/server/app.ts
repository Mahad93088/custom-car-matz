import express from 'express';
import { authRouter } from './routes/authRoutes.ts';
import { publicRouter } from './routes/publicRoutes.ts';
import { customerRouter } from './routes/customerRoutes.ts';
import { stripeRouter } from './routes/stripeRoutes.ts';
import { adminRouter } from './routes/adminRoutes.ts';

export const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    store: 'Custom Car Mats UK',
    version: '1.0.0',
    timestamp: new Date().toISOString()
  });
});

// Mount modular routers
app.use('/api/auth', authRouter);
app.use('/api/customer', customerRouter);
app.use('/api/payments', stripeRouter);
app.use('/api/admin', adminRouter);
app.use('/api', publicRouter);

// Fallback 404 for unmatched API routes
app.use('/api/*', (req, res) => {
  res.status(404).json({ error: 'API route not found' });
});
