import React, { useState } from 'react';
import { FaGithub, FaSearch, FaCopy, FaCheck, FaImage } from 'react-icons/fa';
import './GitHubImagePicker.css';

const GitHubImagePicker = ({ onImageSelect, currentImage, label = "Select Image" }) => {
  const [githubUrl, setGithubUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

  // Convert GitHub raw URL to proper format
  const convertToRawUrl = (url) => {
    if (url.includes('github.com') && !url.includes('raw.githubusercontent.com')) {
      return url.replace('github.com', 'raw.githubusercontent.com').replace('/blob/', '/');
    }
    return url;
  };

  const getGoogleDriveImageUrl = (url) => {
    const patterns = [
      /drive\.google\.com\/file\/d\/([^/]+)/,
      /drive\.google\.com\/open\?id=([^&]+)/,
      /drive\.google\.com\/uc\?(?:.*&)?id=([^&]+)/,
      /drive\.google\.com\/thumbnail\?(?:.*&)?id=([^&]+)/
    ];

    for (const pattern of patterns) {
      const match = url.match(pattern);
      if (match && match[1]) {
        return `https://drive.google.com/thumbnail?id=${match[1]}&sz=w1600`;
      }
    }

    return null;
  };

  // Extract YouTube video ID and get thumbnail
  const getYouTubeThumbnail = (url) => {
    let videoId = '';

    // Regular expressions for different YouTube URL formats
    const patterns = [
      /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&?\/]+)/,
      /^([^&?\/]+)$/ // Case where user might just paste the ID (less likely but possible)
    ];

    for (const pattern of patterns) {
      const match = url.match(pattern);
      if (match && match[1]) {
        videoId = match[1];
        break;
      }
    }

    if (videoId) {
      // Try max resolution first
      return `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
    }
    return null;
  };

  const testImageUrl = (url) => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve(true);
      img.onerror = () => reject(new Error('Image could not be loaded'));
      img.src = url;
    });
  };

  const handleUrlSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      let finalUrl = githubUrl;
      const isYouTube = githubUrl.includes('youtube.com') || githubUrl.includes('youtu.be');
      const isGoogleDrive = githubUrl.includes('drive.google.com');

      if (isYouTube) {
        const thumbnailUrl = getYouTubeThumbnail(githubUrl);
        if (thumbnailUrl) {
          finalUrl = thumbnailUrl;
        } else {
          throw new Error('Invalid YouTube URL');
        }
      } else if (isGoogleDrive) {
        const driveImageUrl = getGoogleDriveImageUrl(githubUrl);
        if (driveImageUrl) {
          finalUrl = driveImageUrl;
        } else {
          throw new Error('Invalid Google Drive URL');
        }
      } else {
        finalUrl = convertToRawUrl(githubUrl);
      }

      // Test if image exists
      try {
        await testImageUrl(finalUrl);
        onImageSelect(finalUrl);
        setGithubUrl('');
        setError('');
      } catch (imageError) {
        if (isYouTube) {
        // Fallback for YouTube: sometimes maxresdefault doesn't exist, try hqdefault
          const hqUrl = finalUrl.replace('maxresdefault.jpg', 'hqdefault.jpg');
          await testImageUrl(hqUrl);
          onImageSelect(hqUrl);
          setGithubUrl('');
          setError('');
        } else {
          setError('Image not found or URL is invalid');
        }
      }
    } catch (err) {
      setError(err.message || 'Failed to load image. Please check the URL.');
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const exampleUrls = [
    'https://github.com/username/repo/blob/main/images/image.jpg',
    'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    'https://youtu.be/dQw4w9WgXcQ',
    'https://drive.google.com/file/d/1yQtyqcrbkDdxp4en_sRaixAyZbDoLp-k/view?usp=sharing'
  ];

  return (
    <div className="github-image-picker">
      <div className="picker-header">
        <FaGithub className="github-icon" />
        <h3>{label}</h3>
      </div>

      {currentImage && (
        <div className="current-image">
          <img src={currentImage} alt="Current" />
          <div className="image-actions">
            <button
              onClick={() => copyToClipboard(currentImage)}
              className="copy-btn"
            >
              {copied ? <FaCheck /> : <FaCopy />}
              {copied ? 'Copied!' : 'Copy URL'}
            </button>
          </div>
        </div>
      )}

      <form onSubmit={handleUrlSubmit} className="url-form">
        <div className="input-group">
          <FaGithub className="input-icon" />
          <input
            type="text"
            value={githubUrl}
            onChange={(e) => setGithubUrl(e.target.value)}
            placeholder="Paste GitHub image URL, YouTube video link, or Google Drive image link..."
            className="url-input"
            required
          />
          <button
            type="submit"
            className="search-btn"
            disabled={isLoading}
          >
            {isLoading ? 'Loading...' : <FaSearch />}
          </button>
        </div>

        {error && <div className="error-message">{error}</div>}
      </form>

      <div className="examples">
        <h4>Example URLs:</h4>
        <div className="example-list">
          {exampleUrls.map((url, index) => (
            <div key={index} className="example-item">
              <code>{url}</code>
              <button
                onClick={() => copyToClipboard(url)}
                className="copy-example-btn"
              >
                <FaCopy />
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="instructions">
        <h4>How to use:</h4>
        <ol>
          <li><strong>GitHub:</strong> Copy image URL from repo and paste above</li>
          <li><strong>YouTube:</strong> Paste any YouTube video link to use its thumbnail</li>
          <li><strong>Google Drive:</strong> Paste a public image share link with Anyone with the link can view</li>
          <li>Click the search button to load the image/thumbnail</li>
        </ol>
      </div>
    </div>
  );
};

export default GitHubImagePicker;

