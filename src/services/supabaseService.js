import { supabase, TABLES } from '../config/supabase'

// User Data (CV Form)
export const saveUserData = async (userData) => {
  try {
    const { data, error } = await supabase
      .from(TABLES.USER_DATA)
      .upsert([userData], { onConflict: 'id' })
    
    if (error) throw error
    return { success: true, data }
  } catch (error) {
    console.error('Error saving user data:', error)
    return { success: false, error: error.message }
  }
}

export const getUserData = async () => {
  try {
    const { data, error } = await supabase
      .from(TABLES.USER_DATA)
      .select('*')
      .order('created_at', { ascending: false })
      .limit(1)
      .single()
    
    if (error && error.code !== 'PGRST116') throw error
    return { success: true, data: data || null }
  } catch (error) {
    console.error('Error fetching user data:', error)
    return { success: false, error: error.message }
  }
}

// Home Data
export const saveHomeData = async (homeData) => {
  try {
    const { data, error } = await supabase
      .from(TABLES.HOME_DATA)
      .upsert([{ id: 1, ...homeData }], { onConflict: 'id' })
    
    if (error) throw error
    return { success: true, data }
  } catch (error) {
    console.error('Error saving home data:', error)
    return { success: false, error: error.message }
  }
}

export const getHomeData = async () => {
  try {
    const { data, error } = await supabase
      .from(TABLES.HOME_DATA)
      .select('*')
      .eq('id', 1)
      .single()
    
    if (error && error.code !== 'PGRST116') throw error
    return { success: true, data: data || null }
  } catch (error) {
    console.error('Error fetching home data:', error)
    return { success: false, error: error.message }
  }
}

// About Data
export const saveAboutData = async (aboutData) => {
  try {
    console.log('Saving about data:', aboutData);
    
    // Validate Supabase client
    if (!supabase) {
      throw new Error('Supabase client is not initialized. Please check your configuration.');
    }
    
    // Sanitize and prepare data - ensure description is properly formatted
    const dataToSave = { 
      id: 1, 
      ...aboutData,
      // Ensure description is a string and trim excessive whitespace
      description: typeof aboutData.description === 'string' 
        ? aboutData.description.trim() 
        : String(aboutData.description || '').trim()
    };
    
    console.log('Data to save:', dataToSave);
    
    // Test connection first with a simple query
    try {
      const { error: testError } = await supabase
        .from(TABLES.ABOUT_DATA)
        .select('id')
        .eq('id', 1)
        .limit(1);
      
      if (testError && testError.code !== 'PGRST116') {
        console.error('Connection test failed:', testError);
        // If connection test fails, provide specific error
        if (testError.code === '42P01') {
          throw new Error('Table "about_data" does not exist. Please run the SQL schema in Supabase SQL Editor to create the table.');
        }
        if (testError.code === 'PGRST301') {
          throw new Error('Permission denied: Please check Row Level Security (RLS) policies in Supabase. Make sure SELECT, INSERT and UPDATE policies are enabled for the about_data table.');
        }
      }
    } catch (testErr) {
      // If it's already a formatted error, re-throw it
      if (testErr.message?.includes('does not exist') || testErr.message?.includes('Permission denied')) {
        throw testErr;
      }
      // Otherwise continue with the save attempt
    }
    
    const { data, error } = await supabase
      .from(TABLES.ABOUT_DATA)
      .upsert([dataToSave], { onConflict: 'id' })
    
    if (error) {
      console.error('Supabase error saving about data:', error);
      console.error('Error details:', {
        message: error.message,
        code: error.code,
        details: error.details,
        hint: error.hint
      });
      throw error;
    }
    
    console.log('About data saved successfully:', data);
    return { success: true, data }
  } catch (error) {
    console.error('Error saving about data:', error);
    
    // Provide more helpful error messages
    let errorMessage = error.message || 'Unknown error occurred';
    
    // Check for network/connection errors
    if (error.message?.includes('Failed to fetch') || 
        error.message?.includes('NetworkError') ||
        error.message?.includes('network') ||
        error.message?.includes('fetch') ||
        error.name === 'TypeError' ||
        (error.name === 'TypeError' && error.message?.includes('fetch'))) {
      errorMessage = 'Network error: Please check your internet connection and Supabase configuration. Verify that:\n1. Your internet is working\n2. Supabase project is active (not paused)\n3. API key is correct\n4. Table "about_data" exists in your database\n5. Check browser console for more details';
    } else if (error.code === 'PGRST301' || error.message?.includes('permission') || error.message?.includes('Permission denied')) {
      errorMessage = 'Permission denied: Please check Row Level Security (RLS) policies in Supabase. Make sure INSERT and UPDATE policies are enabled for the about_data table.';
    } else if (error.code === '42P01' || error.message?.includes('does not exist')) {
      errorMessage = 'Table not found: The "about_data" table does not exist. Please run the SQL schema in Supabase SQL Editor to create the table.';
    } else if (error.code === '23514' || error.message?.includes('violates check constraint')) {
      errorMessage = 'Data validation error: The data you entered does not meet the database constraints. Please check your input.';
    } else if (error.code === '22001' || error.message?.includes('value too long')) {
      errorMessage = 'Data too long: The description is too long. Please shorten it or check database column size limits.';
    }
    
    return { success: false, error: errorMessage }
  }
}

export const getAboutData = async () => {
  try {
    console.log('Fetching about data from table:', TABLES.ABOUT_DATA);
    const { data, error } = await supabase
      .from(TABLES.ABOUT_DATA)
      .select('*')
      .eq('id', 1)
      .single()
    
    if (error) {
      // PGRST116 means no rows found, which is okay
      if (error.code === 'PGRST116') {
        console.log('No about data found in database (this is okay for first time)');
        return { success: true, data: null }
      }
      throw error
    }
    
    console.log('About data fetched successfully:', data);
    return { success: true, data: data || null }
  } catch (error) {
    console.error('Error fetching about data:', error)
    return { success: false, error: error.message }
  }
}

// Service Data
export const saveServiceData = async (serviceData) => {
  try {
    const { data, error } = await supabase
      .from(TABLES.SERVICE_DATA)
      .upsert([{ id: 1, ...serviceData }], { onConflict: 'id' })
    
    if (error) throw error
    return { success: true, data }
  } catch (error) {
    console.error('Error saving service data:', error)
    return { success: false, error: error.message }
  }
}

export const getServiceData = async () => {
  try {
    const { data, error } = await supabase
      .from(TABLES.SERVICE_DATA)
      .select('*')
      .eq('id', 1)
      .single()
    
    if (error && error.code !== 'PGRST116') throw error
    return { success: true, data: data || null }
  } catch (error) {
    console.error('Error fetching service data:', error)
    return { success: false, error: error.message }
  }
}

// Portfolio Data
export const savePortfolioData = async (portfolioData) => {
  try {
    const { data, error } = await supabase
      .from(TABLES.PORTFOLIO_DATA)
      .upsert([{ id: 1, ...portfolioData }], { onConflict: 'id' })
    
    if (error) throw error
    return { success: true, data }
  } catch (error) {
    console.error('Error saving portfolio data:', error)
    return { success: false, error: error.message }
  }
}

export const getPortfolioData = async () => {
  try {
    const { data, error } = await supabase
      .from(TABLES.PORTFOLIO_DATA)
      .select('*')
      .eq('id', 1)
      .single()
    
    if (error && error.code !== 'PGRST116') throw error
    return { success: true, data: data || null }
  } catch (error) {
    console.error('Error fetching portfolio data:', error)
    return { success: false, error: error.message }
  }
}

// News Data
export const saveNewsData = async (newsData) => {
  try {
    const { data, error } = await supabase
      .from(TABLES.NEWS_DATA)
      .upsert([{ id: 1, ...newsData }], { onConflict: 'id' })
    
    if (error) throw error
    return { success: true, data }
  } catch (error) {
    console.error('Error saving news data:', error)
    return { success: false, error: error.message }
  }
}

export const getNewsData = async () => {
  try {
    const { data, error } = await supabase
      .from(TABLES.NEWS_DATA)
      .select('*')
      .eq('id', 1)
      .single()
    
    if (error && error.code !== 'PGRST116') throw error
    return { success: true, data: data || null }
  } catch (error) {
    console.error('Error fetching news data:', error)
    return { success: false, error: error.message }
  }
}

// Contact Data
export const saveContactData = async (contactData) => {
  try {
    const { data, error } = await supabase
      .from(TABLES.CONTACT_DATA)
      .upsert([{ id: 1, ...contactData }], { onConflict: 'id' })
    
    if (error) throw error
    return { success: true, data }
  } catch (error) {
    console.error('Error saving contact data:', error)
    return { success: false, error: error.message }
  }
}

export const getContactData = async () => {
  try {
    const { data, error } = await supabase
      .from(TABLES.CONTACT_DATA)
      .select('*')
      .eq('id', 1)
      .single()
    
    if (error && error.code !== 'PGRST116') throw error
    return { success: true, data: data || null }
  } catch (error) {
    console.error('Error fetching contact data:', error)
    return { success: false, error: error.message }
  }
}

// Prompts Data
export const savePromptsData = async (promptsData) => {
  try {
    const { data, error } = await supabase
      .from(TABLES.PROMPTS_DATA)
      .upsert([{ id: 1, ...promptsData }], { onConflict: 'id' })
    
    if (error) throw error
    return { success: true, data }
  } catch (error) {
    console.error('Error saving prompts data:', error)
    return { success: false, error: error.message }
  }
}

export const getPromptsData = async () => {
  try {
    const { data, error } = await supabase
      .from(TABLES.PROMPTS_DATA)
      .select('*')
      .eq('id', 1)
      .single()
    
    if (error && error.code !== 'PGRST116') throw error
    return { success: true, data: data || null }
  } catch (error) {
    console.error('Error fetching prompts data:', error)
    return { success: false, error: error.message }
  }
}

// Digital Products Data
export const saveDigitalProductsData = async (digitalProductsData) => {
  try {
    const { data, error } = await supabase
      .from(TABLES.DIGITAL_PRODUCTS_DATA)
      .upsert([{ id: 1, ...digitalProductsData }], { onConflict: 'id' })
    
    if (error) throw error
    return { success: true, data }
  } catch (error) {
    console.error('Error saving digital products data:', error)
    return { success: false, error: error.message }
  }
}

export const getDigitalProductsData = async () => {
  try {
    const { data, error } = await supabase
      .from(TABLES.DIGITAL_PRODUCTS_DATA)
      .select('*')
      .eq('id', 1)
      .single()
    
    if (error && error.code !== 'PGRST116') throw error
    return { success: true, data: data || null }
  } catch (error) {
    console.error('Error fetching digital products data:', error)
    return { success: false, error: error.message }
  }
}
