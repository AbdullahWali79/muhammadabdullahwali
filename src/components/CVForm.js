import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import GitHubImagePicker from './GitHubImagePicker';
import { saveUserData } from '../services/supabaseService';
import { FaSave, FaEye, FaDownload, FaDatabase } from 'react-icons/fa';
import { generatePDF } from '../utils/pdfGenerator';
import { initializeDataDirectly, testDatabaseConnection } from '../utils/directDataInit';
import './CVForm.css';

const CVForm = ({ userData, setUserData }) => {
  const [formData, setFormData] = useState(userData);
  const [isPreview, setIsPreview] = useState(false);
  const [initMessage, setInitMessage] = useState('');
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageSelect = (imageUrl) => {
    setFormData(prev => ({
      ...prev,
      profileImage: imageUrl
    }));
  };

  const handleSave = async () => {
    try {
      // Prepare data for Supabase
      const userDataForSupabase = {
        first_name: formData.firstName,
        last_name: formData.lastName,
        title: formData.title,
        date_of_birth: formData.dateOfBirth,
        nationality: formData.nationality,
        phone: formData.phone,
        email: formData.email,
        address: formData.address,
        languages: formData.languages,
        profile_image: formData.profileImage,
        summary: formData.summary
      };

      const result = await saveUserData(userDataForSupabase);
      
      if (result.success) {
        setUserData(formData);
        alert('CV data saved to Supabase successfully! Redirecting to home page...');
        navigate('/');
      } else {
        alert('Error saving data: ' + result.error);
      }
    } catch (error) {
      console.error('Error saving CV data:', error);
      alert('Error saving data. Please try again.');
    }
  };

  const handlePreview = () => {
    setIsPreview(!isPreview);
  };

  const handleDownload = () => {
    generatePDF(formData);
  };

  const handleTestConnection = async () => {
    setInitMessage('Testing database connection...');
    try {
      const result = await testDatabaseConnection();
      if (result.success) {
        setInitMessage('✅ Database connection successful!');
      } else {
        setInitMessage('❌ Connection failed: ' + result.error);
      }
    } catch (error) {
      setInitMessage('❌ Connection error: ' + error.message);
    }
  };

  const handleInitializeData = async () => {
    setInitMessage('Initializing database...');
    try {
      const result = await initializeDataDirectly();
      if (result.success) {
        setInitMessage('✅ Database initialized successfully! Check your Supabase dashboard.');
      } else {
        setInitMessage('❌ Error: ' + result.error);
      }
    } catch (error) {
      setInitMessage('❌ Error: ' + error.message);
    }
  };

  if (isPreview) {
    return (
      <div className="cv-form">
        <div className="form-header">
          <h1>CV Preview</h1>
          <div className="form-actions">
            <button className="btn btn-secondary" onClick={handlePreview}>
              <FaEye /> Edit Form
            </button>
            <button className="btn btn-primary" onClick={handleDownload}>
              <FaDownload /> Download PDF
            </button>
          </div>
        </div>
        
        <div className="cv-preview">
          <div className="preview-hero">
            <div className="preview-badge">HELLO</div>
            <div className="preview-content">
              <div className="preview-image">
                {formData.profileImage ? (
                  <img src={formData.profileImage} alt="Profile" />
                ) : (
                  <div className="preview-avatar">
                    {formData.firstName.charAt(0)}{formData.lastName.charAt(0)}
                  </div>
                )}
              </div>
              <div className="preview-text">
                <h1>{formData.firstName} {formData.lastName}</h1>
                <p>{formData.summary}</p>
              </div>
            </div>
          </div>
          
          <div className="preview-info">
            <div className="preview-grid">
              <div className="preview-column">
                <div className="preview-item">
                  <span className="preview-label">First Name:</span>
                  <span className="preview-value">{formData.firstName}</span>
                </div>
                <div className="preview-item">
                  <span className="preview-label">Date of Birth:</span>
                  <span className="preview-value">{formData.dateOfBirth}</span>
                </div>
                <div className="preview-item">
                  <span className="preview-label">Phone:</span>
                  <span className="preview-value">{formData.phone}</span>
                </div>
                <div className="preview-item">
                  <span className="preview-label">Address:</span>
                  <span className="preview-value">{formData.address}</span>
                </div>
              </div>
              
              <div className="preview-column">
                <div className="preview-item">
                  <span className="preview-label">Last Name:</span>
                  <span className="preview-value">{formData.lastName}</span>
                </div>
                <div className="preview-item">
                  <span className="preview-label">Nationality:</span>
                  <span className="preview-value">{formData.nationality}</span>
                </div>
                <div className="preview-item">
                  <span className="preview-label">Email:</span>
                  <span className="preview-value">{formData.email}</span>
                </div>
                <div className="preview-item">
                  <span className="preview-label">Languages:</span>
                  <span className="preview-value">{formData.languages}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="cv-form">
      <div className="form-header">
        <h1>Create Your CV</h1>
        <div className="form-actions">
          <button className="btn btn-secondary" onClick={handleSave}>
            <FaSave /> Save Data
          </button>
          <button className="btn btn-primary" onClick={handlePreview}>
            <FaEye /> Preview CV
          </button>
        </div>
      </div>

      <form className="form-content">
        <div className="form-section">
          <h2>Personal Information</h2>
          <div className="form-row">
            <div className="form-group">
              <label>First Name *</label>
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="form-group">
              <label>Last Name *</label>
              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleInputChange}
                required
              />
            </div>
          </div>
          
          <div className="form-row">
            <div className="form-group">
              <label>Professional Title *</label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="form-group">
              <label>Date of Birth</label>
              <input
                type="text"
                name="dateOfBirth"
                value={formData.dateOfBirth}
                onChange={handleInputChange}
                placeholder="e.g., October 26, 1995"
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Nationality</label>
              <input
                type="text"
                name="nationality"
                value={formData.nationality}
                onChange={handleInputChange}
              />
            </div>
            <div className="form-group">
              <label>Languages</label>
              <input
                type="text"
                name="languages"
                value={formData.languages}
                onChange={handleInputChange}
                placeholder="e.g., English, Spanish"
              />
            </div>
          </div>
        </div>

        <div className="form-section">
          <h2>Contact Information</h2>
          <div className="form-row">
            <div className="form-group">
              <label>Phone Number *</label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="form-group">
              <label>Email Address *</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                required
              />
            </div>
          </div>
          
          <div className="form-group">
            <label>Address</label>
            <input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleInputChange}
            />
          </div>
        </div>

        <div className="form-section">
          <h2>Profile Image</h2>
          <div className="form-group">
            <GitHubImagePicker
              label="Profile Picture"
              currentImage={formData.profileImage}
              onImageSelect={handleImageSelect}
            />
          </div>
        </div>

        <div className="form-section">
          <h2>Professional Summary</h2>
          <div className="form-group">
            <label>About You *</label>
            <textarea
              name="summary"
              value={formData.summary}
              onChange={handleInputChange}
              rows="4"
              placeholder="Write a brief summary about yourself and your professional experience..."
              required
            />
          </div>
        </div>
      </form>

      {/* Database Management Section */}
      <div className="database-section">
        <h3>Database Management</h3>
        <div className="database-buttons">
          <button className="btn btn-secondary" onClick={handleTestConnection} style={{backgroundColor: '#17a2b8', borderColor: '#17a2b8'}}>
            <FaDatabase className="btn-icon" />
            Test Connection
          </button>
          <button className="btn btn-secondary" onClick={handleInitializeData} style={{backgroundColor: '#28a745', borderColor: '#28a745'}}>
            <FaDatabase className="btn-icon" />
            Initialize Database
          </button>
        </div>
        
        {initMessage && (
          <div style={{ 
            marginTop: '20px', 
            padding: '10px', 
            backgroundColor: initMessage.includes('✅') ? '#d4edda' : '#f8d7da',
            color: initMessage.includes('✅') ? '#155724' : '#721c24',
            borderRadius: '5px',
            textAlign: 'center'
          }}>
            {initMessage}
          </div>
        )}
      </div>
    </div>
  );
};

export default CVForm;

