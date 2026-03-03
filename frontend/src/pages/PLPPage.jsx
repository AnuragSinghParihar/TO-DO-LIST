import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import FilterSidebar from '../components/FilterSidebar';
import { useCart } from '../context/CartContext';
import api from '../api/client';
import './PLPPage.css';

const PLPPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [pagination, setPagination] = useState({});
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState([]);
  const { dispatch } = useCart();

  const currentCategory = searchParams.get('category') || '';
  const currentSearch = searchParams.get('search') || '';
  const currentSort = searchParams.get('sort') || 'created_at';
  const currentOrder = searchParams.get('order') || 'desc';
  const currentPage = parseInt(searchParams.get('page')) || 1;

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await api.get('/api/products/categories');
        setCategories(res.data.categories);
      } catch (err) { console.error(err); }
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const params = new URLSearchParams();
        if (currentCategory) params.set('category', currentCategory);
        if (currentSearch) params.set('search', currentSearch);
        params.set('sort', currentSort);
        params.set('order', currentOrder);
        params.set('page', currentPage);

        const res = await api.get(`/api/products?${params.toString()}`);
        setProducts(res.data.products);
        setPagination(res.data.pagination);
      } catch (err) { console.error(err); }
      finally { setLoading(false); }
    };
    fetchProducts();
  }, [currentCategory, currentSearch, currentSort, currentOrder, currentPage]);

  const updateFilter = (key, value) => {
    const params = new URLSearchParams(searchParams);
    if (value) params.set(key, value);
    else params.delete(key);
    if (key !== 'page') params.set('page', '1');
    setSearchParams(params);
  };

  const handleAddToCart = (product) => {
    dispatch({ type: 'ADD', item: { id: product.id, name: product.name, price: product.price, image_url: product.image_url } });
  };

  return (
    <div className="plp-page container">
      <div className="plp-header">
        <h1>{currentSearch ? `Results for "${currentSearch}"` : currentCategory ? currentCategory.replace('-', ' ') : 'All Products'}</h1>
        <div className="sort-controls">
          <select value={`${currentSort}-${currentOrder}`} onChange={(e) => {
            const [s, o] = e.target.value.split('-');
            updateFilter('sort', s);
            const params = new URLSearchParams(searchParams);
            params.set('sort', s); params.set('order', o); params.set('page', '1');
            setSearchParams(params);
          }}>
            <option value="created_at-desc">Newest First</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
            <option value="rating-desc">Top Rated</option>
            <option value="name-asc">Name: A-Z</option>
          </select>
        </div>
      </div>

      <div className="plp-layout">
        <FilterSidebar
          categories={categories}
          activeCategory={currentCategory}
          onCategoryChange={(cat) => updateFilter('category', cat)}
        />
        <div className="plp-content">
          {loading ? (
            <div className="products-grid">
              {[...Array(8)].map((_, i) => <div key={i} className="skeleton-card" />)}
            </div>
          ) : products.length === 0 ? (
            <div className="empty-state">
              <h3>No products found</h3>
              <p>Try adjusting your filters or search terms.</p>
            </div>
          ) : (
            <>
              <div className="products-grid">
                {products.map((p) => (
                  <ProductCard key={p.id} product={p} onAddToCart={handleAddToCart} />
                ))}
              </div>
              {pagination.pages > 1 && (
                <div className="pagination">
                  {Array.from({ length: pagination.pages }, (_, i) => (
                    <button
                      key={i + 1}
                      className={`page-btn ${currentPage === i + 1 ? 'active' : ''}`}
                      onClick={() => updateFilter('page', String(i + 1))}
                    >
                      {i + 1}
                    </button>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default PLPPage;
