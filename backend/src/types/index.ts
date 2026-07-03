// backend/src/types/index.ts
import { Request } from 'express';

/**
 * CONCEPTO: Extender tipos de Express
 *
 * Express tiene un tipo `Request` que describe una petición HTTP.
 * Por defecto, NO incluye `userId` ni `userRole` porque eso es algo
 * que nosotros agregamos en nuestro middleware de autenticación.
 *
 * Con `extends` le SUMAMOS esas propiedades al tipo de Request,
 * para que TypeScript las reconozca en todos los controladores.
 *
 * Los genéricos <P, ResBody, ReqBody, ReqQuery> permiten tipar
 * los parámetros URL, respuesta, body y query string de cada endpoint.
 */
export interface AuthRequest<
  P = {},
  ResBody = any,
  ReqBody = any,
  ReqQuery = any
> extends Request<P, ResBody, ReqBody, ReqQuery> {
  userId?: string;
  userRole?: 'USER' | 'ADMIN';
}

// CONCEPTO: Union types
// Estos tipos solo pueden tener UNO de los valores listados.
// Si escribes 'fino' en vez de 'fine', TypeScript te avisa.
export type WeaveType = 'fine' | 'coarse';
export type PricingType = 'PER_SQM' | 'FIXED' | 'WEAVE_TYPE';

// CONCEPTO: Interfaces para los bodies de las peticiones
// Cada interfaz describe la "forma" del JSON que llega en req.body.
export interface RegisterBody {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone?: string; // el ? significa que es OPCIONAL
}

export interface LoginBody {
  email: string;
  password: string;
}

export interface UpdateProfileBody {
  firstName?: string;
  lastName?: string;
  phone?: string;
  address?: string;
  city?: string;
  region?: string;
}

export interface PriceCalculationBody {
  productId: string;
  width?: number;
  height?: number;
  weaveType?: WeaveType;
}

export interface AddToCartBody extends PriceCalculationBody {
  quantity?: number;
  customNotes?: string;
}

export interface UpdateCartItemBody {
  quantity: number;
}

export interface ShippingAddress {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  region: string;
}

export interface CreateOrderBody {
  shippingAddress: ShippingAddress;
  notes?: string;
}

export interface InitWebpayBody {
  orderId: string;
}

export interface ConfirmWebpayBody {
  token_ws?: string;
  TBK_TOKEN?: string;
}

export interface WebpayTransactionResult {
  buy_order: string;
  session_id: string;
  amount: number;
  status: 'AUTHORIZED' | 'FAILED';
  authorization_code: string;
  payment_type_code: string;
  response_code: number;
  card_detail: { card_number: string };
  transaction_date: string;
  vci: string;
}