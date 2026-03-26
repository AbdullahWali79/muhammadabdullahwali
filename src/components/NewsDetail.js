import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FaCalendarAlt, FaUser, FaTag, FaArrowLeft, FaExternalLinkAlt } from 'react-icons/fa';
import { getNewsData } from '../services/supabaseService';
import parse from 'html-react-parser';
import './NewsDetail.css';

const NewsDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [newsItem, setNewsItem] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadNewsData = async () => {
      try {
        const result = await getNewsData();
        if (result.success && result.data && result.data.articles) {
          // Find article by ID (handle both numeric and string IDs)
          const article = result.data.articles.find(item => 
            item.id === parseInt(id) || 
            item.id === id || 
            String(item.id) === String(id)
          );
          setNewsItem(article);
        }
      } catch (error) {
        console.error('Error loading news data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadNewsData();
  }, [id]);

  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return 'No date';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      });
    } catch {
      return dateString;
    }
  };

  // Calculate read time from content
  const calculateReadTime = (content) => {
    if (!content) return '2 min read';
    const words = content.split(/\s+/).length;
    const minutes = Math.ceil(words / 200);
    return `${minutes} min read`;
  };

  // Sample news data - fallback if no data from Supabase
  const defaultNewsItems = [
    {
      id: 1,
      title: 'The Future of UI/UX Design in 2024',
      excerpt: 'Exploring the latest trends and technologies that are shaping the future of user interface and user experience design.',
      content: `As we move further into 2024, the landscape of UI/UX design continues to evolve at a rapid pace. New technologies like AI, AR, and VR are creating unprecedented opportunities for designers to create more immersive and intuitive user experiences.

The integration of artificial intelligence into design tools has revolutionized how we approach user interface design. AI-powered tools can now analyze user behavior patterns, suggest optimal layouts, and even generate design variations automatically. This doesn't replace the designer's creativity but enhances it, allowing for more data-driven design decisions.

Augmented Reality (AR) and Virtual Reality (VR) are no longer just buzzwords but practical tools for creating engaging user experiences. From virtual showrooms to AR-powered mobile applications, these technologies are opening new avenues for user interaction that were previously impossible.

The rise of voice interfaces and conversational design has also changed how we think about user interaction. Designers are now creating experiences that go beyond visual elements, incorporating audio cues, haptic feedback, and natural language processing.

Accessibility has become a core focus rather than an afterthought. With increasing awareness of inclusive design, we're seeing more applications that work seamlessly for users with different abilities, ensuring that technology is truly for everyone.

Looking ahead, we can expect to see more integration of biometric data, personalized interfaces that adapt to individual users, and the continued evolution of design systems that scale across platforms and devices. The future of UI/UX design is not just about making things look good, but about creating meaningful, accessible, and intelligent user experiences.`,
      date: 'March 15, 2024',
      author: 'Design Team',
      category: 'Design Trends',
      readTime: '5 min read',
      image: '/api/placeholder/800/400'
    },
    {
      id: 2,
      title: 'Building Accessible Web Applications',
      excerpt: 'A comprehensive guide to creating web applications that are inclusive and accessible to all users.',
      content: `Accessibility in web design is not just a nice-to-have feature—it's a fundamental requirement for creating inclusive digital experiences. In this article, we explore the key principles and techniques for building accessible web applications.

The Web Content Accessibility Guidelines (WCAG) provide a comprehensive framework for creating accessible web content. These guidelines cover four main principles: perceivable, operable, understandable, and robust. Each principle includes specific criteria that help ensure your application works for users with various disabilities.

Perceivable content means that information and user interface components must be presentable to users in ways they can perceive. This includes providing text alternatives for images, captions for videos, and ensuring sufficient color contrast between text and background.

Operable interfaces ensure that users can navigate and interact with your application using various input methods. This includes keyboard navigation, voice commands, and other assistive technologies. All interactive elements should be reachable and usable without requiring precise pointing or clicking.

Understanding your content is crucial for accessibility. This means using clear, simple language, providing consistent navigation patterns, and offering help when users make errors. Error messages should be descriptive and suggest how to fix the problem.

Robust applications work across different browsers, assistive technologies, and devices. This requires using semantic HTML, following web standards, and testing with various tools and devices.

Implementing accessibility from the start is always more efficient than retrofitting it later. Consider accessibility requirements during the design phase, use semantic HTML elements, provide alternative text for images, ensure keyboard navigation works, and test with screen readers and other assistive technologies.

Remember, accessible design benefits everyone, not just users with disabilities. Clear navigation, readable text, and intuitive interfaces improve the experience for all users.`,
      date: 'March 10, 2024',
      author: 'Development Team',
      category: 'Web Development',
      readTime: '7 min read',
      image: '/api/placeholder/800/400'
    },
    {
      id: 3,
      title: 'Mobile-First Design Strategy',
      excerpt: 'Why mobile-first design is crucial for modern web applications and how to implement it effectively.',
      content: `With mobile devices accounting for over 50% of web traffic, adopting a mobile-first design strategy has become essential for creating successful digital products. This approach ensures that your application works seamlessly across all devices.

Mobile-first design means starting with the mobile experience and progressively enhancing for larger screens. This approach forces you to focus on the most important content and functionality first, leading to cleaner, more focused designs.

The key principles of mobile-first design include prioritizing content, using touch-friendly interfaces, optimizing for performance, and ensuring fast loading times. Mobile users have different needs and constraints compared to desktop users, so the design must account for smaller screens, touch interactions, and varying network conditions.

Content prioritization is crucial in mobile-first design. You need to identify the most important information and features that users need on mobile devices. This often means simplifying navigation, reducing the number of options, and focusing on core functionality.

Touch interfaces require larger touch targets, adequate spacing between interactive elements, and consideration for one-handed use. Buttons should be at least 44px in size, and important actions should be easily reachable with a thumb.

Performance optimization is critical for mobile users who may have slower connections or limited data plans. This includes optimizing images, minimizing HTTP requests, using efficient CSS and JavaScript, and implementing lazy loading.

Responsive design techniques like flexible grids, fluid images, and media queries allow your design to adapt to different screen sizes. Start with a mobile layout and use progressive enhancement to add features for larger screens.

Testing on real devices is essential. Emulators and browser developer tools are helpful, but nothing replaces testing on actual mobile devices with real users. Consider factors like different screen sizes, operating systems, and network conditions.

The mobile-first approach doesn't mean ignoring desktop users. Instead, it ensures that your application works well for all users while prioritizing the mobile experience, which is often the primary way users interact with your product.`,
      date: 'March 5, 2024',
      author: 'UX Team',
      category: 'Mobile Design',
      readTime: '6 min read',
      image: '/api/placeholder/800/400'
    },
    {
      id: 4,
      title: 'The Psychology of Color in Design',
      excerpt: 'Understanding how color choices impact user behavior and emotional responses in digital products.',
      content: `Color is one of the most powerful tools in a designer's arsenal. It can evoke emotions, guide user attention, and create memorable experiences. In this deep dive, we explore the psychological effects of different colors and how to use them effectively.

Color psychology is the study of how colors affect human behavior and emotions. Different colors can trigger different psychological responses, and understanding these effects can help designers create more effective and engaging user experiences.

Red is often associated with energy, passion, and urgency. It can increase heart rate and create a sense of urgency, which is why it's commonly used for call-to-action buttons and sale notifications. However, too much red can create anxiety or aggression.

Blue is associated with trust, stability, and professionalism. It's calming and often used by financial institutions and technology companies to convey reliability. Blue can also suppress appetite, which is why it's rarely used in food-related applications.

Green represents nature, growth, and harmony. It's easy on the eyes and often used for environmental or health-related applications. Green can also indicate success or positive actions, like completed tasks or successful transactions.

Yellow is associated with happiness, optimism, and creativity. It can grab attention and stimulate mental activity, but too much yellow can cause eye strain or anxiety. It's often used for warnings or highlights.

Purple is associated with luxury, creativity, and mystery. It's often used by brands that want to convey sophistication or premium quality. Purple can also stimulate creativity and imagination.

Orange combines the energy of red with the happiness of yellow. It's associated with enthusiasm, creativity, and success. Orange is often used for call-to-action buttons because it's attention-grabbing without being as aggressive as red.

Black represents power, elegance, and sophistication. It's often used for luxury brands and high-end products. Black can also create a sense of mystery or exclusivity.

White represents purity, cleanliness, and simplicity. It's often used to create a sense of space and clarity. White backgrounds can make other colors pop and create a clean, modern look.

When choosing colors for your design, consider your brand personality, target audience, and the emotions you want to evoke. Use color to guide user attention, create hierarchy, and reinforce your brand message. Remember that color meanings can vary across cultures, so consider your global audience when making color choices.`,
      date: 'February 28, 2024',
      author: 'Design Team',
      category: 'Design Psychology',
      readTime: '8 min read',
      image: '/api/placeholder/800/400'
    },
    {
      id: 5,
      title: 'Microinteractions: The Secret to Great UX',
      excerpt: 'How small animations and interactions can significantly improve user experience and engagement.',
      content: `Microinteractions are the small, often overlooked details that make a big difference in user experience. From button hover effects to loading animations, these subtle interactions can transform a good design into a great one.

Microinteractions are single-purpose interactions that accomplish one task. They provide feedback, guide users, and make interfaces feel more responsive and alive. These small details can significantly impact how users perceive and interact with your product.

The four main parts of a microinteraction are the trigger, rules, feedback, and loops/modes. The trigger is what initiates the interaction, rules determine what happens, feedback shows the user what's happening, and loops/modes define the meta-rules and what happens when the interaction is over.

Triggers can be user-initiated or system-initiated. User-initiated triggers happen when the user takes an action, like clicking a button or hovering over an element. System-initiated triggers happen automatically based on certain conditions, like showing a notification when a task is completed.

Rules define what happens when a trigger is activated. They determine the behavior of the microinteraction, including timing, duration, and the sequence of events. Good rules make interactions feel natural and predictable.

Feedback is crucial for microinteractions. It tells users that their action was registered and shows them what's happening. This can be visual (animations, color changes), audio (sounds), or haptic (vibrations). Good feedback is immediate and clear.

Loops and modes define what happens after the microinteraction is complete. Some interactions happen once, while others repeat or change based on different conditions. Modes can change the behavior of the interface based on the current state.

Common examples of microinteractions include button hover effects, form validation feedback, loading animations, toggle switches, progress indicators, and notification animations. Each of these serves a specific purpose and improves the overall user experience.

When designing microinteractions, keep them simple, purposeful, and consistent with your overall design system. They should feel natural and enhance the user experience without being distracting. Test your microinteractions with real users to ensure they're effective and don't cause confusion.

Remember, the best microinteractions are often invisible to users—they just make the interface feel better without drawing attention to themselves. Focus on creating interactions that feel natural and provide clear feedback to users.`,
      date: 'February 20, 2024',
      author: 'UX Team',
      category: 'User Experience',
      readTime: '4 min read',
      image: '/api/placeholder/800/400'
    },
    {
      id: 6,
      title: 'Design Systems: Building for Scale',
      excerpt: 'Creating and maintaining design systems that grow with your product and team.',
      content: `As products and teams grow, maintaining consistency becomes increasingly challenging. Design systems provide a structured approach to scaling design across large organizations while ensuring consistency and efficiency.

A design system is a collection of reusable components, guided by clear standards, that can be assembled together to build any number of applications. It's more than just a style guide or component library—it's a living, breathing system that evolves with your product and team.

The key components of a design system include design principles, visual language, component library, style guide, and usage guidelines. Each component works together to create a cohesive system that ensures consistency across all touchpoints.

Design principles are the fundamental beliefs that guide your design decisions. They should reflect your brand values and help team members make consistent decisions when creating new components or features.

Visual language includes colors, typography, spacing, and other visual elements that create a cohesive look and feel. This should be well-documented and easily accessible to all team members.

Component libraries contain reusable UI components that can be used across different applications. These components should be well-documented, tested, and easy to use. They should also be flexible enough to handle different use cases while maintaining consistency.

Style guides document the visual and interactive aspects of your design system. They should include examples, usage guidelines, and best practices for each component and pattern.

Usage guidelines help team members understand when and how to use different components. They should include do's and don'ts, accessibility considerations, and examples of proper implementation.

Building a design system requires collaboration between designers, developers, and other stakeholders. It's important to start small and iterate based on real usage and feedback. Regular reviews and updates ensure the system stays relevant and useful.

Maintaining a design system is an ongoing process. It requires dedicated resources, regular updates, and strong governance to ensure it remains useful and doesn't become outdated. Consider creating a dedicated team or role to maintain and evolve the system.

The benefits of a well-maintained design system include increased efficiency, better consistency, improved collaboration, and faster development cycles. It also makes it easier to onboard new team members and maintain quality as the team grows.

Remember, a design system is a tool to help your team work better together, not a constraint on creativity. It should provide a solid foundation while still allowing for innovation and adaptation to specific needs.`,
      date: 'February 15, 2024',
      author: 'Design Team',
      category: 'Design Systems',
      readTime: '9 min read',
      image: '/api/placeholder/800/400'
    }
  ];

  // Use article from Supabase or fallback to default
  const displayItem = newsItem || defaultNewsItems.find(item => item.id === parseInt(id));

  if (loading) {
    return (
      <div className="news-detail">
        <div className="news-detail-container">
          <div className="loading" style={{ textAlign: 'center', padding: '40px', color: '#00CED1' }}>
            Loading article...
          </div>
        </div>
      </div>
    );
  }

  if (!displayItem) {
    return (
      <div className="news-detail">
        <div className="news-detail-container">
          <div className="error-message">
            <h1>Article Not Found</h1>
            <p>The article you're looking for doesn't exist.</p>
            <button className="back-btn" onClick={() => navigate('/news')}>
              <FaArrowLeft className="btn-icon" />
              Back to News
            </button>
          </div>
        </div>
      </div>
    );
  }

  const handleBackClick = () => {
    navigate('/news');
  };

  return (
    <div className="news-detail">
      <div className="news-detail-container">
        <button className="back-btn" onClick={handleBackClick}>
          <FaArrowLeft className="btn-icon" />
          Back to News
        </button>

        <article className="news-article">
          <div className="article-header">
            <div className="article-category">{displayItem.category || 'General'}</div>
            <h1 className="article-title">{displayItem.title || 'Untitled Article'}</h1>
            {(displayItem.excerpt || displayItem.description) && (
              <p className="article-excerpt">
                {displayItem.excerpt || displayItem.description}
              </p>
            )}
            
            <div className="article-meta">
              <div className="meta-item">
                <FaCalendarAlt className="meta-icon" />
                <span>{formatDate(displayItem.date || displayItem.pubDate)}</span>
              </div>
              <div className="meta-item">
                <FaUser className="meta-icon" />
                <span>{displayItem.author || displayItem.source || 'News Team'}</span>
              </div>
              <div className="meta-item">
                <FaTag className="meta-icon" />
                <span>{calculateReadTime(displayItem.content || displayItem.fullDescription || displayItem.description)}</span>
              </div>
            </div>

            {displayItem.link && (
              <div className="article-header-link">
                <a 
                  href={displayItem.link} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="article-source-link"
                >
                  <FaExternalLinkAlt /> Read Original Article
                </a>
              </div>
            )}
          </div>

          {displayItem.image && displayItem.image !== '/api/placeholder/800/400' && !displayItem.image.includes('placeholder') && (
            <div className="article-image">
              <img 
                src={displayItem.image} 
                alt={displayItem.title} 
                style={{ 
                  width: '100%', 
                  height: 'auto',
                  borderRadius: '8px',
                  maxHeight: '500px',
                  objectFit: 'cover'
                }}
                onError={(e) => {
                  e.target.style.display = 'none';
                }}
              />
            </div>
          )}

          <div className="article-content">
            {(() => {
              // Prioritize fullDescription, then content, then description
              let content = displayItem.fullDescription || displayItem.content || displayItem.description || '';
              
              if (!content || content.trim() === '') {
                return <p className="article-paragraph">No content available.</p>;
              }
              
              // Check if content contains HTML tags (comprehensive check)
              const hasHTML = /<[a-z][\s\S]*>/i.test(content) || 
                             content.includes('<p>') ||
                             content.includes('<div>') ||
                             content.includes('<br') ||
                             content.includes('<h1>') ||
                             content.includes('<h2>') ||
                             content.includes('<ul>') ||
                             content.includes('<ol>') ||
                             content.includes('<li>') ||
                             content.includes('<strong>') ||
                             content.includes('<em>') ||
                             content.includes('<a href');
              
              if (hasHTML) {
                // Use dangerouslySetInnerHTML for better HTML rendering
                // This will render HTML exactly as it appears in the source
                return (
                  <div 
                    className="article-html-content"
                    dangerouslySetInnerHTML={{ __html: content }}
                  />
                );
              } else {
                // Plain text - split into paragraphs
                const paragraphs = content.includes('\n\n') 
                  ? content.split('\n\n').filter(p => p.trim())
                  : content.split('\n').filter(p => p.trim());
                
                return paragraphs.map((paragraph, index) => (
                  <p key={index} className="article-paragraph">
                    {paragraph.trim()}
                  </p>
                ));
              }
            })()}
          </div>

          {displayItem.link && (
            <div className="article-footer">
              <a 
                href={displayItem.link} 
                target="_blank" 
                rel="noopener noreferrer"
                className="article-source-link"
              >
                <FaExternalLinkAlt /> Read Original Article
              </a>
            </div>
          )}
        </article>
      </div>
    </div>
  );
};

export default NewsDetail;
