// frontend/src/pages/Home.jsx
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import ProductCard from '../components/products/ProductCard';
import styles from './Home.module.css';

export default function Home() {
  const [featured, setFeatured] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/products?featured=true&limit=4')
      .then(({ data }) => setFeatured(data.products))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <>
      {/* HERO */}
      <section className={styles.hero}>
        <div className={styles.heroBg}>
          <img
            src="https://placehold.co/1920x1080/2D5A3D/E8F2EB?text=Humedales+de+Quilicura"
            alt="Humedales de Quilicura donde crece la totora"
            className={styles.heroImage}
          />
          <div className={styles.heroOverlay} />
        </div>
        <div className={`container ${styles.heroContent}`}>
          <span className={`badge badge-straw ${styles.heroBadge} animate-fade-in`}>
            Quilicura · Chile · Desde hace más de 40 años
          </span>
          <h1 className={`${styles.heroTitle} animate-fade-in`}>
            La fibra que <em>nace del agua</em> y se convierte en hogar
          </h1>
          <p className={`${styles.heroSubtitle} animate-fade-in`}>
            Somos una empresa familiar dedicada a la protección de los humedales
            y al uso responsable de la fibra natural de totora. Cada pieza es
            cosechada de forma sostenible y tejida a mano por artesanos.
          </p>
          <div className={`${styles.heroActions} animate-fade-in`}>
            <Link to="/productos" className="btn btn-primary btn-lg">
              Explorar productos
            </Link>
            <Link to="/nosotros" className={`btn btn-lg ${styles.heroSecondaryBtn}`}>
              Conoce nuestra historia
            </Link>
          </div>
        </div>
        <div className={styles.scrollHint}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="m6 9 6 6 6-6"/>
          </svg>
        </div>
      </section>

      {/* VALORES */}
      <section className="section">
        <div className="container">
          <div className={styles.valuesGrid}>
            <div className={`${styles.valueCard} animate-fade-in`}>
              <div className={styles.valueIcon}>🌾</div>
              <h3>Cosecha sostenible</h3>
              <p>Cada verano realizamos podas controladas que respetan el ciclo natural del humedal y permiten que la totora se regenere año tras año.</p>
            </div>
            <div className={`${styles.valueCard} animate-fade-in`}>
              <div className={styles.valueIcon}>✋</div>
              <h3>Hecho a mano</h3>
              <p>Cada cortina, estera y tejido es elaborado por artesanos que han heredado esta técnica de generación en generación.</p>
            </div>
            <div className={`${styles.valueCard} animate-fade-in`}>
              <div className={styles.valueIcon}>🌎</div>
              <h3>100% natural</h3>
              <p>Sin plásticos, sin químicos. Solo fibra vegetal renovable que aísla, decora y dura entre 15 y 20 años.</p>
            </div>
          </div>
        </div>
      </section>

      {/* HISTORIA PREVIEW */}
      <section className={`section ${styles.storySection}`}>
        <div className={`container ${styles.storyGrid}`}>
          <div className={styles.storyImageWrap}>
            <img
              src="https://placehold.co/700x800/C4A055/4A2E12?text=Cosecha+de+Totora"
              alt="Cosecha artesanal de totora en los humedales"
              className={styles.storyImage}
            />
            <div className={styles.storyImageAccent} />
          </div>
          <div className={styles.storyContent}>
            <span className="badge badge-green">Nuestra historia</span>
            <h2 className={styles.storyTitle}>
              De los humedales de Quilicura, directo a tu hogar
            </h2>
            <p className={styles.storyText}>
              Somos una empresa familiar dedicada a la protección de los humedales
              y el uso responsable de la fibra natural de la totora. Cada verano
              cosechamos la totora mediante procesos sostenibles —poda controlada—
              lo que permite mantener el equilibrio del ecosistema.
            </p>
            <p className={styles.storyText}>
              Luego la materia prima se almacena en galpones y se utiliza durante
              todo el año para fabricar productos artesanales como cortinas,
              esteras, cestería y textiles ecológicos.
            </p>
            <Link to="/nosotros" className="btn btn-secondary">
              Leer historia completa
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M5 12h14M12 5l7 7-7 7"/>
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* PRODUCTOS DESTACADOS */}
      <section className="section">
        <div className="container">
          <div className="section-header" style={{ textAlign: 'center', maxWidth: 600, margin: '0 auto var(--space-3xl)' }}>
            <span className="badge badge-straw">Catálogo</span>
            <h2 className="section-title" style={{ marginTop: '0.75rem' }}>Productos destacados</h2>
            <p className="section-subtitle" style={{ margin: '0.5rem auto 0' }}>
              Piezas tejidas a mano, hechas a medida según el espacio que quieras transformar.
            </p>
          </div>

          {loading ? (
            <div className="loading-page"><div className="spinner" /></div>
          ) : (
            <div className="grid-products">
              {featured.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}

          <div style={{ textAlign: 'center', marginTop: '3rem' }}>
            <Link to="/productos" className="btn btn-primary btn-lg">
              Ver todo el catálogo
            </Link>
          </div>
        </div>
      </section>

      {/* CTA TÉRMICO */}
      <section className={styles.thermalSection}>
        <div className={`container ${styles.thermalGrid}`}>
          <div className={styles.thermalStat}>
            <span className={styles.thermalNumber}>5°C</span>
            <span className={styles.thermalLabel}>de aislación térmica en cortinas de totora</span>
          </div>
          <div className={styles.thermalStat}>
            <span className={styles.thermalNumber}>15–20</span>
            <span className={styles.thermalLabel}>años de vida útil garantizada</span>
          </div>
          <div className={styles.thermalStat}>
            <span className={styles.thermalNumber}>100%</span>
            <span className={styles.thermalLabel}>fibra natural y renovable</span>
          </div>
          <div className={styles.thermalStat}>
            <span className={styles.thermalNumber}>40+</span>
            <span className={styles.thermalLabel}>años de tradición familiar</span>
          </div>
        </div>
      </section>

      {/* CTA FINAL */}
      <section className={`section ${styles.ctaSection}`}>
        <div className={`container ${styles.ctaContent}`}>
          <h2 className={styles.ctaTitle}>¿Listo para transformar tu espacio?</h2>
          <p className={styles.ctaText}>
            Cotiza tu cortina, estera o tejido a medida en minutos. Sin compromiso,
            con la calidez de la fibra natural.
          </p>
          <Link to="/productos" className="btn btn-primary btn-lg">
            Empezar a cotizar
          </Link>
        </div>
      </section>
    </>
  );
}
