// frontend/src/pages/admin/AdminLayout.jsx
import { NavLink, Outlet, Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import styles from './AdminLayout.module.css';

export default function AdminLayout() {
  const { user, isAdmin, loading } = useAuth();

  if (loading) {
    return <div className="loading-page" style={{ paddingTop: 'var(--header-height)' }}><div className="spinner" /></div>;
  }

  if (!user || !isAdmin) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className={styles.layout}>
      <aside className={styles.sidebar}>
        <div className={styles.sidebarTitle}>🌿 Panel Admin</div>
        <nav className={styles.nav}>
          <NavLink to="/admin" end className={({ isActive }) => `${styles.navLink} ${isActive ? styles.active : ''}`}>
            Resumen
          </NavLink>
          <NavLink to="/admin/productos" className={({ isActive }) => `${styles.navLink} ${isActive ? styles.active : ''}`}>
            Productos
          </NavLink>
          <NavLink to="/admin/ordenes" className={({ isActive }) => `${styles.navLink} ${isActive ? styles.active : ''}`}>
            Órdenes
          </NavLink>
        </nav>
        <NavLink to="/" className={styles.backLink}>← Volver a la tienda</NavLink>
      </aside>

      <main className={styles.main}>
        <div className="container">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
