import { createClient } from '@supabase/supabase-js'

// Supabase project details
const supabaseUrl = 'https://qnwtztkfeejxfulvvyfi.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFud3R6dGtmZWVqeGZ1bHZ2eWZpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjIxODI1MzUsImV4cCI6MjA3Nzc1ODUzNX0.FjhiD2TK3M4ZfayGOa2tXDPIrUIQXyiMgutA0g512jI'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Database table names
export const TABLES = {
  USER_DATA: 'user_data',
  HOME_DATA: 'home_data',
  ABOUT_DATA: 'about_data',
  SERVICE_DATA: 'service_data',
  PORTFOLIO_DATA: 'portfolio_data',
  NEWS_DATA: 'news_data',
  CONTACT_DATA: 'contact_data',
  PROMPTS_DATA: 'prompts_data',
  DIGITAL_PRODUCTS_DATA: 'digital_products_data'
}
