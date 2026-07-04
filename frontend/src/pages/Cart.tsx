// frontend/src/pages/Cart.jsx
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';
import { formatCLP, formatDimensions, weaveTypeLabel, productPlaceholder } from '../utils/helpers';
import styles from './Cart.module.css';

export default function Cart() {
  const { cart, loading, updateItem, removeItem } = useCart();
  const toast = useToast();
  const navigate = useNavigate();

  const handleQuantityChange = async (itemId, newQty) => {
    if (newQty < 0) return;
    try {
      await updateItem(itemId, newQty);
      if (newQty === 0) toast.info('Producto eliminado del carrito.');
    } catch {
      toast.error('No se pudo actualizar el carrito.');
    }
  };

  const handleRemove = async (itemId) => {
    try {
      await removeItem(itemId);
      toast.info('Producto eliminado del carrito.');
    } catch {
      toast.error('No se pudo eliminar el producto.');
    }
  };

  if (loading) {
    return <div className="loading-page" style={{ paddingTop: 'var(--header-height)' }}><div className="spinner" /></div>;
  }

  if (cart.items.length === 0) {
    return (
      <div className={styles.page}>
        <div className={styles.empty}>
          <div className={styles.emptyIcon}>🧺</div>
          <h2>Tu carrito está vacío</h2>
          <p>Explora nuestro catálogo y encuentra la pieza perfecta para tu espacio.</p>
          <Link to="/productos" className="btn btn-primary btn-lg">Ver productos</Link>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <div className="container">
        <h1 className={styles.title}>Tu carrito</h1>
        <p className={styles.subtitle}>{cart.itemCount} {cart.itemCount === 1 ? 'producto' : 'productos'} en tu carrito</p>

        <div className={styles.grid}>
          {/* Items */}
          <div className={styles.items}>
            {cart.items.map((item) => {
              const dimensions = formatDimensions(item.width, item.height);
              const image = item.product.images?.[0] || productPlaceholder(item.product.category?.slug);

              return (
                <div key={item.id} className={`${styles.item} animate-fade-in`}>
                  <Link to={`/productos/${item.product.slug}`} className={styles.itemImage}>
                    <img src={image} alt={item.product.name} onError={(e) => { e.target.src = productPlaceholder(item.product.category?.slug); }} />
                  </Link>

                  <div className={styles.itemInfo}>
                    <Link to={`/productos/${item.product.slug}`} className={styles.itemName}>
                      {item.product.name}
                    </Link>
                    <span className={styles.itemCategory}>{item.product.category?.name}</span>

                    <div className={styles.itemSpecs}>
                      {dimensions && <span className={styles.spec}>{dimensions}</span>}
                      {item.weaveType && <span className={styles.spec}>{weaveTypeLabel(item.weaveType)}</span>}
                    </div>
                  </div>

                  <div className={styles.itemQuantity}>
                    <button
                      className={styles.qtyBtn}
                      onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                      aria-label="Disminuir cantidad"
                    >
                      −
                    </button>
                    <span className={styles.qtyValue}>{item.quantity}</span>
                    <button
                      className={styles.qtyBtn}
                      onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                      aria-label="Aumentar cantidad"
                    >
                      +
                    </button>
                  </div>

                  <div className={styles.itemPrice}>
                    {formatCLP(item.totalPrice * item.quantity)}
                    {item.quantity > 1 && (
                      <span className={styles.unitPrice}>{formatCLP(item.totalPrice)} c/u</span>
                    )}
                  </div>

                  <button
                    className={styles.removeBtn}
                    onClick={() => handleRemove(item.id)}
                    aria-label="Eliminar producto"
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2m3 0-1 14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2L4 6"/>
                    </svg>
                  </button>
                </div>
              );
            })}
          </div>

          {/* Resumen */}
          <aside className={styles.summary}>
            <h3>Resumen de compra</h3>
            <div className={styles.summaryRow}>
              <span>Subtotal</span>
              <span>{formatCLP(cart.subtotal)}</span>
            </div>
            <div className={styles.summaryRow}>
              <span>Envío</span>
              <span className={styles.shippingNote}>A coordinar</span>
            </div>
            <div className={styles.summaryDivider} />
            <div className={`${styles.summaryRow} ${styles.summaryTotal}`}>
              <span>Total</span>
              <span>{formatCLP(cart.subtotal)}</span>
            </div>

            <button className="btn btn-primary btn-lg" style={{ width: '100%', marginTop: '1.25rem' }} onClick={() => navigate('/checkout')}>
              Continuar con el pago
            </button>
            <Link to="/productos" className={styles.continueShopping}>
              ← Seguir comprando
            </Link>

            <div className={styles.trustNote}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="11" width="18" height="11" rx="2"/>
                <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
              </svg>
              Pago seguro a través de Webpay
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
