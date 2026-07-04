// frontend/src/pages/admin/AdminOrders.jsx
import { useEffect, useState } from 'react';
import api from '../../services/api';
import { useToast } from '../../context/ToastContext';
import { formatCLP, formatDate, orderStatusLabel, orderStatusColor, paymentStatusLabel } from '../../utils/helpers';
import styles from './AdminOrders.module.css';

const STATUS_OPTIONS = ['PENDING', 'CONFIRMED', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED'];

export default function AdminOrders() {
  const toast = useToast();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('');
  const [expanded, setExpanded] = useState(null);

  const fetchOrders = () => {
    setLoading(true);
    const params = filter ? `?status=${filter}` : '';
    api.get(`/admin/orders${params}`)
      .then(({ data }) => setOrders(data.orders))
      .catch(() => toast.error('No se pudieron cargar las órdenes.'))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchOrders();
  }, [filter]);

  const handleStatusChange = async (orderId, status) => {
    try {
      await api.patch(`/admin/orders/${orderId}/status`, { status });
      toast.success('Estado actualizado.');
      setOrders((prev) => prev.map((o) => (o.id === orderId ? { ...o, status } : o)));
    } catch {
      toast.error('No se pudo actualizar el estado.');
    }
  };

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <div>
          <h1>Órdenes</h1>
          <p>Gestiona el estado de los pedidos de tus clientes.</p>
        </div>
      </div>

      <div className={styles.filters}>
        <button className={`${styles.chip} ${!filter ? styles.chipActive : ''}`} onClick={() => setFilter('')}>Todas</button>
        {STATUS_OPTIONS.map((s) => (
          <button key={s} className={`${styles.chip} ${filter === s ? styles.chipActive : ''}`} onClick={() => setFilter(s)}>
            {orderStatusLabel(s)}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="loading-page"><div className="spinner" /></div>
      ) : orders.length === 0 ? (
        <p className={styles.empty}>No hay órdenes con este filtro.</p>
      ) : (
        <div className={styles.list}>
          {orders.map((order) => (
            <div key={order.id} className={styles.order}>
              <div className={styles.orderHeader} onClick={() => setExpanded(expanded === order.id ? null : order.id)}>
                <div className={styles.orderMain}>
                  <span className={styles.orderNumber}>{order.orderNumber}</span>
                  <span className={styles.customer}>{order.user?.firstName} {order.user?.lastName} · {order.user?.email}</span>
                </div>
                <span className={styles.date}>{formatDate(order.createdAt)}</span>
                <span className={styles.payment}>{paymentStatusLabel(order.paymentStatus)}</span>
                <span className={styles.total}>{formatCLP(order.total)}</span>
              </div>

              {expanded === order.id && (
                <div className={`${styles.details} animate-fade-in`}>
                  <div className={styles.itemsList}>
                    {order.orderItems.map((item) => (
                      <div key={item.id} className={styles.itemRow}>
                        <span>{item.productName}</span>
                        <span className={styles.itemMeta}>
                          {item.width && item.height && `${item.width}m × ${item.height}m · `}
                          {item.weaveType && `${item.weaveType === 'fine' ? 'Fino' : 'Grueso'} · `}
                          x{item.quantity}
                        </span>
                        <span>{formatCLP(item.totalPrice)}</span>
                      </div>
                    ))}
                  </div>

                  <div className={styles.statusControl}>
                    <label className="form-label">Estado del pedido</label>
                    <select
                      className="form-input form-select"
                      value={order.status}
                      onChange={(e) => handleStatusChange(order.id, e.target.value)}
                      style={{ maxWidth: 220 }}
                    >
                      {STATUS_OPTIONS.map((s) => (
                        <option key={s} value={s}>{orderStatusLabel(s)}</option>
                      ))}
                    </select>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
