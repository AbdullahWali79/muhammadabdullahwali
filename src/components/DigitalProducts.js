import React, { useState, useEffect } from 'react';
import { getDigitalProductsData } from '../services/supabaseService';
import { FaShoppingCart, FaWhatsapp } from 'react-icons/fa';
import './DigitalProducts.css';

const DigitalProducts = ({ userData }) => {
  const [activeFilter, setActiveFilter] = useState('All');
  const [productsData, setProductsData] = useState(null);
  const [loading, setLoading] = useState(true);

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
    
    // Format the phone number (remove +, spaces, hyphens)
    const phone = (userData?.phone || '+923046983794').replace(/[^0-9]/g, '');
    
    // Construct the message
    const message = `Hello, I'm interested in buying your digital product: "${product.title}" listed for ${product.price}.`;
    const encodedMessage = encodeURIComponent(message);
    
    // Redirect to WhatsApp
    window.open(`https://wa.me/${phone}?text=${encodedMessage}`, '_blank');
  };

  if (loading) {
    return (
      <div className="digital-products-page">
        <div className="products-container">
          <div className="loading" style={{ color: '#00CED1', textAlign: 'center', marginTop: '50px' }}>Loading...</div>
        </div>
      </div>
    );
  }

  const displayTitle = productsData?.title || 'Digital Products';
  const displaySubtitle = productsData?.subtitle || 'Explore my collection of premium digital tools and assets';
  const products = productsData?.products || [];

  // Extract unique categories from products
  const allCategories = ['All', ...new Set(products.map(p => p.category).filter(Boolean))];
  const categories = allCategories.length > 1 ? allCategories : ['All'];

  // Filter products based on active filter
  const filteredProducts = activeFilter === 'All' 
    ? products 
    : products.filter(product => product.category === activeFilter);

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
            
            <div className="products-grid">
              {filteredProducts.map((product, index) => {
                const embedUrl = getYouTubeEmbedUrl(product.videoUrl);
                const isHot = index === 0; // The first product gets a "HOT" badge
                const isPremium = index === 1 || product.price?.includes('$'); // Others might get Premium
                
                return (
                <div key={product.id} className="product-card" style={{ position: 'relative' }}>
                  {isHot && <div className="product-badge">HOT 🔥</div>}
                  {!isHot && isPremium && <div className="product-badge" style={{ background: 'linear-gradient(135deg, #FFD700, #FDB931)' }}>PREMIUM 💎</div>}
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
                    ) : product.imageUrl ? (
                      <img 
                        src={product.imageUrl} 
                        alt={product.title}
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
                      {product.showPrice !== false && <div className="product-price">{product.price}</div>}
                    </div>
                    <p className="product-description">{product.description}</p>
                    <button className="buy-btn" onClick={(e) => handleBuyClick(product, e)}>
                      <FaWhatsapp className="btn-icon" /> Buy Now
                    </button>
                  </div>
                </div>
                );
              })}
            </div>
          </>
        ) : (
          <div style={{ textAlign: 'center', color: '#B0B0B0', marginTop: '50px' }}>
            <p>No digital products available yet. Please check back later.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default DigitalProducts;
