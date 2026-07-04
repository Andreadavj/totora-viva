// frontend/src/pages/NotFound.jsx
import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '0.75rem',
      textAlign: 'center',
      padding: '0 1.5rem',
    }}>
      <span style={{ fontSize: '3rem' }}>🌿</span>
      <h1 style={{ fontSize: '2.5rem' }}>404</h1>
      <p style={{ color: 'var(--text-muted)', marginBottom: '0.5rem' }}>
        Esta página se perdió entre los humedales.
      </p>
      <Link to="/" className="btn btn-primary btn-lg">Volver al inicio</Link>
    </div>
  );
}
