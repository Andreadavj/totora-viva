// frontend/src/App.jsx
import { Routes, Route, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { ToastProvider } from './context/ToastContext';

import Header from './components/Header';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';

import Home from './pages/Home';
import About from './pages/About';
import Products from './pages/Products';
import ProductDetail from './pages/ProductDetail';
import Cart from './pages/Cart';
import Login from './pages/Login';
import Register from './pages/Register';
import Checkout from './pages/Checkout';
import WebpayRedirect from './pages/WebpayRedirect';
import PaymentConfirmation from './pages/PaymentConfirmation';
import MyOrders from './pages/MyOrders';
import Profile from './pages/Profile';
import NotFound from './pages/NotFound';

import AdminLayout from './pages/admin/AdminLayout';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminProducts from './pages/admin/AdminProducts';
import AdminOrders from './pages/admin/AdminOrders';

// Scroll al inicio en cada cambio de ruta
function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

// Layout principal con header y footer
function MainLayout({ children }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Header />
      <main style={{ flex: 1 }}>{children}</main>
      <Footer />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <ToastProvider>
          <ScrollToTop />
          <Routes>
            {/* Rutas de admin (sin header/footer principal) */}
            <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<AdminDashboard />} />
              <Route path="productos" element={<AdminProducts />} />
              <Route path="ordenes" element={<AdminOrders />} />
            </Route>

            {/* Webpay redirect (página de pago simulada, sin header) */}
            <Route path="/checkout/webpay-redirect" element={<WebpayRedirect />} />

            {/* Rutas principales con header/footer */}
            <Route path="/" element={<MainLayout><Home /></MainLayout>} />
            <Route path="/nosotros" element={<MainLayout><About /></MainLayout>} />
            <Route path="/productos" element={<MainLayout><Products /></MainLayout>} />
            <Route path="/productos/:slug" element={<MainLayout><ProductDetail /></MainLayout>} />
            <Route path="/carrito" element={<MainLayout><Cart /></MainLayout>} />
            <Route path="/login" element={<MainLayout><Login /></MainLayout>} />
            <Route path="/register" element={<MainLayout><Register /></MainLayout>} />

            <Route path="/checkout" element={
              <MainLayout>
                <ProtectedRoute><Checkout /></ProtectedRoute>
              </MainLayout>
            } />
            <Route path="/checkout/confirmar" element={<MainLayout><PaymentConfirmation /></MainLayout>} />

            <Route path="/mis-ordenes" element={
              <MainLayout>
                <ProtectedRoute><MyOrders /></ProtectedRoute>
              </MainLayout>
            } />
            <Route path="/perfil" element={
              <MainLayout>
                <ProtectedRoute><Profile /></ProtectedRoute>
              </MainLayout>
            } />

            <Route path="*" element={<MainLayout><NotFound /></MainLayout>} />
          </Routes>
        </ToastProvider>
      </CartProvider>
    </AuthProvider>
  );
}
