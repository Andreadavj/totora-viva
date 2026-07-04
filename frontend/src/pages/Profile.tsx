// frontend/src/pages/Profile.jsx
import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import api from '../services/api';
import styles from './Profile.module.css';

const REGIONES_CHILE = [
  'Arica y Parinacota', 'Tarapacá', 'Antofagasta', 'Atacama', 'Coquimbo',
  'Valparaíso', 'Región Metropolitana', "O'Higgins", 'Maule', 'Ñuble',
  'Biobío', 'La Araucanía', 'Los Ríos', 'Los Lagos', 'Aysén', 'Magallanes',
];

export default function Profile() {
  const { user, loading: authLoading } = useAuth();
  const toast = useToast();

  const [form, setForm] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    phone: user?.phone || '',
    address: user?.address || '',
    city: user?.city || '',
    region: user?.region || 'Región Metropolitana',
  });
  const [saving, setSaving] = useState(false);

  if (authLoading) {
    return <div className="loading-page" style={{ paddingTop: 'var(--header-height)' }}><div className="spinner" /></div>;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await api.put('/auth/profile', form);
      toast.success('Perfil actualizado correctamente.');
    } catch (err) {
      toast.error(err.response?.data?.error || 'No se pudo actualizar el perfil.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className={styles.page}>
      <div className="container">
        <h1 className={styles.title}>Mi perfil</h1>
        <p className={styles.subtitle}>Actualiza tus datos personales y de contacto.</p>

        <div className={styles.grid}>
          <div className={styles.card}>
            <div className={styles.avatarSection}>
              <div className={styles.avatar}>
                {user?.firstName?.[0]}{user?.lastName?.[0]}
              </div>
              <div>
                <h3>{user?.firstName} {user?.lastName}</h3>
                <p className={styles.email}>{user?.email}</p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className={styles.form}>
              <div className={styles.row}>
                <div className="form-group">
                  <label className="form-label">Nombre</label>
                  <input className="form-input" value={form.firstName} onChange={(e) => setForm({ ...form, firstName: e.target.value })} />
                </div>
                <div className="form-group">
                  <label className="form-label">Apellido</label>
                  <input className="form-input" value={form.lastName} onChange={(e) => setForm({ ...form, lastName: e.target.value })} />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Teléfono</label>
                <input className="form-input" placeholder="+56 9 1234 5678" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
              </div>

              <div className="form-group">
                <label className="form-label">Dirección</label>
                <input className="form-input" placeholder="Calle, número, depto/casa" value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} />
              </div>

              <div className={styles.row}>
                <div className="form-group">
                  <label className="form-label">Comuna / Ciudad</label>
                  <input className="form-input" value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} />
                </div>
                <div className="form-group">
                  <label className="form-label">Región</label>
                  <select className="form-input form-select" value={form.region} onChange={(e) => setForm({ ...form, region: e.target.value })}>
                    {REGIONES_CHILE.map((r) => <option key={r} value={r}>{r}</option>)}
                  </select>
                </div>
              </div>

              <button type="submit" className="btn btn-primary btn-lg" disabled={saving}>
                {saving ? 'Guardando…' : 'Guardar cambios'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
