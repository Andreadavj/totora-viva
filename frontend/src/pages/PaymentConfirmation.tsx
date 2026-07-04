// frontend/src/pages/PaymentConfirmation.jsx
import { useEffect, useState } from 'react';
import { useNavigate, Link, useSearchParams } from 'react-router-dom';
import api from '../services/api';
import { useCart } from '../context/CartContext';
import { formatCLP, formatDate } from '../utils/helpers';
import styles from './PaymentConfirmation.module.css';

export default function PaymentConfirmation() {
  const [searchParams] = useSearchParams();
  const { refetch } = useCart();
  const [status, setStatus] = useState('loading'); // loading | approved | rejected | cancelled | error
  const [result, setResult] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const confirm = async () => {
      const token_ws = searchParams.get('token_ws');
      const TBK_TOKEN = searchParams.get('TBK_TOKEN');

      if (!token_ws && !TBK_TOKEN) {
        // Acceso directo sin token: intentar usar el guardado en sesión
        const savedToken = sessionStorage.getItem('tv_webpay_token');
        if (!savedToken) {
          setStatus('error');
          return;
        }
        try {
          const { data } = await api.post('/payments/webpay/confirm', { token_ws: savedToken });
          handleResult(data);
        } catch {
          setStatus('error');
        }
        return;
      }

      try {
        const { data } = await api.post('/payments/webpay/confirm', { token_ws, TBK_TOKEN });
        handleResult(data);
      } catch {
        setStatus('error');
      }
    };

    const handleResult = (data) => {
      if (data.status === 'APPROVED') {
        setStatus('approved');
        setResult(data);
        refetch();
        sessionStorage.removeItem('tv_webpay_token');
      } else if (data.status === 'CANCELLED') {
        setStatus('cancelled');
      } else {
        setStatus('rejected');
      }
    };

    confirm();
  }, [searchParams, refetch]);

  if (status === 'loading') {
    return (
      <div className={styles.page}>
        <div className={styles.box}>
          <div className="spinner" style={{ width: 40, height: 40, margin: '0 auto 1.5rem' }} />
          <h2>Confirmando tu pago…</h2>
          <p>Por favor espera, esto puede tomar unos segundos.</p>
        </div>
      </div>
    );
  }

  if (status === 'approved') {
    const orderNumber = sessionStorage.getItem('tv_last_order');
    return (
      <div className={styles.page}>
        <div className={`${styles.box} animate-scale-in`}>
          <div className={styles.iconSuccess}>
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M20 6 9 17l-5-5"/>
            </svg>
          </div>
          <h1>¡Pago aprobado!</h1>
          <p className={styles.subtitle}>
            Gracias por tu compra. Hemos recibido tu pedido y nos pondremos en
            contacto contigo para coordinar la entrega.
          </p>

          {orderNumber && (
            <div className={styles.orderBox}>
              <span className={styles.orderLabel}>Número de orden</span>
              <span className={styles.orderNumber}>{orderNumber}</span>
            </div>
          )}

          {result?.payment && (
            <div className={styles.paymentDetails}>
              <div className={styles.detailRow}>
                <span>Código de autorización</span>
                <span>{result.payment.authCode}</span>
              </div>
              <div className={styles.detailRow}>
                <span>Tarjeta terminada en</span>
                <span>**** {result.payment.cardLastFour}</span>
              </div>
              <div className={styles.detailRow}>
                <span>Fecha</span>
                <span>{formatDate(new Date())}</span>
              </div>
              {result.order?.total && (
                <div className={styles.detailRow}>
                  <span>Monto pagado</span>
                  <strong>{formatCLP(result.order.total)}</strong>
                </div>
              )}
            </div>
          )}

          <div className={styles.actions}>
            <Link to="/mis-ordenes" className="btn btn-primary btn-lg">Ver mis pedidos</Link>
            <Link to="/productos" className="btn btn-ghost">Seguir comprando</Link>
          </div>
        </div>
      </div>
    );
  }

  if (status === 'cancelled') {
    return (
      <div className={styles.page}>
        <div className={`${styles.box} animate-scale-in`}>
          <div className={styles.iconWarning}>
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <circle cx="12" cy="12" r="10"/>
              <line x1="12" y1="8" x2="12" y2="12"/>
              <line x1="12" y1="16" x2="12.01" y2="16"/>
            </svg>
          </div>
          <h1>Pago cancelado</h1>
          <p className={styles.subtitle}>
            Cancelaste el proceso de pago. Tu carrito sigue disponible si quieres intentarlo nuevamente.
          </p>
          <div className={styles.actions}>
            <Link to="/checkout" className="btn btn-primary btn-lg">Intentar nuevamente</Link>
            <Link to="/carrito" className="btn btn-ghost">Volver al carrito</Link>
          </div>
        </div>
      </div>
    );
  }

  if (status === 'rejected') {
    return (
      <div className={styles.page}>
        <div className={`${styles.box} animate-scale-in`}>
          <div className={styles.iconError}>
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <circle cx="12" cy="12" r="10"/>
              <line x1="15" y1="9" x2="9" y2="15"/>
              <line x1="9" y1="9" x2="15" y2="15"/>
            </svg>
          </div>
          <h1>Pago rechazado</h1>
          <p className={styles.subtitle}>
            Tu pago no pudo ser procesado. Verifica los datos de tu tarjeta o intenta con otro medio de pago.
          </p>
          <div className={styles.actions}>
            <Link to="/checkout" className="btn btn-primary btn-lg">Intentar nuevamente</Link>
            <Link to="/carrito" className="btn btn-ghost">Volver al carrito</Link>
          </div>
        </div>
      </div>
    );
  }

  // error genérico
  return (
    <div className={styles.page}>
      <div className={`${styles.box} animate-scale-in`}>
        <div className={styles.iconError}>
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <circle cx="12" cy="12" r="10"/>
            <line x1="12" y1="8" x2="12" y2="12"/>
            <line x1="12" y1="16" x2="12.01" y2="16"/>
          </svg>
        </div>
        <h1>Algo salió mal</h1>
        <p className={styles.subtitle}>
          No pudimos verificar el estado de tu pago. Revisa tus pedidos o contáctanos si el problema persiste.
        </p>
        <div className={styles.actions}>
          <Link to="/mis-ordenes" className="btn btn-primary btn-lg">Ver mis pedidos</Link>
          <Link to="/" className="btn btn-ghost">Ir al inicio</Link>
        </div>
      </div>
    </div>
  );
}
