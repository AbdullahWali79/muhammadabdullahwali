import React, { useState, useEffect } from 'react';
import { getDigitalProductsData, saveDigitalProductPaymentRequest } from '../services/supabaseService';
import { FaWhatsapp } from 'react-icons/fa';
import { formatCurrency } from '../utils/currency';
import './DigitalProducts.css';

const DEFAULT_ACCESS_SETTINGS = {
  enabled: false,
  title: 'Premium Access',
  description: 'Choose a product, submit your payment details, and receive WhatsApp confirmation.',
  bankName: '',
  ibanNumber: '',
  accountHolderName: '',
  whatsappNumber: '',
  slotLimit: 4,
  instructions: ''
};

const DigitalProducts = ({ userData }) => {
  const [activeFilter, setActiveFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [productsData, setProductsData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [expandedProductId, setExpandedProductId] = useState(null);
  const [brokenImages, setBrokenImages] = useState({});
  const [selectedProductId, setSelectedProductId] = useState('');
  const [paymentForm, setPaymentForm] = useState({
    fullName: '',
    phoneNumber: '',
    transactionId: '',
    requestedSlots: 1,
    amount: '',
    remarks: ''
  });
  const [submittingRequest, setSubmittingRequest] = useState(false);
  const [requestMessage, setRequestMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    const loadProductsData = async () => {
      try {
        const result = await getDigitalProductsData();
        if (result.success && result.data) {
          setProductsData(result.data);
        }
      } catch (error) {
        console.error('Error loading digital products data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadProductsData();
  }, []);

  const handleBuyClick = (product, e) => {
    e.preventDefault();
    e.stopPropagation();
    setSelectedProductId(product.id || product.title || '');
    setRequestMessage({ type: '', text: '' });

    const panel = document.getElementById('payment-request-panel');
    if (panel) {
      panel.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const handleFilterClick = (category) => {
    setActiveFilter(category);
    setExpandedProductId(null);
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    setExpandedProductId(null);
  };

  const handleToggleExpand = (productId) => {
    setExpandedProductId((prev) => (prev === productId ? null : productId));
  };

  const handleImageError = (productKey) => {
    setBrokenImages((prev) => ({ ...prev, [productKey]: true }));
  };

  const displayTitle = productsData?.title || 'Digital Products';
  const displaySubtitle = productsData?.subtitle || 'Explore my collection of premium digital tools and assets';
  const products = productsData?.products || [];
  const accessSettings = {
    ...DEFAULT_ACCESS_SETTINGS,
    ...(productsData?.accessSettings || {})
  };
  const selectedProduct = products.find((product, index) => {
    const productKey = product.id || `${product.title}-${index}`;
    return String(productKey) === String(selectedProductId);
  }) || products[0] || null;

  const handlePaymentFormChange = (event) => {
    const { name, value } = event.target;
    setPaymentForm((prev) => ({
      ...prev,
      [name]: name === 'requestedSlots' ? value.replace(/[^\d]/g, '') : value
    }));
  };

  useEffect(() => {
    if (!selectedProduct && products.length > 0) {
      setSelectedProductId(products[0].id || products[0].title || '');
    }
  }, [products, selectedProduct]);

  useEffect(() => {
    if (!selectedProduct) {
      return;
    }

    setPaymentForm((prev) => ({
      ...prev,
      amount: prev.amount || String(selectedProduct.price || '').replace(/[^\d.]/g, ''),
      requestedSlots: prev.requestedSlots || 1
    }));
  }, [selectedProduct]);

  const handlePaymentSubmit = async (event) => {
    event.preventDefault();

    if (!selectedProduct) {
      setRequestMessage({ type: 'error', text: 'Please select a product first.' });
      return;
    }

    const fullName = paymentForm.fullName.trim();
    const phoneNumber = paymentForm.phoneNumber.trim();
    const transactionId = paymentForm.transactionId.trim();
    const requestedSlots = Math.max(1, Number.parseInt(paymentForm.requestedSlots, 10) || 1);
    const parsedAmount = paymentForm.amount ? Number(String(paymentForm.amount).replace(/[^\d.]/g, '')) : null;
    const amount = Number.isFinite(parsedAmount) ? parsedAmount : null;

    if (!fullName || !phoneNumber || !transactionId) {
      setRequestMessage({ type: 'error', text: 'Name, phone number, and transaction ID are required.' });
      return;
    }

    const requestPayload = {
      product_id: String(selectedProduct.id || selectedProduct.title || ''),
      product_title: selectedProduct.title || '',
      full_name: fullName,
      phone_number: phoneNumber,
      transaction_id: transactionId,
      payment_method: 'bank_transfer',
      requested_slots: requestedSlots,
      amount,
      iban_number: accessSettings.ibanNumber || '',
      account_holder_name: accessSettings.accountHolderName || '',
      remarks: paymentForm.remarks.trim(),
      status: 'pending',
      whatsapp_message_sent: false
    };
    const adminPhone = String(accessSettings.whatsappNumber || userData?.phone || '').replace(/[^0-9]/g, '');
    const whatsappMessage = [
      'Payment request submitted',
      `Product: ${selectedProduct.title}`,
      `Name: ${fullName}`,
      `Phone: ${phoneNumber}`,
      `Transaction ID: ${transactionId}`,
      `Requested Slots: ${requestedSlots}`,
      amount ? `Amount: ${amount}` : null
    ].filter(Boolean).join('\n');
    const whatsappUrl = adminPhone ? `https://wa.me/${adminPhone}?text=${encodeURIComponent(whatsappMessage)}` : '';
    const whatsappWindow = whatsappUrl ? window.open('about:blank', '_blank') : null;

    setSubmittingRequest(true);
    setRequestMessage({ type: '', text: '' });

    try {
      const result = await saveDigitalProductPaymentRequest(requestPayload);
      if (!result.success) {
        throw new Error(result.error || 'Failed to submit payment request.');
      }

      if (whatsappWindow && whatsappUrl) {
        whatsappWindow.location.href = whatsappUrl;
      }

      setRequestMessage({
        type: 'success',
        text: 'Payment request submitted. WhatsApp confirmation opened if a number is configured.'
      });
      setPaymentForm({
        fullName: '',
        phoneNumber: '',
        transactionId: '',
        requestedSlots: 1,
        amount: '',
        remarks: ''
      });
    } catch (error) {
      console.error('Error submitting payment request:', error);
      if (whatsappWindow && !whatsappWindow.closed) {
        whatsappWindow.close();
      }
      setRequestMessage({ type: 'error', text: error.message || 'Could not submit your request.' });
    } finally {
      setSubmittingRequest(false);
    }
  };

  if (loading) {
    return (
      <div className="digital-products-page">
        <div className="products-container">
          <div className="loading" style={{ color: 'var(--site-accent-color)', textAlign: 'center', marginTop: '50px' }}>Loading...</div>
        </div>
      </div>
    );
  }

  // Extract unique categories from products
  const allCategories = ['All', ...new Set(products.map(p => p.category).filter(Boolean))];
  const categories = allCategories.length > 1 ? allCategories : ['All'];

  // Filter products based on active filter
  const filteredProducts = products.filter((product) => {
    const matchesCategory = activeFilter === 'All' || product.category === activeFilter;
    const query = searchQuery.trim().toLowerCase();
    const matchesSearch = !query || [
      product.title,
      product.category,
      product.description
    ]
      .filter(Boolean)
      .some((field) => String(field).toLowerCase().includes(query));

    return matchesCategory && matchesSearch;
  });

  // Helper to extract YouTube embed URL
  const getYouTubeEmbedUrl = (url) => {
    if (!url) return null;
    let videoId = '';
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    if (match && match[2].length === 11) {
      videoId = match[2];
      return `https://www.youtube.com/embed/${videoId}`;
    }
    return null;
  };

  return (
    <div className="digital-products-page">
      <div className="products-container">
        <div className="products-header">
          <h1>{displayTitle}</h1>
          <p>{displaySubtitle}</p>
        </div>

        {accessSettings.enabled && (
          <div id="payment-request-panel" className="payment-panel">
            <div className="payment-panel-copy">
              <span className="payment-panel-tag">Access & Payments</span>
              <h2>{accessSettings.title}</h2>
              <p>{accessSettings.description}</p>
              <div className="payment-info-grid">
                {accessSettings.bankName && (
                  <div className="payment-info-card">
                    <span>Bank</span>
                    <strong>{accessSettings.bankName}</strong>
                  </div>
                )}
                {accessSettings.accountHolderName && (
                  <div className="payment-info-card">
                    <span>Account Holder</span>
                    <strong>{accessSettings.accountHolderName}</strong>
                  </div>
                )}
                {accessSettings.ibanNumber && (
                  <div className="payment-info-card">
                    <span>IBAN</span>
                    <strong>{accessSettings.ibanNumber}</strong>
                  </div>
                )}
                {accessSettings.slotLimit ? (
                  <div className="payment-info-card">
                    <span>Seat Limit</span>
                    <strong>{accessSettings.slotLimit} slots</strong>
                  </div>
                ) : null}
              </div>
              {accessSettings.instructions && <p className="payment-instructions">{accessSettings.instructions}</p>}
            </div>

            <form className="payment-form" onSubmit={handlePaymentSubmit}>
              <div className="payment-form-row">
                <label>
                  Product
                  <select
                    name="selectedProduct"
                    value={selectedProduct?.id || selectedProduct?.title || ''}
                    onChange={(event) => setSelectedProductId(event.target.value)}
                  >
                    {products.map((product, index) => {
                      const productKey = product.id || `${product.title}-${index}`;
                      return (
                        <option key={productKey} value={productKey}>
                          {product.title}
                        </option>
                      );
                    })}
                  </select>
                </label>
                <label>
                  Slots
                  <input
                    type="number"
                    name="requestedSlots"
                    min="1"
                    value={paymentForm.requestedSlots}
                    onChange={handlePaymentFormChange}
                  />
                </label>
              </div>
              <div className="payment-form-row">
                <label>
                  Full Name
                  <input type="text" name="fullName" value={paymentForm.fullName} onChange={handlePaymentFormChange} />
                </label>
                <label>
                  Phone Number
                  <input type="text" name="phoneNumber" value={paymentForm.phoneNumber} onChange={handlePaymentFormChange} />
                </label>
              </div>
              <div className="payment-form-row">
                <label>
                  Transaction ID
                  <input type="text" name="transactionId" value={paymentForm.transactionId} onChange={handlePaymentFormChange} />
                </label>
                <label>
                  Amount
                  <input type="text" name="amount" value={paymentForm.amount} onChange={handlePaymentFormChange} />
                </label>
              </div>
              <label className="payment-form-notes">
                Remarks
                <textarea name="remarks" rows="3" value={paymentForm.remarks} onChange={handlePaymentFormChange} />
              </label>
              {requestMessage.text && (
                <div className={`payment-message ${requestMessage.type}`}>{requestMessage.text}</div>
              )}
              <button type="submit" className="buy-btn" disabled={submittingRequest}>
                <FaWhatsapp className="btn-icon" />
                {submittingRequest ? 'Submitting...' : 'Submit Payment & WhatsApp'}
              </button>
            </form>
          </div>
        )}
        
        {products.length > 0 ? (
          <>
            <div className="products-filters">
              {categories.map((category, index) => (
                <button
                  key={index}
                  className={`filter-btn ${activeFilter === category ? 'active' : ''}`}
                  onClick={() => handleFilterClick(category)}
                >
                  {category}
                </button>
              ))}
            </div>

            <div className="products-search-wrap">
              <input
                type="text"
                value={searchQuery}
                onChange={handleSearchChange}
                placeholder="Search products by title, category, or description..."
                className="products-search-input"
              />
            </div>
            
            {filteredProducts.length > 0 ? (
              <div className="products-grid">
                {filteredProducts.map((product, index) => {
                  const embedUrl = getYouTubeEmbedUrl(product.videoUrl);
                  const formattedPrice = formatCurrency(product.price, 'digital-products', '');
                  const productKey = product.id || `${product.title}-${index}`;
                  const showVisualMedia = product.displayMode !== 'text';
                  const shouldShowImage =
                    showVisualMedia &&
                    Boolean(product.imageUrl) &&
                    !brokenImages[productKey];
                  const isHot = index === 0; // The first product gets a "HOT" badge
                  const isPremiumPrice = Boolean(formattedPrice && /\d/.test(formattedPrice));
                  const isPremium = index === 1 || isPremiumPrice; // Others might get Premium
                  const isExpanded = expandedProductId === productKey;
                  
                  return (
                  <div key={productKey} className="product-card" style={{ position: 'relative' }}>
                    {isHot && <div className="product-badge">HOT</div>}
                    {!isHot && isPremium && <div className="product-badge premium">PREMIUM</div>}
                  <div className="product-image">
                    {showVisualMedia && embedUrl ? (
                      <iframe
                          width="100%"
                          height="100%"
                          src={embedUrl}
                          title={product.title}
                          frameBorder="0"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                          style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}
                        ></iframe>
                    ) : shouldShowImage ? (
                      <img 
                        src={product.imageUrl} 
                        alt={product.title}
                        loading="lazy"
                        decoding="async"
                        onError={() => handleImageError(productKey)}
                        className="product-img"
                      />
                    ) : (
                        <div className="product-default-bg">
                          <h3>{product.title}</h3>
                          <p>{product.category}</p>
                        </div>
                      )}
                    </div>
                    <div className="product-content">
                      <div className="product-category">{product.category}</div>
                      <div className="product-header-row">
                        <h3 className="product-title">{product.title}</h3>
                        {product.showPrice !== false && <div className="product-price">{formattedPrice}</div>}
                      </div>
                      <button
                        className="expand-btn"
                        onClick={() => handleToggleExpand(productKey)}
                        type="button"
                        aria-expanded={isExpanded}
                      >
                        {isExpanded ? 'Hide Details' : 'View Details'}
                      </button>

                      <div className={`product-expandable ${isExpanded ? 'open' : ''}`}>
                        <p className="product-description">{product.description}</p>
                        <button className="buy-btn" onClick={(e) => handleBuyClick(product, e)}>
                          <FaWhatsapp className="btn-icon" /> Buy Now
                        </button>
                      </div>
                    </div>
                  </div>
                  );
                })}
              </div>
            ) : (
              <div className="products-no-results">
                No products found for "{searchQuery.trim()}".
              </div>
            )}
          </>
        ) : (
          <div style={{ textAlign: 'center', color: 'var(--site-sidebar-muted-text-color)', marginTop: '50px' }}>
            <p>No digital products available yet. Please check back later.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default DigitalProducts;


