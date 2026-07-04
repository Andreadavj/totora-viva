// frontend/src/pages/WebpayRedirect.jsx
// Esta página simula el formulario de pago de Webpay (Transbank) para entornos de desarrollo.
// En producción, este paso real es manejado por la pasarela de Transbank.
import { useState } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { formatCLP } from '../utils/helpers';
import styles from './WebpayRedirect.module.css';

export default function WebpayRedirect() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [processing, setProcessing] = useState(false);

  const token = searchParams.get('token');
  const amount = Number(searchParams.get('amount') || 0);
  const buyOrder = searchParams.get('buy_order');

  const [card, setCard] = useState('4051 8856 0044 6623');
  const [cvv, setCvv] = useState('123');
  const [expiry, setExpiry] = useState('12/28');
  const [rut, setRut] = useState('11.111.111-1');

  const handlePay = () => {
    setProcessing(true);
    setTimeout(() => {
      navigate(`/checkout/confirmar?token_ws=${token}`);
    }, 1500);
  };

  const handleCancel = () => {
    navigate(`/checkout/confirmar?TBK_TOKEN=${token}`);
  };

  return (
    <div className={styles.page}>
      <div className={styles.card}>
        <div className={styles.header}>
          <div className={styles.logoBox}>WebPay <span>Plus</span></div>
          <span className={styles.envBadge}>Entorno de integración</span>
        </div>

        <div className={styles.amountBox}>
          <span>Monto a pagar</span>
          <strong>{formatCLP(amount)}</strong>
          <small>Orden: {buyOrder}</small>
        </div>

        {processing ? (
          <div className={styles.processing}>
            <div className="spinner" style={{ width: 36, height: 36 }} />
            <p>Procesando tu pago…</p>
          </div>
        ) : (
          <>
            <div className="form-group">
              <label className="form-label">Número de tarjeta</label>
              <input className="form-input" value={card} onChange={(e) => setCard(e.target.value)} />
            </div>
            <div className={styles.row}>
              <div className="form-group">
                <label className="form-label">Vencimiento</label>
                <input className="form-input" value={expiry} onChange={(e) => setExpiry(e.target.value)} />
              </div>
              <div className="form-group">
                <label className="form-label">CVV</label>
                <input className="form-input" value={cvv} onChange={(e) => setCvv(e.target.value)} />
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">RUT</label>
              <input className="form-input" value={rut} onChange={(e) => setRut(e.target.value)} />
            </div>

            <button className="btn btn-primary btn-lg" style={{ width: '100%' }} onClick={handlePay}>
              Pagar {formatCLP(amount)}
            </button>
            <button className={styles.cancelBtn} onClick={handleCancel}>Cancelar compra</button>
          </>
        )}

        <p className={styles.footer}>
          Esta es una simulación de Webpay (Transbank) para fines de demostración.
        </p>
      </div>
    </div>
  );
}
