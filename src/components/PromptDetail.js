import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaCopy, FaCheck, FaTerminal } from 'react-icons/fa';
import { getPromptsData } from '../services/supabaseService';
import './PromptDetail.css';

// Helper to extract YouTube video ID to create embed URL
const getYouTubeEmbedUrl = (url) => {
  if (!url) return null;
  
  let videoId = '';
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = url.match(regExp);

  if (match && match[2].length === 11) {
    videoId = match[2];
  } else {
    return null;
  }

  return `https://www.youtube.com/embed/${videoId}?rel=0`;
};

const PromptDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [prompt, setPrompt] = useState(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const loadPromptDetails = async () => {
      try {
        const result = await getPromptsData();
        if (result.success && result.data && result.data.prompts) {
          const foundPrompt = result.data.prompts.find(p => p.id.toString() === id);
          if (foundPrompt) {
            setPrompt(foundPrompt);
          } else {
            console.error('Prompt not found');
            navigate('/prompts'); // Redirect back if not found
          }
        }
      } catch (error) {
        console.error('Error loading prompt details:', error);
      } finally {
        setLoading(false);
      }
    };

    loadPromptDetails();
  }, [id, navigate]);

  const handleCopy = () => {
    if (prompt && prompt.content) {
      navigator.clipboard.writeText(prompt.content)
        .then(() => {
          setCopied(true);
          setTimeout(() => setCopied(false), 2000);
        })
        .catch(err => {
          console.error('Failed to copy text: ', err);
        });
    }
  };

  if (loading) {
    return (
      <div className="prompt-detail-page">
        <div className="prompt-detail-container">
          <div className="loading" style={{ color: 'var(--site-accent-color)', textAlign: 'center', marginTop: '50px' }}>Loading...</div>
        </div>
      </div>
    );
  }

  if (!prompt) {
    return null; // Will redirect in useEffect
  }

  const embedUrl = getYouTubeEmbedUrl(prompt.youtubeUrl);

  return (
    <div className="prompt-detail-page">
      <div className="prompt-detail-container">
        <button className="back-btn" onClick={() => navigate('/prompts')}>
          <FaArrowLeft /> Back to Prompts
        </button>

        <div className="prompt-detail-content">
          {embedUrl && (
            <div className="video-container">
              <iframe 
                src={embedUrl}
                title={prompt.title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                allowFullScreen
              ></iframe>
            </div>
          )}
          
          <div className="prompt-info">
            <div className="prompt-detail-category">{prompt.category}</div>
            <h1 className="prompt-detail-title">{prompt.title}</h1>
            
            {prompt.description && (
              <p className="prompt-detail-description">{prompt.description}</p>
            )}
            
            <h2 className="prompt-section-title">
              <FaTerminal /> Required Prompt
            </h2>
            
            <div className="prompt-code-container">
              <div className="prompt-code-header">
                <span className="prompt-code-label">system_prompt.txt</span>
                <button 
                  className={`copy-btn ${copied ? 'copied' : ''}`} 
                  onClick={handleCopy}
                  title="Copy to clipboard"
                >
                  {copied ? <><FaCheck /> Copied!</> : <><FaCopy /> Copy Prompt</>}
                </button>
              </div>
              <pre className="prompt-code-content">
                {prompt.content}
              </pre>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PromptDetail;

