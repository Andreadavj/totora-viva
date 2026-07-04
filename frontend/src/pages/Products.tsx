// frontend/src/pages/Products.jsx
import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import api from '../services/api';
import ProductCard from '../components/products/ProductCard';
import styles from './Products.module.css';

export default function Products() {
  const [searchParams, setSearchParams] = useSearchParams();
  const activeCategory = searchParams.get('category') || '';

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/categories').then(({ data }) => setCategories(data.categories)).catch(() => {});
  }, []);

  useEffect(() => {
    setLoading(true);
    const params = new URLSearchParams();
    if (activeCategory) params.set('category', activeCategory);
    params.set('limit', '50');

    api.get(`/products?${params.toString()}`)
      .then(({ data }) => setProducts(data.products))
      .catch(() => setProducts([]))
      .finally(() => setLoading(false));
  }, [activeCategory]);

  const handleCategoryClick = (slug) => {
    if (slug === activeCategory) {
      searchParams.delete('category');
    } else {
      searchParams.set('category', slug);
    }
    setSearchParams(searchParams);
  };

  return (
    <div className={styles.page}>
      <section className={styles.hero}>
        <div className="container">
          <span className="badge badge-straw">Catálogo</span>
          <h1 className={styles.title}>Nuestros productos</h1>
          <p className={styles.subtitle}>
            Cada pieza es fabricada a mano y a medida con fibra de totora cosechada
            de forma sostenible. Selecciona una categoría e ingresa tus medidas
            para conocer el precio.
          </p>
        </div>
      </section>

      <section className="section" style={{ paddingTop: 'var(--space-2xl)' }}>
        <div className="container">
          {/* Filtros */}
          <div className={styles.filters}>
            <button
              className={`${styles.filterChip} ${!activeCategory ? styles.filterActive : ''}`}
              onClick={() => { searchParams.delete('category'); setSearchParams(searchParams); }}
            >
              Todos
            </button>
            {categories.map((cat) => (
              <button
                key={cat.id}
                className={`${styles.filterChip} ${activeCategory === cat.slug ? styles.filterActive : ''}`}
                onClick={() => handleCategoryClick(cat.slug)}
              >
                {cat.name}
                <span className={styles.filterCount}>{cat._count?.products}</span>
              </button>
            ))}
          </div>

          {/* Productos */}
          {loading ? (
            <div className="loading-page"><div className="spinner" /></div>
          ) : products.length === 0 ? (
            <div className={styles.empty}>
              <p>No encontramos productos en esta categoría todavía.</p>
            </div>
          ) : (
            <div className="grid-products animate-fade-in">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
