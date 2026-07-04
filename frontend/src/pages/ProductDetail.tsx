// frontend/src/pages/ProductDetail.jsx
import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';
import PriceCalculator from '../components/products/PriceCalculator';
import { productPlaceholder } from '../utils/helpers';
import styles from './ProductDetail.module.css';

export default function ProductDetail() {
  const { slug } = useParams();
  const { user } = useAuth();
  const { addToCart } = useCart();
  const toast = useToast();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState(0);
  const [error, setError] = useState(false);

  useEffect(() => {
    setLoading(true);
    setError(false);
    api.get(`/products/${slug}`)
      .then(({ data }) => {
        setProduct(data.product);
        setActiveImage(0);
      })
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading) {
    return <div className="loading-page" style={{ paddingTop: 'var(--header-height)' }}><div className="spinner" /></div>;
  }

  if (error || !product) {
    return (
      <div className={styles.notFound}>
        <h2>Producto no encontrado</h2>
        <p>El producto que buscas no existe o ya no está disponible.</p>
        <Link to="/productos" className="btn btn-primary">Volver al catálogo</Link>
      </div>
    );
  }

  const images = product.images?.length ? product.images : [productPlaceholder(product.category?.slug)];

  const handleAddToCart = async (item) => {
    try {
      await addToCart(item);
      toast.success('Producto agregado al carrito 🌿');
    } catch (err) {
      toast.error(err.response?.data?.error || 'Error al agregar al carrito.');
      throw err;
    }
  };

  return (
    <div className={styles.page}>
      {/* Breadcrumb */}
      <div className={styles.breadcrumb}>
        <div className="container">
          <Link to="/">Inicio</Link>
          <span>/</span>
          <Link to="/productos">Productos</Link>
          <span>/</span>
          <Link to={`/productos?category=${product.category?.slug}`}>{product.category?.name}</Link>
          <span>/</span>
          <span className={styles.breadcrumbCurrent}>{product.name}</span>
        </div>
      </div>

      <div className="container">
        <div className={styles.grid}>
          {/* Galería de imágenes */}
          <div className={styles.gallery}>
            <div className={styles.mainImage}>
              <img
                src={images[activeImage]}
                alt={product.name}
                onError={(e) => { e.target.src = productPlaceholder(product.category?.slug); }}
              />
            </div>
            {images.length > 1 && (
              <div className={styles.thumbnails}>
                {images.map((img, i) => (
                  <button
                    key={i}
                    className={`${styles.thumb} ${i === activeImage ? styles.thumbActive : ''}`}
                    onClick={() => setActiveImage(i)}
                  >
                    <img src={img} alt={`${product.name} ${i + 1}`} onError={(e) => { e.target.src = productPlaceholder(product.category?.slug); }} />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Información del producto */}
          <div className={styles.info}>
            <span className="badge badge-straw">{product.category?.name}</span>
            <h1 className={styles.name}>{product.name}</h1>
            <p className={styles.description}>{product.description}</p>

            {product.features?.length > 0 && (
              <ul className={styles.features}>
                {product.features.map((feature, i) => (
                  <li key={i}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <path d="M20 6 9 17l-5-5"/>
                    </svg>
                    {feature}
                  </li>
                ))}
              </ul>
            )}

            {/* Calculadora de precio */}
            <PriceCalculator
              product={product}
              onAddToCart={handleAddToCart}
              isAuthenticated={!!user}
            />
          </div>
        </div>

        {/* Info adicional */}
        <div className={styles.extraInfo}>
          <div className={styles.infoBlock}>
            <div className={styles.infoIcon}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                <path d="M20.38 3.46 16 2a4 4 0 0 1-8 0L3.62 3.46a2 2 0 0 0-1.34 2.23l.58 3.47a1 1 0 0 0 .99.84H6v10c0 1.1.9 2 2 2h8a2 2 0 0 0 2-2V10h2.15a1 1 0 0 0 .99-.84l.58-3.47a2 2 0 0 0-1.34-2.23z"/>
              </svg>
            </div>
            <div>
              <h4>Hecho a mano</h4>
              <p>Cada pieza es elaborada por artesanos de Quilicura usando técnicas tradicionales.</p>
            </div>
          </div>
          <div className={styles.infoBlock}>
            <div className={styles.infoIcon}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                <rect x="1" y="3" width="15" height="13" rx="1"/>
                <path d="M16 8h4l3 3v5h-7z"/>
                <circle cx="5.5" cy="18.5" r="2.5"/>
                <circle cx="18.5" cy="18.5" r="2.5"/>
              </svg>
            </div>
            <div>
              <h4>Despacho a coordinar</h4>
              <p>Una vez confirmado el pago, te contactaremos para coordinar la entrega o retiro.</p>
            </div>
          </div>
          <div className={styles.infoBlock}>
            <div className={styles.infoIcon}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
              </svg>
            </div>
            <div>
              <h4>Material 100% natural</h4>
              <p>Fibra de totora cosechada de forma sostenible en los humedales de Quilicura.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
