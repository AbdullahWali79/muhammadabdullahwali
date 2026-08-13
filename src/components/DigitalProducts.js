import React, { useState, useEffect, useMemo } from 'react';
import {
  getDigitalProductsData,
  getDigitalProductPaymentRequests,
  saveDigitalProductPaymentRequest
} from '../services/supabaseService';
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

const DigitalProducts = ({ userData }) => {
  const [activeFilter, setActiveFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeAccess, setActiveAccess] = useState(ACCESS_MODES.SHARED);
  const [productsData, setProductsData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [requestsLoading, setRequestsLoading] = useState(true);
  const [paymentRequests, setPaymentRequests] = useState([]);
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

  useEffect(() => {
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

    loadPaymentRequests();
  }, []);

  const handleCardAction = (product, accessMode, e) => {
    e.preventDefault();
    e.stopPropagation();

    if (accessMode === ACCESS_MODES.SHARED) {
      setSelectedProductId(product.id || product.title || '');
      setRequestMessage({ type: '', text: '' });

      const panel = document.getElementById('payment-request-panel');
      if (panel) {
        panel.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
      return;
    }

    if (product.sourceUrl) {
      window.open(product.sourceUrl, '_blank', 'noopener,noreferrer');
    }
  };

  const handleFilterClick = (category) => {
    setActiveFilter(category);
    setExpandedProductId(null);
  };

  const handleAccessModeChange = (mode) => {
    setActiveAccess(mode);
    setExpandedProductId(null);
    setRequestMessage({ type: '', text: '' });
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
  const whatsappNumber = String(
    accessSettings.whatsappNumber || userData?.phone || '+923046983794'
  ).replace(/\D/g, '');

  const getProductWhatsAppUrl = (product, formattedPrice) => {
    const message = [
      'Hello Muhammad Abdullah, I am interested in buying this digital product:',
      '',
      `Product: ${product.title || 'Digital Product'}`,
      product.category ? `Category: ${product.category}` : null,
      product.showPrice !== false && formattedPrice ? `Listed Price: ${formattedPrice}` : null,
      product.description ? `Details: ${product.description}` : null,
      '',
      'Please share the purchase details and final price.'
    ].filter((line) => line !== null).join('\n');

    return `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
  };

  const sharedProducts = useMemo(
    () => products.filter((product) => getProductAccessMode(product) === ACCESS_MODES.SHARED),
    [products]
  );
  const privateProducts = useMemo(
    () => products.filter((product) => getProductAccessMode(product) !== ACCESS_MODES.SHARED),
    [products]
  );
  const visibleProducts = activeAccess === ACCESS_MODES.SHARED ? sharedProducts : privateProducts;
  const selectedProduct = visibleProducts.find((product, index) => {
    const productKey = product.id || `${product.title}-${index}`;
    return String(productKey) === String(selectedProductId);
  }) || visibleProducts[0] || null;

  const getReservedSlots = (product) => {
    if (!product) {
      return 0;
    }

    const productKey = String(product.id || product.title || '');
    return paymentRequests
      .filter((request) => {
        const requestKey = String(request.product_id || request.product_title || '');
        return requestKey === productKey && ['pending', 'approved'].includes(request.status);
      })
      .reduce((total, request) => total + (Number.parseInt(request.requested_slots, 10) || 1), 0);
  };

  const getRemainingSlots = (product) => {
    const limit = Number.parseInt(product?.slotLimit, 10) || Number.parseInt(accessSettings.slotLimit, 10) || 0;
    return Math.max(0, limit - getReservedSlots(product));
  };

  const handlePaymentFormChange = (event) => {
    const { name, value } = event.target;
    setPaymentForm((prev) => ({
      ...prev,
      [name]: name === 'requestedSlots' ? value.replace(/[^\d]/g, '') : value
    }));
  };

  useEffect(() => {
    if (!selectedProduct && visibleProducts.length > 0) {
      setSelectedProductId(visibleProducts[0].id || visibleProducts[0].title || '');
    }
  }, [visibleProducts, selectedProduct]);

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
    const remainingSlots = getRemainingSlots(selectedProduct);

    if (!fullName || !phoneNumber || !transactionId) {
      setRequestMessage({ type: 'error', text: 'Name, phone number, and transaction ID are required.' });
      return;
    }

    if (requestedSlots > remainingSlots) {
      setRequestMessage({
        type: 'error',
        text: `Only ${remainingSlots} slot${remainingSlots === 1 ? '' : 's'} remaining for this product.`
      });
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
  const allCategories = ['All', ...new Set(visibleProducts.map((p) => p.category).filter(Boolean))];
  const categories = allCategories.length > 1 ? allCategories : ['All'];

  // Filter products based on active filter
  const filteredProducts = visibleProducts.filter((product) => {
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

        <div className="access-mode-switcher" role="tablist" aria-label="Access modes">
          <button
            type="button"
            className={`access-mode-btn ${activeAccess === ACCESS_MODES.PRIVATE ? 'active' : ''}`}
            onClick={() => handleAccessModeChange(ACCESS_MODES.PRIVATE)}
          >
            Private Access
          </button>
          <button
            type="button"
            className={`access-mode-btn ${activeAccess === ACCESS_MODES.SHARED ? 'active' : ''}`}
            onClick={() => handleAccessModeChange(ACCESS_MODES.SHARED)}
          >
            Shared Access
          </button>
        </div>

        {activeAccess === ACCESS_MODES.SHARED && (
          <div id="payment-request-panel" className="payment-panel">
          <div className="payment-panel-copy">
            <span className="payment-panel-tag">Access & Payments</span>
            <h2>{accessSettings.title || 'Shared Access'}</h2>
            <p>{accessSettings.description || 'Choose a shared product, submit payment details, and reserve your slot.'}</p>
            {!accessSettings.enabled && (
              <p className="payment-panel-note">
                Shared access is visible. Turn on the panel from the admin editor if you want to publish it.
              </p>
            )}
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
                  {sharedProducts.map((product, index) => {
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
        {activeAccess === ACCESS_MODES.PRIVATE && (
          <div className="private-access-banner">
            Private tools are shown below. These do not require payment booking.
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

            {visibleProducts.length === 0 ? (
              <div className="products-no-results">
                {activeAccess === ACCESS_MODES.SHARED
                  ? 'No shared products are published yet. Set the product Access Type to Shared in the admin editor and save.'
                  : 'No private products are available yet.'}
              </div>
            ) : filteredProducts.length > 0 ? (
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
                  const isHot = index === 0;
                  const isPremiumPrice = Boolean(formattedPrice && /\d/.test(formattedPrice));
                  const isPremium = index === 1 || isPremiumPrice;
                  const accessMode = getProductAccessMode(product);
                  const remainingSlots = accessMode === ACCESS_MODES.SHARED ? getRemainingSlots(product) : null;
                  const isExpanded = expandedProductId === productKey;
                  const cardClassName = `product-card ${accessMode === ACCESS_MODES.SHARED ? 'shared-card' : 'private-card'}`;
                  const productSummary =
                    accessMode === ACCESS_MODES.SHARED
                      ? `${remainingSlots > 0 ? `${remainingSlots} slots available` : 'Fully booked'}`
                      : 'Private access tool';
                  
                  return (
                  <div key={productKey} className={cardClassName} style={{ position: 'relative' }}>
                    <div className={`product-access-badge ${accessMode}`}>
                      {accessMode === ACCESS_MODES.SHARED ? 'Shared Access' : 'Private Access'}
                    </div>
                    {isHot && <div className="product-badge">HOT</div>}
                    {!isHot && isPremium && <div className="product-badge premium">PREMIUM</div>}
                    <div className={`product-card-top ${accessMode === ACCESS_MODES.SHARED ? 'shared-top' : 'private-top'}`}>
                      <div className="product-hero-copy">
                        <div className="product-category">{product.category}</div>
                        <h3 className="product-title">{product.title}</h3>
                        <p className="product-summary">{productSummary}</p>
                        {product.showPrice !== false && <div className="product-price">{formattedPrice}</div>}
                      </div>
                      {showVisualMedia && (embedUrl || shouldShowImage) ? (
                        <div className="product-image">
                          {embedUrl ? (
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
                          ) : (
                            <img
                              src={product.imageUrl}
                              alt={product.title}
                              loading="lazy"
                              decoding="async"
                              onError={() => handleImageError(productKey)}
                              className="product-img"
                            />
                          )}
                        </div>
                      ) : (
                        <div className="product-mini-fallback">
                          <h4>{product.title}</h4>
                          <p>{product.category}</p>
                        </div>
                      )}
                    </div>
                    <div className="product-content">
                      {accessMode === ACCESS_MODES.SHARED && (
                        <div className="product-slot-pill">
                          {remainingSlots > 0 ? `${remainingSlots} slots available` : 'Fully booked'}
                        </div>
                      )}
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
                        {accessMode === ACCESS_MODES.SHARED ? (
                          <button
                            type="button"
                            className="buy-btn"
                            onClick={(e) => handleCardAction(product, accessMode, e)}
                            disabled={remainingSlots === 0}
                          >
                            <FaWhatsapp className="btn-icon" />
                            {remainingSlots === 0 ? 'Fully Booked' : 'Book Slot'}
                          </button>
                        ) : (
                          <button
                            type="button"
                            className="buy-btn private-btn"
                            onClick={(e) => handleCardAction(product, accessMode, e)}
                          >
                            Open Tool
                          </button>
                        )}
                        <a
                          className="buy-btn product-whatsapp-btn"
                          href={getProductWhatsAppUrl(product, formattedPrice)}
                          target="_blank"
                          rel="noopener noreferrer"
                          aria-label={`Buy ${product.title || 'digital product'} through WhatsApp`}
                        >
                          <FaWhatsapp className="btn-icon" />
                          Buy Digital Product
                        </a>
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


