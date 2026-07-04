// frontend/src/pages/admin/AdminProducts.jsx
import { useEffect, useState } from 'react';
import api from '../../services/api';
import { useToast } from '../../context/ToastContext';
import { formatCLP, productPlaceholder } from '../../utils/helpers';
import styles from './AdminProducts.module.css';

const PRICING_LABELS = {
  PER_SQM: 'Por m²',
  FIXED: 'Precio fijo',
  WEAVE_TYPE: 'Por tipo de tejido',
};

export default function AdminProducts() {
  const toast = useToast();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({});

  const fetchProducts = () => {
    setLoading(true);
    api.get('/admin/products')
      .then(({ data }) => setProducts(data.products))
      .catch(() => toast.error('No se pudieron cargar los productos.'))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const startEdit = (product) => {
    setEditingId(product.id);
    setEditForm({
      pricePerSqm: product.pricePerSqm || '',
      fixedPrice: product.fixedPrice || '',
      finePricePerSqm: product.finePricePerSqm || '',
      coarsePricePerSqm: product.coarsePricePerSqm || '',
      isActive: product.isActive,
      isFeatured: product.isFeatured,
    });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditForm({});
  };

  const saveEdit = async (id) => {
    try {
      const payload = {};
      ['pricePerSqm', 'fixedPrice', 'finePricePerSqm', 'coarsePricePerSqm'].forEach((key) => {
        if (editForm[key] !== '') payload[key] = Number(editForm[key]);
      });
      payload.isActive = editForm.isActive;
      payload.isFeatured = editForm.isFeatured;

      await api.put(`/admin/products/${id}`, payload);
      toast.success('Producto actualizado.');
      setEditingId(null);
      fetchProducts();
    } catch (err) {
      toast.error(err.response?.data?.error || 'No se pudo actualizar el producto.');
    }
  };

  if (loading) {
    return <div className="loading-page"><div className="spinner" /></div>;
  }

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <div>
          <h1>Productos</h1>
          <p>Gestiona precios internos, disponibilidad y destacados.</p>
        </div>
      </div>

      <div className={styles.note}>
        ⚠️ Los precios internos por m² <strong>nunca</strong> se muestran a los clientes.
        Solo se utilizan para calcular el total final.
      </div>

      <div className={styles.list}>
        {products.map((product) => {
          const isEditing = editingId === product.id;
          const image = product.images?.[0] || productPlaceholder(product.category?.slug);

          return (
            <div key={product.id} className={styles.card}>
              <img src={image} alt={product.name} className={styles.image} onError={(e) => { e.target.src = productPlaceholder(); }} />

              <div className={styles.info}>
                <div className={styles.infoHeader}>
                  <div>
                    <h3>{product.name}</h3>
                    <span className={styles.category}>{product.category?.name} · {PRICING_LABELS[product.pricingType]}</span>
                  </div>
                  <div className={styles.badges}>
                    {!isEditing && product.isFeatured && <span className="badge badge-straw">Destacado</span>}
                    {!isEditing && (
                      <span className={`badge ${product.isActive ? 'badge-green' : ''}`} style={!product.isActive ? { background: '#FDE8E8', color: '#C0392B' } : {}}>
                        {product.isActive ? 'Activo' : 'Inactivo'}
                      </span>
                    )}
                  </div>
                </div>

                {!isEditing ? (
                  <div className={styles.prices}>
                    {product.pricingType === 'PER_SQM' && (
                      <div className={styles.priceItem}>
                        <span>Precio por m²</span>
                        <strong>{formatCLP(product.pricePerSqm)}</strong>
                      </div>
                    )}
                    {product.pricingType === 'FIXED' && (
                      <div className={styles.priceItem}>
                        <span>Precio fijo</span>
                        <strong>{formatCLP(product.fixedPrice)}</strong>
                      </div>
                    )}
                    {product.pricingType === 'WEAVE_TYPE' && (
                      <>
                        <div className={styles.priceItem}>
                          <span>Tejido fino /m²</span>
                          <strong>{formatCLP(product.finePricePerSqm)}</strong>
                        </div>
                        <div className={styles.priceItem}>
                          <span>Tejido grueso /m²</span>
                          <strong>{formatCLP(product.coarsePricePerSqm)}</strong>
                        </div>
                      </>
                    )}
                  </div>
                ) : (
                  <div className={styles.editGrid}>
                    {product.pricingType === 'PER_SQM' && (
                      <div className="form-group">
                        <label className="form-label">Precio por m² (CLP)</label>
                        <input type="number" className="form-input" value={editForm.pricePerSqm} onChange={(e) => setEditForm({ ...editForm, pricePerSqm: e.target.value })} />
                      </div>
                    )}
                    {product.pricingType === 'FIXED' && (
                      <div className="form-group">
                        <label className="form-label">Precio fijo (CLP)</label>
                        <input type="number" className="form-input" value={editForm.fixedPrice} onChange={(e) => setEditForm({ ...editForm, fixedPrice: e.target.value })} />
                      </div>
                    )}
                    {product.pricingType === 'WEAVE_TYPE' && (
                      <>
                        <div className="form-group">
                          <label className="form-label">Tejido fino /m² (CLP)</label>
                          <input type="number" className="form-input" value={editForm.finePricePerSqm} onChange={(e) => setEditForm({ ...editForm, finePricePerSqm: e.target.value })} />
                        </div>
                        <div className="form-group">
                          <label className="form-label">Tejido grueso /m² (CLP)</label>
                          <input type="number" className="form-input" value={editForm.coarsePricePerSqm} onChange={(e) => setEditForm({ ...editForm, coarsePricePerSqm: e.target.value })} />
                        </div>
                      </>
                    )}
                    <div className={styles.toggles}>
                      <label className={styles.toggle}>
                        <input type="checkbox" checked={editForm.isFeatured} onChange={(e) => setEditForm({ ...editForm, isFeatured: e.target.checked })} />
                        Destacado
                      </label>
                      <label className={styles.toggle}>
                        <input type="checkbox" checked={editForm.isActive} onChange={(e) => setEditForm({ ...editForm, isActive: e.target.checked })} />
                        Activo
                      </label>
                    </div>
                  </div>
                )}
              </div>

              <div className={styles.actions}>
                {isEditing ? (
                  <>
                    <button className="btn btn-primary btn-sm" onClick={() => saveEdit(product.id)}>Guardar</button>
                    <button className="btn btn-ghost btn-sm" onClick={cancelEdit}>Cancelar</button>
                  </>
                ) : (
                  <button className="btn btn-secondary btn-sm" onClick={() => startEdit(product)}>Editar precios</button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
