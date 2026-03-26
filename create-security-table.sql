-- Create Security Settings Table
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
    "makecv": "7337"
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
  "makecv": "7337"
}')
ON CONFLICT (id) DO NOTHING;

-- Enable RLS for security table
ALTER TABLE security_settings ENABLE ROW LEVEL SECURITY;

-- Create policies for security table
CREATE POLICY "Allow public read access" ON security_settings FOR SELECT USING (true);
CREATE POLICY "Allow public update access" ON security_settings FOR UPDATE USING (true);
