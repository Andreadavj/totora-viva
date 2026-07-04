// frontend/src/pages/Login.jsx
import { useState, type FormEvent } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import styles from './Auth.module.css';

type LoginForm = {
  email: string;
  password: string;
};

type LoginErrors = {
  email?: string;
  password?: string;
};

export default function Login() {
  const { login } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  const [form, setForm] = useState<LoginForm>({ email: '', password: '' });
  const [errors, setErrors] = useState<LoginErrors>({});
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const errs = {};
    if (!form.email.trim()) errs.email = 'El correo es obligatorio.';
    else if (!/\S+@\S+\.\S+/.test(form.email)) errs.email = 'Correo inválido.';
    if (!form.password) errs.password = 'La contraseña es obligatoria.';
    return errs;
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) {
      setErrors(errs);
      return;
    }
    setErrors({});
    setLoading(true);
    try {
      await login(form.email, form.password);
      toast.success('¡Bienvenido de vuelta! 🌿');
      const redirectTo = location.state?.from || '/';
      navigate(redirectTo);
    } catch (err) {
      toast.error(err.response?.data?.error || 'Credenciales incorrectas.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.page}>
      <div className={styles.imageSide}>
        <img src="https://placehold.co/900x1200/2D5A3D/E8F2EB?text=Totora+Viva" alt="Totora Viva" />
        <div className={styles.imageOverlay}>
          <div className={styles.imageQuote}>
            <p>"Cada hebra de totora cuenta una historia de respeto por la tierra."</p>
            <span>— Familia Totora Viva, Quilicura</span>
          </div>
        </div>
      </div>

      <div className={styles.formSide}>
        <div className={styles.formWrap}>
          <Link to="/" className={styles.logoLink}>🌿 Totora Viva</Link>
          <h1 className={styles.title}>Bienvenido de vuelta</h1>
          <p className={styles.subtitle}>Ingresa a tu cuenta para continuar con tu compra.</p>

          <form onSubmit={handleSubmit} className={styles.form}>
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
              <label className="form-label">Contraseña</label>
              <input
                type="password"
                className={`form-input ${errors.password ? 'error' : ''}`}
                placeholder="••••••••"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
              />
              {errors.password && <span className="form-error">{errors.password}</span>}
            </div>

            <button type="submit" className="btn btn-primary btn-lg" disabled={loading} style={{ width: '100%' }}>
              {loading ? 'Ingresando…' : 'Iniciar sesión'}
            </button>
          </form>

          <p className={styles.switchText}>
            ¿No tienes cuenta? <Link to="/register">Crear una cuenta</Link>
          </p>

          <div className={styles.demoBox}>
            <p className={styles.demoTitle}>Cuenta de prueba</p>
            <p className={styles.demoText}>cliente@ejemplo.cl / Cliente2024!</p>
          </div>
        </div>
      </div>
    </div>
  );
}
