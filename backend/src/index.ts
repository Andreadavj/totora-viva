import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import path from 'path';

import authRoutes     from './routes/auth.routes';
import productRoutes  from './routes/product.routes';
import categoryRoutes from './routes/category.routes';
import cartRoutes     from './routes/cart.routes';
import orderRoutes    from './routes/order.routes';
import paymentRoutes  from './routes/payment.routes';
import adminRoutes    from './routes/admin.routes';

import { errorHandler } from './middleware/error.middleware';
import { notFound }     from './middleware/notFound.middleware';

const app  = express();
const PORT = process.env.PORT ?? 4000;

app.use(helmet());
app.use(cors({ origin: process.env.FRONTEND_URL ?? 'http://localhost:5173', credentials: true }));
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', message: '🌿 Totora Viva API corriendo', timestamp: new Date().toISOString() });
});

app.use('/api/auth',       authRoutes);
app.use('/api/products',   productRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/cart',       cartRoutes);
app.use('/api/orders',     orderRoutes);
app.use('/api/payments',   paymentRoutes);
app.use('/api/admin',      adminRoutes);

app.use(notFound);
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`🌿 Totora Viva API → http://localhost:${PORT}`);
  console.log(`   Entorno: ${process.env.NODE_ENV ?? 'development'}`);
});

export default app;
