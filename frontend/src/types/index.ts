// Tipos que describen la FORMA de los datos que vienen de la API.
// Al usarlos en componentes, el editor sabe exactamente qué propiedades
// tiene cada objeto y te avisa si intentas acceder a una que no existe.

export type PricingType = 'PER_SQM' | 'FIXED' | 'WEAVE_TYPE';
export type WeaveType   = 'fine' | 'coarse';
export type UserRole    = 'USER' | 'ADMIN';

export type OrderStatus   = 'PENDING' | 'CONFIRMED' | 'PROCESSING' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED';
export type PaymentStatus = 'PENDING' | 'PROCESSING' | 'APPROVED' | 'REJECTED' | 'REFUNDED';

export interface Category {
  id:          string;
  name:        string;
  slug:        string;
  description?: string;
  _count?:     { products: number };
}

export interface Product {
  id:               string;
  name:             string;
  slug:             string;
  description:      string;
  shortDescription?: string;
  pricingType:      PricingType;
  hasFineOption:    boolean;
  hasCoarseOption:  boolean;
  images:           string[];
  features:         string[];
  lifespan?:        string;
  isFeatured:       boolean;
  category:         Category;
}

export interface CartItem {
  id:          string;
  quantity:    number;
  width?:      number;
  height?:     number;
  weaveType?:  WeaveType;
  totalPrice:  number;
  customNotes?: string;
  product:     Pick<Product, 'id' | 'name' | 'slug' | 'images' | 'pricingType' | 'hasFineOption' | 'hasCoarseOption'> & {
    category: Pick<Category, 'name' | 'slug'>;
  };
}

export interface Cart {
  items:     CartItem[];
  subtotal:  number;
  itemCount: number;
}

export interface User {
  id:         string;
  email:      string;
  firstName:  string;
  lastName:   string;
  phone?:     string;
  address?:   string;
  city?:      string;
  region?:    string;
  role:       UserRole;
  createdAt:  string;
}

export interface ShippingAddress {
  firstName: string;
  lastName:  string;
  email:     string;
  phone:     string;
  address:   string;
  city:      string;
  region:    string;
}

export interface OrderItem {
  id:          string;
  productName: string;
  quantity:    number;
  width?:      number;
  height?:     number;
  weaveType?:  string;
  unitPrice:   number;
  totalPrice:  number;
  product?:    Pick<Product, 'id' | 'name' | 'images'>;
}

export interface Payment {
  id:              string;
  status:          PaymentStatus;
  authCode?:       string;
  cardLastFour?:   string;
  responseMessage?: string;
}

export interface Order {
  id:              string;
  orderNumber:     string;
  status:          OrderStatus;
  paymentStatus:   PaymentStatus;
  subtotal:        number;
  total:           number;
  shippingAddress: ShippingAddress;
  notes?:          string;
  createdAt:       string;
  orderItems:      OrderItem[];
  payment?:        Payment;
  user?:           Pick<User, 'firstName' | 'lastName' | 'email'>;
}