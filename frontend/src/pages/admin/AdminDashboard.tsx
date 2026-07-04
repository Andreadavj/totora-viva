// frontend/src/pages/admin/AdminDashboard.jsx
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import { formatCLP, formatDate, orderStatusLabel, orderStatusColor } from '../../utils/helpers';
import styles from './AdminDashboard.module.css';

export default function AdminDashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/admin/stats')
      .then(({ data }) => setData(data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <div className="loading-page"><div className="spinner" /></div>;
  }

  const stats = data?.stats || {};

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <div>
          <h1>Panel de administración</h1>
          <p>Resumen general de Totora Viva</p>
        </div>
        <div className={styles.headerActions}>
          <Link to="/admin/productos" className="btn btn-secondary btn-sm">Gestionar productos</Link>
          <Link to="/admin/ordenes" className="btn btn-primary btn-sm">Ver órdenes</Link>
        </div>
      </div>

      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <span className={styles.statIcon}>💰</span>
          <div>
            <span className={styles.statValue}>{formatCLP(stats.totalRevenue || 0)}</span>
            <span className={styles.statLabel}>Ingresos totales (pagos aprobados)</span>
          </div>
        </div>
        <div className={styles.statCard}>
          <span className={styles.statIcon}>📦</span>
          <div>
            <span className={styles.statValue}>{stats.totalOrders || 0}</span>
            <span className={styles.statLabel}>Órdenes totales</span>
          </div>
        </div>
        <div className={styles.statCard}>
          <span className={styles.statIcon}>👥</span>
          <div>
            <span className={styles.statValue}>{stats.totalUsers || 0}</span>
            <span className={styles.statLabel}>Clientes registrados</span>
          </div>
        </div>
        <div className={styles.statCard}>
          <span className={styles.statIcon}>🌿</span>
          <div>
            <span className={styles.statValue}>{stats.totalProducts || 0}</span>
            <span className={styles.statLabel}>Productos activos</span>
          </div>
        </div>
      </div>

      <div className={styles.section}>
        <h2>Órdenes recientes</h2>
        {data?.recentOrders?.length === 0 ? (
          <p className={styles.empty}>Aún no hay órdenes registradas.</p>
        ) : (
          <div className={styles.table}>
            <div className={styles.tableHeader}>
              <span>Orden</span>
              <span>Cliente</span>
              <span>Fecha</span>
              <span>Estado</span>
              <span>Total</span>
            </div>
            {data?.recentOrders?.map((order) => (
              <div key={order.id} className={styles.tableRow}>
                <span className={styles.orderNumber}>{order.orderNumber}</span>
                <span>{order.user?.firstName} {order.user?.lastName}</span>
                <span>{formatDate(order.createdAt)}</span>
                <span>
                  <span className={styles.statusBadge} style={{ background: `${orderStatusColor(order.status)}1A`, color: orderStatusColor(order.status) }}>
                    {orderStatusLabel(order.status)}
                  </span>
                </span>
                <span className={styles.total}>{formatCLP(order.total)}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
