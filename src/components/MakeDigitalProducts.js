import React, { useState, useEffect, useMemo } from 'react';
import {
  getDigitalProductsData,
  getDigitalProductPaymentRequests,
  saveDigitalProductsData,
  updateDigitalProductPaymentRequest
} from '../services/supabaseService';
import { formatCurrency } from '../utils/currency';
import './MakePrompts.css'; // We can reuse the styling from MakePrompts for simplicity
import './MakeDigitalProducts.css'; // Specific styling for modal

const DEFAULT_ACCESS_SETTINGS = {
  enabled: false,
  title: 'Premium Access',
  description: 'Submit payment details and transaction ID to request a new slot.',
  bankName: '',
  ibanNumber: '',
  accountHolderName: '',
  whatsappNumber: '',
  slotLimit: 4,
  instructions: ''
};

const ACCESS_MODES = {
  SHARED: 'shared',
  PRIVATE: 'private'
};

const getProductAccessMode = (product = {}) => {
  if (product.accessMode === ACCESS_MODES.SHARED || product.accessMode === ACCESS_MODES.PRIVATE) {
    return product.accessMode;
  }

  return Number.parseInt(product.slotLimit, 10) > 0 ? ACCESS_MODES.SHARED : ACCESS_MODES.PRIVATE;
};

const MakeDigitalProducts = () => {
  const [data, setData] = useState({
    title: 'Digital Products',
    subtitle: 'My Premium Collection of Digital Tools',
    accessSettings: DEFAULT_ACCESS_SETTINGS,
    products: []
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [requestsLoading, setRequestsLoading] = useState(true);
  const [paymentRequests, setPaymentRequests] = useState([]);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [isAddingProduct, setIsAddingProduct] = useState(false);
  const [productSearch, setProductSearch] = useState('');
  const [productFilter, setProductFilter] = useState('all');
  
  const [newProduct, setNewProduct] = useState({
    title: '',
    category: '',
    description: '',
    price: '',
    accessMode: ACCESS_MODES.PRIVATE,
    slotLimit: 4,
    showPrice: true,
    displayMode: 'image',
    imageUrl: '',
    videoUrl: '',
    sourceUrl: ''
  });

  const [editingIndex, setEditingIndex] = useState(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isCustomCategory, setIsCustomCategory] = useState(false);
  const existingCategories = useMemo(
    () =>
      [...new Set((data.products || []).map((product) => String(product.category || '').trim()).filter(Boolean))],
    [data.products]
  );
  const categorySelectValue = isCustomCategory ? '__custom__' : (newProduct.category || '');
  const filteredProducts = useMemo(() => {
    const query = productSearch.trim().toLowerCase();

    return (data.products || [])
      .map((product, originalIndex) => ({ product, originalIndex }))
      .filter(({ product }) => {
      const accessMode = getProductAccessMode(product);
      const matchesFilter =
        productFilter === 'all' ||
        (productFilter === 'shared' && accessMode === ACCESS_MODES.SHARED) ||
        (productFilter === 'private' && accessMode === ACCESS_MODES.PRIVATE);

      const matchesQuery = !query || [
        product.title,
        product.category,
        product.description,
        product.price,
        accessMode
      ]
        .filter(Boolean)
        .some((field) => String(field).toLowerCase().includes(query));

      return matchesFilter && matchesQuery;
    });
  }, [data.products, productSearch, productFilter]);
  const productCounts = useMemo(() => {
    const products = data.products || [];

    return {
      total: products.length,
      shared: products.filter((product) => getProductAccessMode(product) === ACCESS_MODES.SHARED).length,
      private: products.filter((product) => getProductAccessMode(product) === ACCESS_MODES.PRIVATE).length
    };
  }, [data.products]);

  const toggleFullscreen = () => {
    setIsFullscreen(prev => !prev);
  };

  useEffect(() => {
    loadData();
    loadPaymentRequests();
  }, []);

  const loadData = async () => {
    try {
      const result = await getDigitalProductsData();

      if (result.success && result.data) {
        setData({
          title: result.data.title || 'Digital Products',
          subtitle: result.data.subtitle || 'My Premium Collection of Digital Tools',
          accessSettings: {
            ...DEFAULT_ACCESS_SETTINGS,
            ...(result.data.accessSettings || {})
          },
          products: Array.isArray(result.data.products)
            ? result.data.products.map((product) => ({
                ...product,
                accessMode: getProductAccessMode(product),
                slotLimit: Number.parseInt(product.slotLimit, 10) || 4
              }))
            : []
        });
      }
    } catch (error) {
      console.error('Error loading digital products data:', error);
      setMessage({ type: 'error', text: 'Failed to load digital products data.' });
    } finally {
      setLoading(false);
    }
  };

  const loadPaymentRequests = async () => {
    try {
      const result = await getDigitalProductPaymentRequests();
      if (result.success) {
        setPaymentRequests(result.data);
      }
    } catch (error) {
      console.error('Error loading payment requests:', error);
    } finally {
      setRequestsLoading(false);
    }
  };

  const handlePageInfoChange = (e) => {
    const { name, value } = e.target;
    setData(prev => ({ ...prev, [name]: value }));
  };

  const handleAccessSettingsChange = (e) => {
    const { name, value, type, checked } = e.target;
    setData((prev) => ({
      ...prev,
      accessSettings: {
        ...(prev.accessSettings || DEFAULT_ACCESS_SETTINGS),
        [name]: type === 'checkbox' ? checked : value
      }
    }));
  };

  const handleProductChange = (e) => {
    const { name, value, type, checked } = e.target;
    setNewProduct(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleCategorySelectChange = (e) => {
    const { value } = e.target;
    if (value === '__custom__') {
      setIsCustomCategory(true);
      setNewProduct((prev) => ({
        ...prev,
        category: existingCategories.includes(prev.category) ? '' : prev.category
      }));
      return;
    }

    setIsCustomCategory(false);
    setNewProduct((prev) => ({
      ...prev,
      category: value
    }));
  };

  const fetchProductMetadata = async (url) => {
    if (!url || !/^https?:\/\//i.test(url)) {
      setMessage({ type: 'error', text: 'Please enter a valid URL (including https://).' });
      return;
    }

    try {
      setMessage({ type: '', text: 'Fetching metadata from URL...' });
      const response = await fetch(`/api/fetch-url-meta?url=${encodeURIComponent(url)}`);
      if (!response.ok) {
        throw new Error(`Metadata fetch failed: ${response.statusText}`);
      }

      const meta = await response.json();
      if (!meta.success) {
        throw new Error(meta.message || 'Metadata fetch failed');
      }
      const updated = {
        ...newProduct,
        title: meta.title || newProduct.title,
        description: meta.description || newProduct.description,
        imageUrl: meta.image || newProduct.imageUrl,
        sourceUrl: url
      };
      setNewProduct(updated);
      setMessage({
        type: 'success',
        text: meta.partial
          ? 'Basic metadata loaded. Some websites block full preview, so fallback data was used.'
          : 'Metadata loaded. Review and save the product!'
      });
    } catch (error) {
      console.error('URL metadata fetch error', error);
      setMessage({ type: 'error', text: 'Could not fetch metadata from the URL. Please enter manually.' });
    }
  };

  const handleAddProduct = () => {
    if (!newProduct.title.trim() || !newProduct.description.trim()) {
      setMessage({ type: 'error', text: 'Title and description are required for a product!' });
      return;
    }

    const productToAdd = {
      ...newProduct,
      id: Date.now().toString()
    };

    setData(prev => ({
      ...prev,
      products: [productToAdd, ...(prev.products || [])]
    }));

    setNewProduct({
      title: '',
      category: '',
      description: '',
      price: '',
      showPrice: true,
      displayMode: 'image',
      accessMode: ACCESS_MODES.PRIVATE,
      slotLimit: 4,
      imageUrl: '',
      videoUrl: '',
      sourceUrl: ''
    });
    setIsCustomCategory(false);
    setIsAddingProduct(false);
    setIsFullscreen(false);
    setMessage({ type: 'success', text: 'Product added locally. Don\'t forget to save!' });
  };

  const handleSaveEdit = () => {
    if (editingIndex === null) return;
    
    if (!newProduct.title.trim() || !newProduct.description.trim()) {
      setMessage({ type: 'error', text: 'Title and description are required!' });
      return;
    }

    const updatedProducts = [...(data.products || [])];
    updatedProducts[editingIndex] = {
      ...updatedProducts[editingIndex],
      ...newProduct
    };

    setData(prev => ({
      ...prev,
      products: updatedProducts
    }));

    setNewProduct({
      title: '',
      category: '',
      description: '',
      price: '',
      showPrice: true,
      displayMode: 'image',
      accessMode: ACCESS_MODES.PRIVATE,
      slotLimit: 4,
      imageUrl: '',
      videoUrl: '',
      sourceUrl: ''
    });
    setIsCustomCategory(false);
    setEditingIndex(null);
    setIsAddingProduct(false);
    setIsFullscreen(false);
    setMessage({ type: 'success', text: 'Product updated locally. Don\'t forget to save!' });
  };

  const startEditProduct = (index) => {
    const p = data.products[index];
    setNewProduct({
      title: p.title || '',
      category: p.category || '',
      description: p.description || '',
      price: p.price || '',
      showPrice: p.showPrice !== false,
      displayMode: p.displayMode || 'image',
      accessMode: getProductAccessMode(p),
      slotLimit: p.slotLimit || 4,
      imageUrl: p.imageUrl || '',
      videoUrl: p.videoUrl || '',
      sourceUrl: p.sourceUrl || ''
    });
    setIsCustomCategory(false);
    setEditingIndex(index);
    setIsAddingProduct(true);
  };

  const handleDeleteProduct = (index) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      const updatedProducts = data.products.filter((_, i) => i !== index);
      setData(prev => ({ ...prev, products: updatedProducts }));
      setMessage({ type: 'success', text: 'Product removed locally. Don\'t forget to save!' });
    }
  };

  const handleCancel = () => {
    setIsAddingProduct(false);
    setEditingIndex(null);
    setIsFullscreen(false);
    setNewProduct({
      title: '',
      category: '',
      description: '',
      price: '',
      showPrice: true,
      displayMode: 'image',
      accessMode: ACCESS_MODES.PRIVATE,
      slotLimit: 4,
      imageUrl: '',
      videoUrl: '',
      sourceUrl: ''
    });
    setIsCustomCategory(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage({ type: '', text: '' });

    try {
      const normalizedProducts = (data.products || []).map((product) => ({
        ...product,
        accessMode: getProductAccessMode(product),
        slotLimit: Number.parseInt(product.slotLimit, 10) || 4
      }));
      const payload = {
        ...data,
        products: normalizedProducts,
        accessSettings: {
          ...(data.accessSettings || DEFAULT_ACCESS_SETTINGS),
          slotLimit: Number.parseInt(data.accessSettings?.slotLimit, 10) || DEFAULT_ACCESS_SETTINGS.slotLimit
        }
      };
      const result = await saveDigitalProductsData(payload);

      if (result.success) {
        setMessage({ type: 'success', text: 'Digital Products data saved successfully!' });
        loadPaymentRequests();
      } else {
        setMessage({ type: 'error', text: result.error || 'Failed to save data. Please try again.' });
      }
    } catch (error) {
      console.error('Error saving data:', error);
      setMessage({ type: 'error', text: 'An unexpected error occurred.' });
    } finally {
      setSaving(false);
      window.scrollTo(0, 0);
    }
  };

  const clearProductFilters = () => {
    setProductSearch('');
    setProductFilter('all');
  };

  const handlePaymentRequestStatus = async (requestId, status) => {
    try {
      const result = await updateDigitalProductPaymentRequest(requestId, { status });
      if (!result.success) {
        throw new Error(result.error || 'Unable to update request.');
      }

      setPaymentRequests((prev) =>
        prev.map((request) => (request.id === requestId ? { ...request, status } : request))
      );
      setMessage({ type: 'success', text: `Request marked as ${status}.` });
    } catch (error) {
      console.error('Error updating request status:', error);
      setMessage({ type: 'error', text: error.message || 'Could not update the request.' });
    }
  };

  if (loading) {
    return <div className="loading" style={{ color: 'var(--site-accent-color)' }}>Loading Digital Products Form...</div>;
  }

  return (
    <div className="make-page">
      <div className="form-container">
        <div className="editor-header">
          <h1>Edit Digital Products Page</h1>
          <div className="editor-actions">
            <button type="button" className="btn btn-primary" onClick={() => setIsAddingProduct(true)}>
              <i className="fas fa-plus"></i> Add New Product
            </button>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={handleSubmit}
              disabled={saving || loading}
            >
              <i className="fas fa-save"></i> {saving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </div>

        {message.text && (
          <div className={`message-banner ${message.type}`}>
            {message.text}
          </div>
        )}

        <form onSubmit={handleSubmit} className="editor-form" id="digital-products-form">
          <div className="form-section">
            <h3>Page Header</h3>
            <div className="form-group">
              <label htmlFor="title">Page Title</label>
              <input
                type="text"
                id="title"
                name="title"
                value={data.title || ''}
                onChange={handlePageInfoChange}
                placeholder="Digital Products"
                className="form-control"
              />
            </div>

            <div className="form-group">
              <label htmlFor="subtitle">Page Subtitle</label>
              <input
                type="text"
                id="subtitle"
                name="subtitle"
                value={data.subtitle || ''}
                onChange={handlePageInfoChange}
                placeholder="A collection of my premium digital products"
                className="form-control"
              />
            </div>
          </div>

          <div className="form-section">
            <h3>Access & Payment Settings</h3>
            <div className="form-group">
              <label className="popup-toggle" style={{ marginBottom: '16px' }}>
                <input
                  type="checkbox"
                  name="enabled"
                  checked={Boolean(data.accessSettings?.enabled)}
                  onChange={handleAccessSettingsChange}
                />
                <span>Show payment request panel on public page</span>
              </label>
            </div>

            <div className="form-group">
              <label>Panel Title</label>
              <input
                type="text"
                name="title"
                value={data.accessSettings?.title || ''}
                onChange={handleAccessSettingsChange}
                className="form-input"
                placeholder="Premium Access"
              />
            </div>

            <div className="form-group">
              <label>Panel Description</label>
              <textarea
                name="description"
                value={data.accessSettings?.description || ''}
                onChange={handleAccessSettingsChange}
                rows="3"
                className="form-textarea"
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Bank Name</label>
                <input
                  type="text"
                  name="bankName"
                  value={data.accessSettings?.bankName || ''}
                  onChange={handleAccessSettingsChange}
                  className="form-input"
                />
              </div>
              <div className="form-group">
                <label>IBAN Number</label>
                <input
                  type="text"
                  name="ibanNumber"
                  value={data.accessSettings?.ibanNumber || ''}
                  onChange={handleAccessSettingsChange}
                  className="form-input"
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Account Holder Name</label>
                <input
                  type="text"
                  name="accountHolderName"
                  value={data.accessSettings?.accountHolderName || ''}
                  onChange={handleAccessSettingsChange}
                  className="form-input"
                />
              </div>
              <div className="form-group">
                <label>WhatsApp Number</label>
                <input
                  type="text"
                  name="whatsappNumber"
                  value={data.accessSettings?.whatsappNumber || ''}
                  onChange={handleAccessSettingsChange}
                  className="form-input"
                  placeholder="+92..."
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Seat Limit</label>
                <input
                  type="number"
                  name="slotLimit"
                  min="1"
                  value={data.accessSettings?.slotLimit || 4}
                  onChange={handleAccessSettingsChange}
                  className="form-input"
                />
              </div>
              <div className="form-group">
                <label>Instructions</label>
                <textarea
                  name="instructions"
                  value={data.accessSettings?.instructions || ''}
                  onChange={handleAccessSettingsChange}
                  rows="3"
                  className="form-textarea"
                  placeholder="Tell users how to submit payment details."
                />
              </div>
            </div>
          </div>

          <div className="form-section">
            <div className="section-header-flex">
              <h3>Products List</h3>
              <div className="section-header-stats">
                <span className="stat-pill">Total: {productCounts.total}</span>
                <span className="stat-pill stat-shared">Shared: {productCounts.shared}</span>
                <span className="stat-pill stat-private">Private: {productCounts.private}</span>
              </div>
            </div>

            <div className="products-toolbar">
              <input
                type="text"
                className="products-toolbar-search"
                placeholder="Search products by title, category, description, price..."
                value={productSearch}
                onChange={(event) => setProductSearch(event.target.value)}
              />
              <div className="products-toolbar-filters" role="tablist" aria-label="Product filters">
                <button
                  type="button"
                  className={`toolbar-filter-btn ${productFilter === 'all' ? 'active' : ''}`}
                  onClick={() => setProductFilter('all')}
                >
                  All
                </button>
                <button
                  type="button"
                  className={`toolbar-filter-btn ${productFilter === 'shared' ? 'active' : ''}`}
                  onClick={() => setProductFilter('shared')}
                >
                  Shared
                </button>
                <button
                  type="button"
                  className={`toolbar-filter-btn ${productFilter === 'private' ? 'active' : ''}`}
                  onClick={() => setProductFilter('private')}
                >
                  Private
                </button>
                {(productSearch || productFilter !== 'all') && (
                  <button type="button" className="toolbar-filter-btn ghost" onClick={clearProductFilters}>
                    Reset
                  </button>
                )}
              </div>
            </div>

            {isAddingProduct && (
              <div className="modal-overlay">
                <div className={`modal-content nested-form ${isFullscreen ? 'fullscreen-modal' : ''}`}>
                  <div className="modal-header-flex" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', borderBottom: '1px solid var(--site-sidebar-border-color)', paddingBottom: '10px' }}>
                    <h4 style={{ margin: 0, borderBottom: 'none', paddingBottom: 0 }}>{editingIndex !== null ? 'Edit Product' : 'Add New Product'}</h4>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <button
                        type="button"
                        className="fullscreen-btn"
                        onClick={toggleFullscreen}
                        title={isFullscreen ? 'Exit full screen' : 'Full screen'}
                      >
                        {isFullscreen ? '🗗' : '🗖'}
                      </button>
                      <div className="nested-form-actions" style={{ marginTop: 0 }}>
                        <button 
                          type="button" 
                          className="save-item-btn"
                          onClick={editingIndex !== null ? handleSaveEdit : handleAddProduct}
                        >
                          <i className="fas fa-save"></i> {editingIndex !== null ? 'Update' : 'Save'}
                        </button>
                        <button 
                          type="button" 
                          className="cancel-btn"
                          onClick={handleCancel}
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  </div>
                  
                  <div className="form-group">
                    <label htmlFor="productTitle">Product Title</label>
                    <input
                      type="text"
                      id="productTitle"
                      name="title"
                      value={newProduct.title}
                      onChange={handleProductChange}
                      placeholder="e.g. Meta Ads Setup Guide"
                      className="form-control"
                    />
                  </div>

                  <div className="form-row">
                    <div className="form-group half-width">
                      <label htmlFor="productCategory">Category</label>
                      <select
                        id="productCategory"
                        value={categorySelectValue}
                        onChange={handleCategorySelectChange}
                        className="form-control form-select"
                      >
                        <option value="">Select category</option>
                        {existingCategories.map((category) => (
                          <option key={category} value={category}>
                            {category}
                          </option>
                        ))}
                        <option value="__custom__">+ Add New Category</option>
                      </select>
                      {isCustomCategory && (
                        <input
                          type="text"
                          name="category"
                          value={newProduct.category}
                          onChange={handleProductChange}
                          placeholder="Type new category"
                          className="form-control"
                          style={{ marginTop: '10px' }}
                        />
                      )}
                    </div>
                    <div className="form-group half-width" style={{display: 'flex', flexDirection: 'column'}}>
                      <label htmlFor="productPrice">Price</label>
                      <div style={{display: 'flex', gap: '15px', alignItems: 'center'}}>
                        <input
                          type="text"
                          id="productPrice"
                          name="price"
                          value={newProduct.price}
                          onChange={handleProductChange}
                          placeholder="e.g. Rs 14000 or Rs 2000"
                          className="form-control"
                          style={{ flex: 1 }}
                        />
                        <label style={{display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', whiteSpace: 'nowrap', color: 'var(--site-accent-color)', fontSize: '14px'}}>
                          <input 
                            type="checkbox" 
                            name="showPrice" 
                            checked={newProduct.showPrice !== false} 
                            onChange={handleProductChange} 
                            style={{width: '18px', height: '18px', margin: 0, cursor: 'pointer'}}
                          /> Show Price
                        </label>
                      </div>
                    </div>
                  </div>

                  <div className="form-row">
                    <div className="form-group half-width">
                      <label htmlFor="productDisplayMode">Card Display Mode</label>
                      <select
                        id="productDisplayMode"
                        name="displayMode"
                        value={newProduct.displayMode || 'image'}
                        onChange={handleProductChange}
                        className="form-control form-select"
                      >
                        <option value="image">Image (if URL exists)</option>
                        <option value="text">Text Only</option>
                      </select>
                      <small style={{ color: '#aaa' }}>
                        Text mode selected ho to card image/video ke bajaye default text block show karega.
                      </small>
                    </div>
                  </div>

                  <div className="form-row">
                    <div className="form-group half-width">
                      <label htmlFor="productAccessMode">Access Type</label>
                      <select
                        id="productAccessMode"
                        name="accessMode"
                        value={newProduct.accessMode || ACCESS_MODES.PRIVATE}
                        onChange={handleProductChange}
                        className="form-control form-select"
                      >
                        <option value={ACCESS_MODES.PRIVATE}>Private Access</option>
                        <option value={ACCESS_MODES.SHARED}>Shared Access</option>
                      </select>
                      <small style={{ color: '#aaa' }}>
                        Private tools appear in the private tab. Shared tools show booking and slot details.
                      </small>
                    </div>
                    {newProduct.accessMode === ACCESS_MODES.SHARED && (
                      <div className="form-group half-width">
                        <label htmlFor="productSlotLimit">Shared Slots</label>
                        <input
                          type="number"
                          id="productSlotLimit"
                          name="slotLimit"
                          min="1"
                          value={newProduct.slotLimit || 4}
                          onChange={handleProductChange}
                          className="form-control"
                        />
                      </div>
                    )}
                  </div>

                  <div className="form-group">
                    <label htmlFor="productImageUrl">Image URL (Optional)</label>
                    <input
                      type="text"
                      id="productImageUrl"
                      name="imageUrl"
                      value={newProduct.imageUrl}
                      onChange={handleProductChange}
                      placeholder="URL for the product cover image"
                      className="form-control"
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="productSourceUrl">Product Page URL (Optional)</label>
                    <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                      <input
                        type="text"
                        id="productSourceUrl"
                        name="sourceUrl"
                        value={newProduct.sourceUrl}
                        onChange={handleProductChange}
                        placeholder="https://example.com/new-product"
                        className="form-control"
                        style={{ flex: 1 }}
                      />
                      <button
                        type="button"
                        className="btn btn-secondary"
                        onClick={() => fetchProductMetadata(newProduct.sourceUrl)}
                        style={{ flexShrink: 0 }}
                      >
                        Fetch Metadata
                      </button>
                    </div>
                    <small style={{ color: '#aaa' }}>Auto-fill title/description/image from the URL (if open graph tags are present).</small>
                  </div>

                  <div className="form-group">
                    <label htmlFor="productVideoUrl">YouTube Video URL (Optional)</label>
                    <input
                      type="text"
                      id="productVideoUrl"
                      name="videoUrl"
                      value={newProduct.videoUrl}
                      onChange={handleProductChange}
                      placeholder="YouTube URL for product demonstration"
                      className="form-control"
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="productDescription">Description</label>
                    <textarea
                      id="productDescription"
                      name="description"
                      value={newProduct.description}
                      onChange={handleProductChange}
                      placeholder="Detailed description of the digital product..."
                      className="form-control"
                      rows="3"
                    />
                  </div>
                </div>
              </div>
            )}

            <div className="items-list products-admin-grid">
              {(!data.products || data.products.length === 0) ? (
                <p className="no-items">No products added yet.</p>
              ) : filteredProducts.length === 0 ? (
                <p className="no-items">
                  No products match your current filters.
                </p>
              ) : (
                filteredProducts.map(({ product, originalIndex }) => (
                  <div key={product.id || originalIndex} className="list-item-card">
                    <div className="item-header">
                      <div className="item-header-copy">
                        <h4>{product.title}</h4>
                        <div className="item-badges">
                          {product.category ? <span className="item-category-badge">{product.category}</span> : null}
                          <span className={`item-category-badge access-${product.accessMode || ACCESS_MODES.PRIVATE}`}>
                            {product.accessMode === ACCESS_MODES.SHARED ? 'Shared' : 'Private'}
                          </span>
                          <span className="item-category-badge item-price-badge">
                            {formatCurrency(product.price, 'digital-products')}
                          </span>
                        </div>
                      </div>
                      <div className="item-actions">
                        <button type="button" onClick={() => startEditProduct(originalIndex)} title="Edit" className="edit-icon-btn">
                          <i className="fas fa-edit"></i> Edit
                        </button>
                        <button type="button" onClick={() => handleDeleteProduct(originalIndex)} title="Delete" className="delete-icon-btn">
                          <i className="fas fa-trash-alt"></i> Delete
                        </button>
                      </div>
                    </div>
                    <div className="item-details">
                      <p><strong>Display:</strong> {product.displayMode === 'text' ? 'Text' : 'Image'}</p>
                      <p><strong>Access:</strong> {product.accessMode === ACCESS_MODES.SHARED ? 'Shared' : 'Private'}</p>
                      {product.accessMode === ACCESS_MODES.SHARED && (
                        <p><strong>Slots:</strong> {product.slotLimit || 4}</p>
                      )}
                      <p className="item-desc">{product.description && product.description.substring(0, 140)}...</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="form-section">
            <div className="section-header-flex">
              <h3>Payment Requests</h3>
            </div>
            {requestsLoading ? (
              <div className="loading">Loading payment requests...</div>
            ) : paymentRequests.length === 0 ? (
              <p className="no-items">No payment requests submitted yet.</p>
            ) : (
              <div className="items-list">
                {paymentRequests.map((request) => (
                  <div key={request.id} className="list-item-card">
                    <div className="item-header">
                      <h4>
                        {request.full_name}
                        <span className="item-category-badge" style={{ marginLeft: '10px' }}>
                          {request.status}
                        </span>
                      </h4>
                      <div className="item-actions">
                        <button type="button" className="edit-icon-btn" onClick={() => handlePaymentRequestStatus(request.id, 'approved')}>
                          Approve
                        </button>
                        <button type="button" className="delete-icon-btn" onClick={() => handlePaymentRequestStatus(request.id, 'rejected')}>
                          Reject
                        </button>
                      </div>
                    </div>
                    <div className="item-details">
                      <p><strong>Product:</strong> {request.product_title || '-'}</p>
                      <p><strong>Phone:</strong> {request.phone_number || '-'}</p>
                      <p><strong>Transaction ID:</strong> {request.transaction_id || '-'}</p>
                      <p><strong>Slots:</strong> {request.requested_slots || 1}</p>
                      <p><strong>Amount:</strong> {request.amount || '-'}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

        </form>
      </div>
    </div>
  );
};

export default MakeDigitalProducts;

