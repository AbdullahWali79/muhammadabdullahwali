import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaExternalLinkAlt, FaGithub, FaCalendarAlt, FaUser, FaTag } from 'react-icons/fa';
import { getPortfolioData } from '../services/supabaseService';
import './PortfolioDetail.css';

const PortfolioDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadProject = async () => {
      try {
        const result = await getPortfolioData();
        if (result.success && result.data && result.data.projects) {
          // Find project by ID
          const foundProject = result.data.projects.find(p => p.id === parseInt(id));
          if (foundProject) {
            setProject(foundProject);
          }
        }
      } catch (error) {
        console.error('Error loading project:', error);
      } finally {
        setLoading(false);
      }
    };

    loadProject();
  }, [id]);

  if (loading) {
    return (
      <div className="portfolio-detail">
        <div className="portfolio-detail-container">
          <div className="loading" style={{ textAlign: 'center', padding: '40px', color: '#00CED1' }}>
            Loading project...
          </div>
        </div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="portfolio-detail">
        <div className="portfolio-detail-container">
          <div className="error-message">
            <h1>Project Not Found</h1>
            <p>The project you're looking for doesn't exist.</p>
            <button className="back-btn" onClick={() => navigate('/portfolio')}>
              <FaArrowLeft className="btn-icon" />
              Back to Portfolio
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Fallback data for missing fields
  const projectData = {
    title: project.title || 'Untitled Project',
    category: project.category || 'Uncategorized',
    description: project.description || '',
    fullDescription: project.fullDescription || project.description || 'No detailed description available.',
    image: project.image || 'https://raw.githubusercontent.com/AbdullahWali79/AbdullahImages/main/Protfolio.jpeg',
    technologies: project.technologies || [],
    link: project.link || '#',
    githubUrl: project.githubUrl || project.link || '#',
    liveUrl: project.liveUrl || project.link || '#',
    startDate: project.startDate || 'N/A',
    endDate: project.endDate || 'N/A',
    status: project.status || 'In Progress',
    client: project.client || 'Personal Project',
    role: project.role || 'Developer'
  };

  const handleBackClick = () => {
    navigate('/portfolio');
  };

  const handleLiveClick = () => {
    if (projectData.liveUrl && projectData.liveUrl !== '#') {
      window.open(projectData.liveUrl, '_blank');
    }
  };

  const handleGithubClick = () => {
    if (projectData.githubUrl && projectData.githubUrl !== '#') {
      window.open(projectData.githubUrl, '_blank');
    }
  };

  return (
    <div className="portfolio-detail">
      <div className="portfolio-detail-container">
        <button className="back-btn" onClick={handleBackClick}>
          <FaArrowLeft className="btn-icon" />
          Back to Portfolio
        </button>

        <article className="project-article">
          <div className="project-header">
            <div className="project-category">{projectData.category}</div>
            <h1 className="project-title">{projectData.title}</h1>
            
            {(projectData.startDate !== 'N/A' || projectData.role !== 'Developer' || projectData.status !== 'In Progress') && (
              <div className="project-meta">
                {projectData.startDate !== 'N/A' && (
                  <div className="meta-item">
                    <FaCalendarAlt className="meta-icon" />
                    <span>{projectData.startDate} {projectData.endDate !== 'N/A' ? `- ${projectData.endDate}` : ''}</span>
                  </div>
                )}
                {projectData.role !== 'Developer' && (
                  <div className="meta-item">
                    <FaUser className="meta-icon" />
                    <span>{projectData.role}</span>
                  </div>
                )}
                <div className="meta-item">
                  <FaTag className="meta-icon" />
                  <span>{projectData.status}</span>
                </div>
              </div>
            )}

            {(projectData.liveUrl !== '#' || projectData.githubUrl !== '#') && (
              <div className="project-actions">
                {projectData.liveUrl !== '#' && (
                  <button className="action-btn primary" onClick={handleLiveClick}>
                    <FaExternalLinkAlt className="btn-icon" />
                    View Live
                  </button>
                )}
                {projectData.githubUrl !== '#' && (
                  <button className="action-btn secondary" onClick={handleGithubClick}>
                    <FaGithub className="btn-icon" />
                    View Code
                  </button>
                )}
              </div>
            )}
          </div>

          <div className="project-image">
            <img src={projectData.image} alt={projectData.title} onError={(e) => {
              e.target.src = 'https://raw.githubusercontent.com/AbdullahWali79/AbdullahImages/main/Protfolio.jpeg';
            }} />
          </div>

          <div className="project-content">
            {(projectData.client !== 'Personal Project' || projectData.startDate !== 'N/A' || projectData.role !== 'Developer' || projectData.status !== 'In Progress') && (
              <div className="content-section">
                <h2>Project Overview</h2>
                <div className="project-details">
                  {projectData.client !== 'Personal Project' && (
                    <div className="detail-item">
                      <strong>Client:</strong> {projectData.client}
                    </div>
                  )}
                  {projectData.startDate !== 'N/A' && (
                    <div className="detail-item">
                      <strong>Duration:</strong> {projectData.startDate} {projectData.endDate !== 'N/A' ? `- ${projectData.endDate}` : ''}
                    </div>
                  )}
                  {projectData.role !== 'Developer' && (
                    <div className="detail-item">
                      <strong>Role:</strong> {projectData.role}
                    </div>
                  )}
                  <div className="detail-item">
                    <strong>Status:</strong> {projectData.status}
                  </div>
                </div>
              </div>
            )}

            <div className="content-section">
              <h2>Project Description</h2>
              <div className="project-full-description">
                {projectData.fullDescription && projectData.fullDescription.trim()
                  ? projectData.fullDescription.split('\n\n')
                      .filter(p => p.trim())
                      .map((paragraph, index) => (
                        <p key={index} className="description-paragraph">
                          {paragraph.trim().split('\n').map((line, lineIndex, array) => (
                            <React.Fragment key={lineIndex}>
                              {line}
                              {lineIndex < array.length - 1 && <br />}
                            </React.Fragment>
                          ))}
                        </p>
                      ))
                  : <p className="description-paragraph">No detailed description available for this project.</p>
                }
              </div>
            </div>

            {projectData.technologies && projectData.technologies.length > 0 && (
              <div className="content-section">
                <h2>Technologies Used</h2>
                <div className="technologies-grid">
                  {projectData.technologies.map((tech, index) => (
                    <span key={index} className="tech-tag">{tech}</span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </article>
      </div>
    </div>
  );
};

export default PortfolioDetail;
