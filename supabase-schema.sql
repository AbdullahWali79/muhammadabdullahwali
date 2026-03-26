-- Supabase Database Schema for MERN CV Portfolio
-- Run these SQL commands in your Supabase SQL Editor

-- User Data Table (CV Form Data)
CREATE TABLE IF NOT EXISTS user_data (
  id SERIAL PRIMARY KEY,
  first_name VARCHAR(100),
  last_name VARCHAR(100),
  title VARCHAR(200),
  date_of_birth VARCHAR(50),                                                        
  nationality VARCHAR(100),
  phone VARCHAR(20),
  email VARCHAR(100),
  address TEXT,
  languages VARCHAR(200),
  profile_image TEXT, -- GitHub image URL
  summary TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Home Page Data
CREATE TABLE IF NOT EXISTS home_data (
  id INTEGER PRIMARY KEY DEFAULT 1,
  title VARCHAR(200),
  subtitle VARCHAR(200),
  description TEXT,
  button_text VARCHAR(50),
  button_link VARCHAR(200),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- About Page Data
CREATE TABLE IF NOT EXISTS about_data (
  id INTEGER PRIMARY KEY DEFAULT 1,
  title VARCHAR(200),
  subtitle VARCHAR(200),
  description TEXT,
  skills JSONB, -- Array of skills
  experience VARCHAR(50),
  projects VARCHAR(50),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Service Page Data
CREATE TABLE IF NOT EXISTS service_data (
  id INTEGER PRIMARY KEY DEFAULT 1,
  title VARCHAR(200),
  subtitle VARCHAR(200),
  services JSONB, -- Array of service objects
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Portfolio Page Data
CREATE TABLE IF NOT EXISTS portfolio_data (
  id INTEGER PRIMARY KEY DEFAULT 1,
  title VARCHAR(200),
  subtitle VARCHAR(200),
  projects JSONB, -- Array of project objects
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- News Page Data
CREATE TABLE IF NOT EXISTS news_data (
  id INTEGER PRIMARY KEY DEFAULT 1,
  title VARCHAR(200),
  subtitle VARCHAR(200),
  articles JSONB, -- Array of article objects
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Contact Page Data
CREATE TABLE IF NOT EXISTS contact_data (
  id INTEGER PRIMARY KEY DEFAULT 1,
  title VARCHAR(200),
  subtitle VARCHAR(200),
  description TEXT,
  contact_info JSONB, -- Contact information object
  social_links JSONB, -- Array of social link objects
  form_fields JSONB, -- Array of form field objects
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Digital Products Page Data
CREATE TABLE IF NOT EXISTS digital_products_data (
  id INTEGER PRIMARY KEY DEFAULT 1,
  title VARCHAR(200),
  subtitle VARCHAR(200),
  products JSONB, -- Array of product objects
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security (RLS)
ALTER TABLE user_data ENABLE ROW LEVEL SECURITY;
ALTER TABLE home_data ENABLE ROW LEVEL SECURITY;
ALTER TABLE about_data ENABLE ROW LEVEL SECURITY;
ALTER TABLE service_data ENABLE ROW LEVEL SECURITY;
ALTER TABLE portfolio_data ENABLE ROW LEVEL SECURITY;
ALTER TABLE news_data ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_data ENABLE ROW LEVEL SECURITY;

-- Create policies for public access (you can modify these for authentication)
CREATE POLICY "Allow public read access" ON user_data FOR SELECT USING (true);
CREATE POLICY "Allow public insert access" ON user_data FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update access" ON user_data FOR UPDATE USING (true);

CREATE POLICY "Allow public read access" ON home_data FOR SELECT USING (true);
CREATE POLICY "Allow public insert access" ON home_data FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update access" ON home_data FOR UPDATE USING (true);

CREATE POLICY "Allow public read access" ON about_data FOR SELECT USING (true);
CREATE POLICY "Allow public insert access" ON about_data FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update access" ON about_data FOR UPDATE USING (true);

CREATE POLICY "Allow public read access" ON service_data FOR SELECT USING (true);
CREATE POLICY "Allow public insert access" ON service_data FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update access" ON service_data FOR UPDATE USING (true);

CREATE POLICY "Allow public read access" ON portfolio_data FOR SELECT USING (true);
CREATE POLICY "Allow public insert access" ON portfolio_data FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update access" ON portfolio_data FOR UPDATE USING (true);

CREATE POLICY "Allow public read access" ON news_data FOR SELECT USING (true);
CREATE POLICY "Allow public insert access" ON news_data FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update access" ON news_data FOR UPDATE USING (true);

CREATE POLICY "Allow public read access" ON contact_data FOR SELECT USING (true);
CREATE POLICY "Allow public insert access" ON contact_data FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update access" ON contact_data FOR UPDATE USING (true);

-- Enable Row Level Security (RLS) for digital_products_data
ALTER TABLE digital_products_data ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public read access" ON digital_products_data FOR SELECT USING (true);
CREATE POLICY "Allow public insert access" ON digital_products_data FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update access" ON digital_products_data FOR UPDATE USING (true);

-- Security and Access Control Table
CREATE TABLE IF NOT EXISTS security_settings (
  id INTEGER PRIMARY KEY DEFAULT 1,
  admin_password VARCHAR(50) DEFAULT '7337',
  page_passwords JSONB DEFAULT '{
    "makehome": "7337",
    "makeabout": "7337", 
    "makeservice": "7337",
    "makeportfolio": "7337",
    "makenews": "7337",
    "makecontact": "7337",
    "makecv": "7337",
    "makedigitalproducts": "7337"
  }',
  access_logs JSONB DEFAULT '[]',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert default security settings
INSERT INTO security_settings (id, admin_password, page_passwords) 
VALUES (1, '7337', '{
  "makehome": "7337",
  "makeabout": "7337", 
  "makeservice": "7337",
  "makeportfolio": "7337",
  "makenews": "7337",
  "makecontact": "7337",
  "makecv": "7337",
  "makedigitalproducts": "7337"
}')
ON CONFLICT (id) DO NOTHING;

-- Enable RLS for security table
ALTER TABLE security_settings ENABLE ROW LEVEL SECURITY;

-- Create policies for security table
CREATE POLICY "Allow public read access" ON security_settings FOR SELECT USING (true);
CREATE POLICY "Allow public update access" ON security_settings FOR UPDATE USING (true);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_user_data_created_at ON user_data(created_at);
CREATE INDEX IF NOT EXISTS idx_user_data_email ON user_data(email);
CREATE INDEX IF NOT EXISTS idx_security_settings_updated_at ON security_settings(updated_at);
