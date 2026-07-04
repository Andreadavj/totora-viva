// frontend/src/pages/About.jsx
import { Link } from 'react-router-dom';
import styles from './About.module.css';

export default function About() {
  return (
    <div className={styles.page}>
      {/* HERO */}
      <section className={styles.hero}>
        <div className="container">
          <span className="badge badge-straw">Quilicura, Chile</span>
          <h1 className={styles.title}>Nuestra historia</h1>
          <p className={styles.subtitle}>
            Cuatro décadas tejiendo la tradición chilena con la fibra que crece
            en los humedales de Quilicura.
          </p>
        </div>
      </section>

      {/* HISTORIA PRINCIPAL */}
      <section className="section">
        <div className={`container ${styles.storyGrid}`}>
          <div className={styles.storyText}>
            <h2>Una empresa familiar, una tradición viva</h2>
            <p>
              Somos una empresa familiar dedicada a la protección de los humedales
              y el uso responsable de la fibra natural de la totora. Por más de
              40 años, nuestra familia ha trabajado de la mano con los ecosistemas
              de Quilicura, aprendiendo de su ritmo y devolviendo ese cuidado a
              través de un trabajo artesanal consciente.
            </p>
            <p>
              Cada verano cosechamos la totora mediante procesos sostenibles —poda
              controlada— lo que permite mantener el equilibrio del ecosistema y
              asegura que las plantas vuelvan a crecer temporada tras temporada.
              Luego, la materia prima se almacena cuidadosamente en galpones y se
              utiliza durante todo el año para fabricar productos artesanales como
              cortinas, esteras, cestería y textiles ecológicos.
            </p>
            <p>
              Hoy seguimos haciendo lo mismo que hace cuatro décadas: cosechar con
              respeto, tejer con paciencia y entregar productos que cuentan una
              historia de tradición, sostenibilidad y orgullo chileno.
            </p>
          </div>
          <div className={styles.storyImages}>
            <img src="https://placehold.co/500x600/2D5A3D/E8F2EB?text=Humedal" alt="Humedal de Quilicura" className={styles.imgLarge} />
            <img src="https://placehold.co/500x400/C4A055/4A2E12?text=Cosecha" alt="Cosecha de totora" className={styles.imgSmall} />
          </div>
        </div>
      </section>

      {/* PROCESO */}
      <section id="proceso" className={`section ${styles.processSection}`}>
        <div className="container">
          <div className="section-header" style={{ textAlign: 'center', maxWidth: 600, margin: '0 auto var(--space-3xl)' }}>
            <span className="badge badge-green">Proceso artesanal</span>
            <h2 className="section-title" style={{ marginTop: '0.75rem' }}>De la totora a tu hogar</h2>
          </div>

          <div className={styles.processSteps}>
            <div className={styles.processStep}>
              <div className={styles.stepNumber}>01</div>
              <h3>Cosecha sostenible</h3>
              <p>Cada verano realizamos la poda controlada de la totora en los humedales, respetando los tiempos del ecosistema para asegurar su regeneración.</p>
            </div>
            <div className={styles.processStep}>
              <div className={styles.stepNumber}>02</div>
              <h3>Secado y almacenaje</h3>
              <p>La fibra se traslada a nuestros galpones, donde se seca y almacena en condiciones óptimas para ser utilizada durante todo el año.</p>
            </div>
            <div className={styles.processStep}>
              <div className={styles.stepNumber}>03</div>
              <h3>Tejido artesanal</h3>
              <p>Artesanos con décadas de experiencia tejen cada cortina, estera y cierre perimetral a mano, pieza por pieza.</p>
            </div>
            <div className={styles.processStep}>
              <div className={styles.stepNumber}>04</div>
              <h3>Medida a tu espacio</h3>
              <p>Cada producto se confecciona según las dimensiones exactas que necesitas, garantizando un calce perfecto.</p>
            </div>
          </div>
        </div>
      </section>

      {/* MISION Y VALORES */}
      <section id="mision" className="section">
        <div className={`container ${styles.missionGrid}`}>
          <div className={styles.missionCard}>
            <div className={styles.missionIcon}>🌎</div>
            <h3>Misión</h3>
            <p>
              Proteger la vida de los humedales y las especies que habitan en
              ellos, preservando nuestros orígenes y promoviendo materiales
              sostenibles y renovables.
            </p>
          </div>
          <div className={styles.missionCard}>
            <div className={styles.missionIcon}>🤝</div>
            <h3>Tradición</h3>
            <p>
              Cada técnica de tejido que usamos hoy ha sido transmitida de
              generación en generación, manteniendo viva una herencia cultural
              chilena.
            </p>
          </div>
          <div className={styles.missionCard}>
            <div className={styles.missionIcon}>♻️</div>
            <h3>Sostenibilidad</h3>
            <p>
              Trabajamos con un recurso 100% renovable, sin químicos ni procesos
              industriales que dañen el medio ambiente.
            </p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className={`section ${styles.cta}`}>
        <div className="container" style={{ textAlign: 'center' }}>
          <h2 className={styles.ctaTitle}>Forma parte de esta historia</h2>
          <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem', maxWidth: 480, marginLeft: 'auto', marginRight: 'auto' }}>
            Lleva a tu hogar una pieza con historia, hecha con respeto por la
            naturaleza y por las manos que la tejen.
          </p>
          <Link to="/productos" className="btn btn-primary btn-lg">
            Ver nuestros productos
          </Link>
        </div>
      </section>
    </div>
  );
}
