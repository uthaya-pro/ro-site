import { useState, useEffect } from 'react';
import { FaSearch, FaFilter } from 'react-icons/fa';
import ProductCard from '../../components/products/ProductCard';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { productsAPI } from '../../services/endpoints';
import './ProductsPage.css';

const ProductsPage = () => {
  const [products, setProducts] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [techFilter, setTechFilter] = useState('');

  useEffect(() => {
    document.title = 'Products | TUTY RO Purifier';
    productsAPI.getAll()
      .then(res => { setProducts(res.data.data || []); setFiltered(res.data.data || []); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    let result = products;
    if (search) result = result.filter(p => p.name.toLowerCase().includes(search.toLowerCase()) || (p.description || '').toLowerCase().includes(search.toLowerCase()));
    if (techFilter) result = result.filter(p => (p.technology || '').includes(techFilter));
    setFiltered(result);
  }, [search, techFilter, products]);

  const technologies = [...new Set(products.map(p => p.technology).filter(Boolean))];

  return (
    <div className="products-page">
      <section className="page-hero">
        <div className="container">
          <h1>Our RO Purifiers</h1>
          <p>Find the perfect water purifier for your home, office, or business needs.</p>
        </div>
      </section>

      <div className="container products-page__body">
        {/* Filters */}
        <div className="products-page__filters">
          <div className="products-page__search">
            <FaSearch className="products-page__search-icon" />
            <input
              type="text"
              id="product-search"
              placeholder="Search products..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="form-control products-page__search-input"
            />
          </div>
          <div className="products-page__tech-filter">
            <FaFilter size={14} style={{ color: 'var(--gray-400)' }} />
            <select
              id="tech-filter"
              value={techFilter}
              onChange={e => setTechFilter(e.target.value)}
              className="form-control"
              style={{ width: 'auto', minWidth: 200 }}
            >
              <option value="">All Technologies</option>
              {technologies.map(t => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>
          <p className="products-page__count">{filtered.length} product{filtered.length !== 1 ? 's' : ''} found</p>
        </div>

        {/* Grid */}
        {loading ? (
          <LoadingSpinner />
        ) : filtered.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">🔍</div>
            <h3>No products found</h3>
            <p>Try adjusting your search or filter criteria.</p>
          </div>
        ) : (
          <div className="products-page__grid">
            {filtered.map(p => <ProductCard key={p.id} product={p} />)}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductsPage;
