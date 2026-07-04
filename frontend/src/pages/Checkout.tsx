// frontend/src/pages/Checkout.jsx
import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import api from '../services/api';
import { formatCLP, formatDimensions, weaveTypeLabel, productPlaceholder } from '../utils/helpers';
import styles from './Checkout.module.css';

const REGIONES_CHILE = [
  'Arica y Parinacota', 'Tarapacá', 'Antofagasta', 'Atacama', 'Coquimbo',
  'Valparaíso', 'Región Metropolitana', "O'Higgins", 'Maule', 'Ñuble',
  'Biobío', 'La Araucanía', 'Los Ríos', 'Los Lagos', 'Aysén', 'Magallanes',
];

export default function Checkout() {
  const { cart, loading: cartLoading } = useCart();
  const { user } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();

  const [step, setStep] = useState<1 | 2 | 3>(1); // 1: datos, 2: resumen, 3: pago
  const [submitting, setSubmitting] = useState(false);

  const [form, setForm] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    email: user?.email || '',
    phone: user?.phone || '',
    address: '',
    city: '',
    region: 'Región Metropolitana',
    notes: '',
  } as {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    region: string;
    notes: string;
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (!cartLoading && cart.items.length === 0) {
      navigate('/carrito');
    }
  }, [cart, cartLoading, navigate]);

  const validate = () => {
    const errs = {};
    ['firstName', 'lastName', 'email', 'phone', 'address', 'city'].forEach((field) => {
      if (!form[field]?.trim()) errs[field] = 'Campo obligatorio.';
    });
    if (form.email && !/\S+@\S+\.\S+/.test(form.email)) errs.email = 'Correo inválido.';
    return errs;
  };

  const handleContinue = () => {
    const errs = validate();
    if (Object.keys(errs).length) {
      setErrors(errs);
      toast.error('Por favor completa todos los campos requeridos.');
      return;
    }
    setErrors({});
    setStep(2);
  };

  const handlePayment = async () => {
    setSubmitting(true);
    try {
      // 1. Crear la orden
      const { data: orderData } = await api.post('/orders', {
        shippingAddress: {
          firstName: form.firstName,
          lastName: form.lastName,
          email: form.email,
          phone: form.phone,
          address: form.address,
          city: form.city,
          region: form.region,
        },
        notes: form.notes,
      });

      const orderId = orderData.order.id;

      // 2. Iniciar transacción Webpay
      const { data: webpayData } = await api.post('/payments/webpay/init', { orderId });

      // Guardar info de la orden para la página de confirmación
      sessionStorage.setItem('tv_last_order', orderData.order.orderNumber);
      sessionStorage.setItem('tv_webpay_token', webpayData.token);

      // 3. Redirigir a Webpay (simulado)
      window.location.href = webpayData.url;
    } catch (err) {
      toast.error(err.response?.data?.error || 'No se pudo procesar el pago.');
      setSubmitting(false);
    }
  };

  if (cartLoading) {
    return <div className="loading-page" style={{ paddingTop: 'var(--header-height)' }}><div className="spinner" /></div>;
  }

  return (
    <div className={styles.page}>
      <div className="container">
        {/* Steps indicator */}
        <div className={styles.steps}>
          <div className={`${styles.step} ${step >= 1 ? styles.stepActive : ''}`}>
            <span className={styles.stepNum}>1</span>
            <span>Datos de envío</span>
          </div>
          <div className={styles.stepLine} />
          <div className={`${styles.step} ${step >= 2 ? styles.stepActive : ''}`}>
            <span className={styles.stepNum}>2</span>
            <span>Resumen</span>
          </div>
          <div className={styles.stepLine} />
          <div className={`${styles.step} ${step >= 3 ? styles.stepActive : ''}`}>
            <span className={styles.stepNum}>3</span>
            <span>Pago</span>
          </div>
        </div>

        <div className={styles.grid}>
          <div className={styles.main}>
            {step === 1 && (
              <div className={`${styles.card} animate-fade-in`}>
                <h2 className={styles.cardTitle}>Datos de envío</h2>

                <div className={styles.formRow}>
                  <div className="form-group">
                    <label className="form-label">Nombre</label>
                    <input className={`form-input ${errors.firstName ? 'error' : ''}`} value={form.firstName} onChange={(e) => setForm({ ...form, firstName: e.target.value })} />
                    {errors.firstName && <span className="form-error">{errors.firstName}</span>}
                  </div>
                  <div className="form-group">
                    <label className="form-label">Apellido</label>
                    <input className={`form-input ${errors.lastName ? 'error' : ''}`} value={form.lastName} onChange={(e) => setForm({ ...form, lastName: e.target.value })} />
                    {errors.lastName && <span className="form-error">{errors.lastName}</span>}
                  </div>
                </div>

                <div className={styles.formRow}>
                  <div className="form-group">
                    <label className="form-label">Correo electrónico</label>
                    <input type="email" className={`form-input ${errors.email ? 'error' : ''}`} value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
                    {errors.email && <span className="form-error">{errors.email}</span>}
                  </div>
                  <div className="form-group">
                    <label className="form-label">Teléfono</label>
                    <input type="tel" className={`form-input ${errors.phone ? 'error' : ''}`} placeholder="+56 9 1234 5678" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
                    {errors.phone && <span className="form-error">{errors.phone}</span>}
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Dirección</label>
                  <input className={`form-input ${errors.address ? 'error' : ''}`} placeholder="Calle, número, depto/casa" value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} />
                  {errors.address && <span className="form-error">{errors.address}</span>}
                </div>

                <div className={styles.formRow}>
                  <div className="form-group">
                    <label className="form-label">Comuna / Ciudad</label>
                    <input className={`form-input ${errors.city ? 'error' : ''}`} value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} />
                    {errors.city && <span className="form-error">{errors.city}</span>}
                  </div>
                  <div className="form-group">
                    <label className="form-label">Región</label>
                    <select className="form-input form-select" value={form.region} onChange={(e) => setForm({ ...form, region: e.target.value })}>
                      {REGIONES_CHILE.map((r) => <option key={r} value={r}>{r}</option>)}
                    </select>
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Notas adicionales (opcional)</label>
                  <textarea
                    className="form-input"
                    rows={3}
                    placeholder="Ej: instrucciones de acceso, horario preferido de despacho, etc."
                    value={form.notes}
                    onChange={(e) => setForm({ ...form, notes: e.target.value })}
                    style={{ resize: 'vertical' }}
                  />
                </div>

                <button className="btn btn-primary btn-lg" style={{ width: '100%' }} onClick={handleContinue}>
                  Continuar al resumen
                </button>
              </div>
            )}

            {step === 2 && (
              <div className={`${styles.card} animate-fade-in`}>
                <h2 className={styles.cardTitle}>Resumen de tu pedido</h2>

                <div className={styles.shippingPreview}>
                  <h4>Enviar a</h4>
                  <p>{form.firstName} {form.lastName}</p>
                  <p>{form.address}, {form.city}, {form.region}</p>
                  <p>{form.email} · {form.phone}</p>
                  <button className={styles.editBtn} onClick={() => setStep(1)}>Editar</button>
                </div>

                <div className={styles.orderItems}>
                  {cart.items.map((item) => {
                    const dimensions = formatDimensions(item.width, item.height);
                    const image = item.product.images?.[0] || productPlaceholder(item.product.category?.slug);
                    return (
                      <div key={item.id} className={styles.orderItem}>
                        <img src={image} alt={item.product.name} className={styles.orderItemImg} onError={(e) => { e.target.src = productPlaceholder(item.product.category?.slug); }} />
                        <div className={styles.orderItemInfo}>
                          <span className={styles.orderItemName}>{item.product.name}</span>
                          <span className={styles.orderItemSpecs}>
                            {dimensions && `${dimensions} · `}
                            {item.weaveType && `${weaveTypeLabel(item.weaveType)} · `}
                            Cantidad: {item.quantity}
                          </span>
                        </div>
                        <span className={styles.orderItemPrice}>{formatCLP(item.totalPrice * item.quantity)}</span>
                      </div>
                    );
                  })}
                </div>

                <button className="btn btn-primary btn-lg" style={{ width: '100%' }} onClick={() => setStep(3)}>
                  Continuar al pago
                </button>
              </div>
            )}

            {step === 3 && (
              <div className={`${styles.card} animate-fade-in`}>
                <h2 className={styles.cardTitle}>Pago con Webpay</h2>

                <div className={styles.webpayBox}>
                  <img
                    src="https://placehold.co/180x50/F2EBD9/4A2E12?text=WebPay"
                    alt="Webpay"
                    className={styles.webpayLogo}
                  />
                  <p>
                    Serás redirigido al portal seguro de Webpay (Transbank) para completar
                    tu pago. Una vez confirmado, volverás automáticamente a Totora Viva.
                  </p>

                  <div className={styles.webpayInfo}>
                    <div className={styles.webpayRow}>
                      <span>Total a pagar</span>
                      <strong>{formatCLP(cart.subtotal)}</strong>
                    </div>
                  </div>

                  <div className={styles.testCardInfo}>
                    <strong>Entorno de prueba (integración):</strong>
                    <p>Tarjeta: 4051 8856 0044 6623 · CVV: 123 · Cualquier fecha futura</p>
                  </div>

                  <button
                    className="btn btn-primary btn-lg"
                    style={{ width: '100%' }}
                    onClick={handlePayment}
                    disabled={submitting}
                  >
                    {submitting ? 'Conectando con Webpay…' : `Pagar ${formatCLP(cart.subtotal)} con Webpay`}
                  </button>
                  <button className={styles.backBtn} onClick={() => setStep(2)}>← Volver al resumen</button>
                </div>
              </div>
            )}
          </div>

          {/* Resumen lateral */}
          <aside className={styles.summary}>
            <h3>Tu pedido</h3>
            <div className={styles.summaryItems}>
              {cart.items.map((item) => (
                <div key={item.id} className={styles.summaryItem}>
                  <span className={styles.summaryItemQty}>{item.quantity}×</span>
                  <span className={styles.summaryItemName}>{item.product.name}</span>
                  <span>{formatCLP(item.totalPrice * item.quantity)}</span>
                </div>
              ))}
            </div>
            <div className={styles.summaryDivider} />
            <div className={styles.summaryRow}>
              <span>Subtotal</span>
              <span>{formatCLP(cart.subtotal)}</span>
            </div>
            <div className={styles.summaryRow}>
              <span>Envío</span>
              <span className={styles.shippingNote}>A coordinar</span>
            </div>
            <div className={styles.summaryDivider} />
            <div className={`${styles.summaryRow} ${styles.summaryTotal}`}>
              <span>Total</span>
              <span>{formatCLP(cart.subtotal)}</span>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
