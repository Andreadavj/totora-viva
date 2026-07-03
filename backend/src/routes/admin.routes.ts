import { Router, Response, NextFunction } from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticate, requireAdmin } from '../middleware/auth.middleware';
import { AuthRequest } from '../types';

const router = Router();
const prisma = new PrismaClient();

router.use(authenticate, requireAdmin);

router.get('/stats', async (_req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const [totalOrders, totalUsers, totalProducts, recentOrders, revenue] = await Promise.all([
      prisma.order.count(),
      prisma.user.count({ where: { role: 'USER' } }),
      prisma.product.count({ where: { isActive: true } }),
      prisma.order.findMany({ take: 5, orderBy: { createdAt: 'desc' }, include: { user: { select: { firstName: true, lastName: true, email: true } } } }),
      prisma.order.aggregate({ where: { paymentStatus: 'APPROVED' }, _sum: { total: true } }),
    ]);
    res.json({ stats: { totalOrders, totalUsers, totalProducts, totalRevenue: revenue._sum.total ?? 0 }, recentOrders });
  } catch (error) { next(error); }
});

router.get('/orders', async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { status } = req.query as { status?: string };
    const orders = await prisma.order.findMany({
      where: status ? { status: status as any } : {},
      include: { user: { select: { firstName: true, lastName: true, email: true } }, orderItems: true, payment: true },
      orderBy: { createdAt: 'desc' },
    });
    res.json({ orders, total: orders.length });
  } catch (error) { next(error); }
});

router.patch('/orders/:id/status', async (req: AuthRequest<{ id: string }>, res: Response, next: NextFunction) => {
  try {
    const order = await prisma.order.update({ where: { id: req.params.id }, data: { status: req.body.status } });
    res.json({ message: 'Estado actualizado.', order });
  } catch (error) { next(error); }
});

router.get('/products', async (_req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const products = await prisma.product.findMany({ include: { category: true }, orderBy: { sortOrder: 'asc' } });
    res.json({ products });
  } catch (error) { next(error); }
});

router.put('/products/:id', async (req: AuthRequest<{ id: string }>, res: Response, next: NextFunction) => {
  try {
    const product = await prisma.product.update({ where: { id: req.params.id }, data: req.body });
    res.json({ product });
  } catch (error) { next(error); }
});

export default router;