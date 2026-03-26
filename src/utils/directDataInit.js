import { supabase } from '../config/supabase';

// Test database connection
export const testDatabaseConnection = async () => {
  try {
    const { data, error } = await supabase
      .from('service_data')
      .select('count')
      .limit(1);
    
    if (error) {
      console.error('Database connection test failed:', error);
      return { success: false, error: error.message };
    }
    
    console.log('Database connection successful');
    return { success: true };
  } catch (error) {
    console.error('Database connection error:', error);
    return { success: false, error: error.message };
  }
};

// Direct data initialization function
export const initializeDataDirectly = async () => {
  console.log('Starting direct data initialization...');

  // First test database connection
  const connectionTest = await testDatabaseConnection();
  if (!connectionTest.success) {
    throw new Error('Database connection failed: ' + connectionTest.error);
  }

  try {
    // Service Data
    const serviceData = {
      id: 1,
      title: 'My Services',
      subtitle: 'Comprehensive solutions for your digital needs',
      services: [
        {
          icon: 'FaPalette',
          title: 'UI/UX Design',
          description: 'Creating beautiful and intuitive user interfaces that provide exceptional user experiences.',
          features: ['User Research', 'Wireframing', 'Prototyping', 'Visual Design']
        },
        {
          icon: 'FaCode',
          title: 'Web Development',
          description: 'Building responsive and modern websites using the latest technologies and best practices.',
          features: ['Frontend Development', 'Backend Integration', 'Responsive Design', 'Performance Optimization']
        },
        {
          icon: 'FaMobile',
          title: 'Mobile App Design',
          description: 'Designing mobile applications that are both functional and visually appealing across all devices.',
          features: ['iOS Design', 'Android Design', 'Cross-platform', 'App Store Optimization']
        },
        {
          icon: 'FaSearch',
          title: 'User Research',
          description: 'Conducting thorough research to understand user needs and improve product usability.',
          features: ['User Interviews', 'Usability Testing', 'Analytics', 'Persona Development']
        },
        {
          icon: 'FaRocket',
          title: 'Product Strategy',
          description: 'Developing comprehensive strategies to bring your product vision to life successfully.',
          features: ['Product Planning', 'Roadmap Development', 'Feature Prioritization', 'Market Analysis']
        },
        {
          icon: 'FaUsers',
          title: 'Consulting',
          description: 'Providing expert advice and guidance to help your business grow and succeed.',
          features: ['Strategic Planning', 'Process Improvement', 'Team Training', 'Best Practices']
        }
      ]
    };

    // About Data
    const aboutData = {
      id: 1,
      title: 'About Me',
      subtitle: 'Passionate designer and developer',
      description: 'I am a creative professional with expertise in UI/UX design and web development. I love creating digital experiences that are both beautiful and functional.',
      skills: ['UI/UX Design', 'Web Development', 'Mobile Design', 'User Research', 'Prototyping', 'Frontend Development'],
      experience: '5+ Years',
      projects: '50+ Projects'
    };

    // Portfolio Data
    const portfolioData = {
      id: 1,
      title: 'My Portfolio',
      subtitle: 'Recent work and projects',
      projects: [
        {
          title: 'E-commerce Website',
          description: 'Modern e-commerce platform with advanced features',
          image: 'https://via.placeholder.com/400x300',
          technologies: ['React', 'Node.js', 'MongoDB'],
          link: '#'
        },
        {
          title: 'Mobile Banking App',
          description: 'Secure and user-friendly banking application',
          image: 'https://via.placeholder.com/400x300',
          technologies: ['React Native', 'Firebase'],
          link: '#'
        },
        {
          title: 'SaaS Dashboard',
          description: 'Comprehensive dashboard for business analytics',
          image: 'https://via.placeholder.com/400x300',
          technologies: ['Vue.js', 'D3.js', 'Express'],
          link: '#'
        }
      ]
    };

    // News Data
    const newsData = {
      id: 1,
      title: 'Latest News',
      subtitle: 'Stay updated with my latest work',
      articles: [
        {
          title: 'New Design Trends for 2024',
          date: '2024-01-15',
          excerpt: 'Exploring the latest design trends and how they impact user experience.',
          image: 'https://via.placeholder.com/400x250',
          link: '#'
        },
        {
          title: 'Building Responsive Websites',
          date: '2024-01-10',
          excerpt: 'Best practices for creating websites that work on all devices.',
          image: 'https://via.placeholder.com/400x250',
          link: '#'
        },
        {
          title: 'User Research Methods',
          date: '2024-01-05',
          excerpt: 'Effective methods for understanding your users and their needs.',
          image: 'https://via.placeholder.com/400x250',
          link: '#'
        }
      ]
    };

    // Contact Data
    const contactData = {
      id: 1,
      title: 'Get In Touch',
      subtitle: 'Let\'s work together on your next project',
      description: 'I\'m always interested in new opportunities and exciting projects. Feel free to reach out!',
      contact_info: {
        email: 'abdullahwale@gmail.com',
        phone: '+923046983794',
        address: 'Pakistan'
      },
      social_links: [
        { platform: 'LinkedIn', url: '#' },
        { platform: 'GitHub', url: '#' },
        { platform: 'Twitter', url: '#' },
        { platform: 'Dribbble', url: '#' }
      ],
      form_fields: [
        { name: 'name', label: 'Full Name', type: 'text', required: true },
        { name: 'email', label: 'Email Address', type: 'email', required: true },
        { name: 'subject', label: 'Subject', type: 'text', required: true },
        { name: 'message', label: 'Message', type: 'textarea', required: true }
      ]
    };

    // Insert Service Data
    console.log('Inserting service data...');
    const { data: serviceResult, error: serviceError } = await supabase
      .from('service_data')
      .upsert([serviceData], { onConflict: 'id' });
    
    if (serviceError) {
      console.error('Service data error:', serviceError);
      throw new Error('Service data insertion failed: ' + serviceError.message);
    } else {
      console.log('Service data inserted successfully:', serviceResult);
    }

    // Insert About Data
    console.log('Inserting about data...');
    const { data: aboutResult, error: aboutError } = await supabase
      .from('about_data')
      .upsert([aboutData], { onConflict: 'id' });
    
    if (aboutError) {
      console.error('About data error:', aboutError);
      throw new Error('About data insertion failed: ' + aboutError.message);
    } else {
      console.log('About data inserted successfully:', aboutResult);
    }

    // Insert Portfolio Data
    console.log('Inserting portfolio data...');
    const { data: portfolioResult, error: portfolioError } = await supabase
      .from('portfolio_data')
      .upsert([portfolioData], { onConflict: 'id' });
    
    if (portfolioError) {
      console.error('Portfolio data error:', portfolioError);
    } else {
      console.log('Portfolio data inserted successfully');
    }

    // Insert News Data
    console.log('Inserting news data...');
    const { data: newsResult, error: newsError } = await supabase
      .from('news_data')
      .upsert([newsData], { onConflict: 'id' });
    
    if (newsError) {
      console.error('News data error:', newsError);
    } else {
      console.log('News data inserted successfully');
    }

    // Insert Contact Data
    console.log('Inserting contact data...');
    const { data: contactResult, error: contactError } = await supabase
      .from('contact_data')
      .upsert([contactData], { onConflict: 'id' });
    
    if (contactError) {
      console.error('Contact data error:', contactError);
    } else {
      console.log('Contact data inserted successfully');
    }

    console.log('All data initialization completed!');
    return { success: true, message: 'All demo data inserted successfully!' };

  } catch (error) {
    console.error('Error during data initialization:', error);
    return { success: false, error: error.message };
  }
};
