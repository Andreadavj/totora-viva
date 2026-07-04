// frontend/src/pages/MyOrders.jsx
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { formatCLP, formatDate, orderStatusLabel, orderStatusColor, paymentStatusLabel, productPlaceholder } from '../utils/helpers';
import styles from './MyOrders.module.css';

export default function MyOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState(null);

  useEffect(() => {
    api.get('/orders')
      .then(({ data }) => setOrders(data.orders))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <div className="loading-page" style={{ paddingTop: 'var(--header-height)' }}><div className="spinner" /></div>;
  }

  return (
    <div className={styles.page}>
      <div className="container">
        <h1 className={styles.title}>Mis pedidos</h1>
        <p className={styles.subtitle}>Revisa el estado de tus compras en Totora Viva.</p>

        {orders.length === 0 ? (
          <div className={styles.empty}>
            <div className={styles.emptyIcon}>📦</div>
            <h3>Aún no tienes pedidos</h3>
            <p>Cuando realices una compra, aparecerá aquí.</p>
            <Link to="/productos" className="btn btn-primary">Ver productos</Link>
          </div>
        ) : (
          <div className={styles.list}>
            {orders.map((order) => (
              <div key={order.id} className={styles.order}>
                <div className={styles.orderHeader} onClick={() => setExpanded(expanded === order.id ? null : order.id)}>
                  <div>
                    <span className={styles.orderNumber}>{order.orderNumber}</span>
                    <span className={styles.orderDate}>{formatDate(order.createdAt)}</span>
                  </div>
                  <div className={styles.orderMeta}>
                    <span className={styles.statusBadge} style={{ background: `${orderStatusColor(order.status)}1A`, color: orderStatusColor(order.status) }}>
                      {orderStatusLabel(order.status)}
                    </span>
                    <span className={styles.orderTotal}>{formatCLP(order.total)}</span>
                    <svg
                      width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
                      className={`${styles.chevron} ${expanded === order.id ? styles.chevronOpen : ''}`}
                    >
                      <path d="m6 9 6 6 6-6"/>
                    </svg>
                  </div>
                </div>

                {expanded === order.id && (
                  <div className={`${styles.orderDetails} animate-fade-in`}>
                    <div className={styles.detailsGrid}>
                      <div>
                        <h4>Productos</h4>
                        {order.orderItems.map((item) => {
                          const image = item.product?.images?.[0] || productPlaceholder();
                          return (
                            <div key={item.id} className={styles.detailItem}>
                              <img src={image} alt={item.productName} onError={(e) => { e.target.src = productPlaceholder(); }} />
                              <div className={styles.detailItemInfo}>
                                <span className={styles.detailItemName}>{item.productName}</span>
                                <span className={styles.detailItemSpecs}>
                                  {item.width && item.height && `${item.width}m × ${item.height}m · `}
                                  {item.weaveType && `${item.weaveType === 'fine' ? 'Tejido fino' : 'Tejido grueso'} · `}
                                  Cantidad: {item.quantity}
                                </span>
                              </div>
                              <span className={styles.detailItemPrice}>{formatCLP(item.totalPrice)}</span>
                            </div>
                          );
                        })}
                      </div>

                      <div>
                        <h4>Dirección de envío</h4>
                        <p className={styles.address}>
                          {order.shippingAddress?.firstName} {order.shippingAddress?.lastName}<br />
                          {order.shippingAddress?.address}<br />
                          {order.shippingAddress?.city}, {order.shippingAddress?.region}<br />
                          {order.shippingAddress?.phone}
                        </p>

                        <h4 style={{ marginTop: '1rem' }}>Pago</h4>
                        <p className={styles.address}>
                          Estado: {paymentStatusLabel(order.paymentStatus)}<br />
                          {order.payment?.cardLastFour && `Tarjeta: **** ${order.payment.cardLastFour}`}
                        </p>
                      </div>
                    </div>

                    <div className={styles.totalRow}>
                      <span>Total del pedido</span>
                      <strong>{formatCLP(order.total)}</strong>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
