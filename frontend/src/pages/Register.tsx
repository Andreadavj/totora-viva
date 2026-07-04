// frontend/src/pages/Register.jsx
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import styles from './Auth.module.css';

export default function Register() {
  const { register } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    firstName: '', lastName: '', email: '', phone: '', password: '', confirmPassword: '',
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const errs = {};
    if (!form.firstName.trim()) errs.firstName = 'Ingresa tu nombre.';
    if (!form.lastName.trim()) errs.lastName = 'Ingresa tu apellido.';
    if (!form.email.trim()) errs.email = 'El correo es obligatorio.';
    else if (!/\S+@\S+\.\S+/.test(form.email)) errs.email = 'Correo inválido.';
    if (!form.password) errs.password = 'La contraseña es obligatoria.';
    else if (form.password.length < 8) errs.password = 'Mínimo 8 caracteres.';
    if (form.password !== form.confirmPassword) errs.confirmPassword = 'Las contraseñas no coinciden.';
    return errs;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) {
      setErrors(errs);
      return;
    }
    setErrors({});
    setLoading(true);
    try {
      const { confirmPassword, ...data } = form;
      await register(data);
      toast.success('¡Cuenta creada con éxito! Bienvenido 🌿');
      navigate('/');
    } catch (err) {
      toast.error(err.response?.data?.error || 'No se pudo crear la cuenta.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.page}>
      <div className={styles.imageSide}>
        <img src="https://placehold.co/900x1200/C4A055/4A2E12?text=Totora+Viva" alt="Totora Viva" />
        <div className={styles.imageOverlay}>
          <div className={styles.imageQuote}>
            <p>"Más de 40 años cosechando con respeto y tejiendo con tradición."</p>
            <span>— Familia Totora Viva, Quilicura</span>
          </div>
        </div>
      </div>

      <div className={styles.formSide}>
        <div className={styles.formWrap}>
          <Link to="/" className={styles.logoLink}>🌿 Totora Viva</Link>
          <h1 className={styles.title}>Crea tu cuenta</h1>
          <p className={styles.subtitle}>Regístrate para cotizar y comprar tus productos a medida.</p>

          <form onSubmit={handleSubmit} className={styles.form}>
            <div className={styles.row}>
              <div className="form-group">
                <label className="form-label">Nombre</label>
                <input
                  className={`form-input ${errors.firstName ? 'error' : ''}`}
                  placeholder="María"
                  value={form.firstName}
                  onChange={(e) => setForm({ ...form, firstName: e.target.value })}
                />
                {errors.firstName && <span className="form-error">{errors.firstName}</span>}
              </div>
              <div className="form-group">
                <label className="form-label">Apellido</label>
                <input
                  className={`form-input ${errors.lastName ? 'error' : ''}`}
                  placeholder="González"
                  value={form.lastName}
                  onChange={(e) => setForm({ ...form, lastName: e.target.value })}
                />
                {errors.lastName && <span className="form-error">{errors.lastName}</span>}
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Correo electrónico</label>
              <input
                type="email"
                className={`form-input ${errors.email ? 'error' : ''}`}
                placeholder="tu@correo.cl"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
              />
              {errors.email && <span className="form-error">{errors.email}</span>}
            </div>

            <div className="form-group">
              <label className="form-label">Teléfono (opcional)</label>
              <input
                type="tel"
                className="form-input"
                placeholder="+56 9 1234 5678"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
              />
            </div>

            <div className={styles.row}>
              <div className="form-group">
                <label className="form-label">Contraseña</label>
                <input
                  type="password"
                  className={`form-input ${errors.password ? 'error' : ''}`}
                  placeholder="Mínimo 8 caracteres"
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                />
                {errors.password && <span className="form-error">{errors.password}</span>}
              </div>
              <div className="form-group">
                <label className="form-label">Confirmar contraseña</label>
                <input
                  type="password"
                  className={`form-input ${errors.confirmPassword ? 'error' : ''}`}
                  placeholder="••••••••"
                  value={form.confirmPassword}
                  onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
                />
                {errors.confirmPassword && <span className="form-error">{errors.confirmPassword}</span>}
              </div>
            </div>

            <button type="submit" className="btn btn-primary btn-lg" disabled={loading} style={{ width: '100%' }}>
              {loading ? 'Creando cuenta…' : 'Crear cuenta'}
            </button>
          </form>

          <p className={styles.switchText}>
            ¿Ya tienes cuenta? <Link to="/login">Iniciar sesión</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
