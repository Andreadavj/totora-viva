import { Router } from 'express';
import { initWebpay, confirmWebpay, getPaymentStatus } from '../controllers/payment.controller';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();
router.post('/webpay/init', authenticate, initWebpay);
router.post('/webpay/confirm', confirmWebpay);
router.get('/webpay/status/:token', authenticate, getPaymentStatus);

export default router;