import React, { useState, useEffect } from 'react';
import { getDigitalProductsData, saveDigitalProductsData } from '../services/supabaseService';
import { formatCurrency } from '../utils/currency';
import './MakePrompts.css'; // We can reuse the styling from MakePrompts for simplicity
import './MakeDigitalProducts.css'; // Specific styling for modal

const MakeDigitalProducts = () => {
  const [data, setData] = useState({
    title: 'Digital Products',
    subtitle: 'My Premium Collection of Digital Tools',
    products: []
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [isAddingProduct, setIsAddingProduct] = useState(false);
  
  const [newProduct, setNewProduct] = useState({
    title: '',
    category: '',
    description: '',
    price: '',
    showPrice: true,
    imageUrl: '',
    videoUrl: '',
    sourceUrl: ''
  });

  const [editingIndex, setEditingIndex] = useState(null);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const toggleFullscreen = () => {
    setIsFullscreen(prev => !prev);
  };

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const result = await getDigitalProductsData();

      if (result.success && result.data) {
        setData(result.data);
      }
    } catch (error) {
      console.error('Error loading digital products data:', error);
      setMessage({ type: 'error', text: 'Failed to load digital products data.' });
    } finally {
      setLoading(false);
    }
  };

  const handlePageInfoChange = (e) => {
    const { name, value } = e.target;
    setData(prev => ({ ...prev, [name]: value }));
  };

  const handleProductChange = (e) => {
    const { name, value, type, checked } = e.target;
    setNewProduct(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
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
      const updated = {
        ...newProduct,
        title: meta.title || newProduct.title,
        description: meta.description || newProduct.description,
        imageUrl: meta.image || newProduct.imageUrl,
        sourceUrl: url
      };
      setNewProduct(updated);
      setMessage({ type: 'success', text: 'Metadata loaded. Review and save the product!' });
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
      imageUrl: '',
      videoUrl: '',
      sourceUrl: ''
    });
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
      imageUrl: '',
      videoUrl: '',
      sourceUrl: ''
    });
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
      imageUrl: p.imageUrl || '',
      videoUrl: p.videoUrl || '',
      sourceUrl: p.sourceUrl || ''
    });
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
      imageUrl: '',
      videoUrl: '',
      sourceUrl: ''
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage({ type: '', text: '' });

    try {
      const result = await saveDigitalProductsData(data);

      if (result.success) {
        setMessage({ type: 'success', text: 'Digital Products data saved successfully!' });
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
            <div className="section-header-flex">
              <h3>Products List</h3>
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
                      <input
                        type="text"
                        id="productCategory"
                        name="category"
                        value={newProduct.category}
                        onChange={handleProductChange}
                        placeholder="e.g. Marketing, Code, etc."
                        className="form-control"
                      />
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

            <div className="items-list">
              {(!data.products || data.products.length === 0) ? (
                <p className="no-items">No products added yet.</p>
              ) : (
                data.products.map((product, index) => (
                  <div key={product.id || index} className="list-item-card">
                    <div className="item-header">
                      <h4>{product.title} <span className="item-category-badge">{product.category}</span></h4>
                      <div className="item-actions">
                        <button type="button" onClick={() => startEditProduct(index)} title="Edit" className="edit-icon-btn">
                          <i className="fas fa-edit"></i> Edit
                        </button>
                        <button type="button" onClick={() => handleDeleteProduct(index)} title="Delete" className="delete-icon-btn">
                          <i className="fas fa-trash-alt"></i> Delete
                        </button>
                      </div>
                    </div>
                    <div className="item-details">
                      <p><strong>Price:</strong> {formatCurrency(product.price, 'digital-products')}</p>
                      <p className="item-desc">{product.description && product.description.substring(0, 100)}...</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

        </form>
      </div>
    </div>
  );
};

export default MakeDigitalProducts;

