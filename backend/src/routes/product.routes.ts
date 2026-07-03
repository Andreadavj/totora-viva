import { Router } from 'express';
import { getProducts, getProductBySlug, calculatePrice } from '../controllers/product.controller';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();

router.get('/', getProducts);
router.get('/:slug', getProductBySlug);
router.post('/calculate-price', authenticate, calculatePrice);

export default router;