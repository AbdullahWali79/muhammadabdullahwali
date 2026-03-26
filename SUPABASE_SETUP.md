# Supabase Integration Setup Guide

## Step 1: Create Supabase Project

1. Go to [https://supabase.com](https://supabase.com)
2. Sign up/Login to your account
3. Click "New Project"
4. Choose your organization
5. Enter project details:
   - **Name**: `mern-cv-portfolio`
   - **Database Password**: Create a strong password
   - **Region**: Choose closest to your location
6. Click "Create new project"
7. Wait for project to be created (2-3 minutes)

## Step 2: Get Project Credentials

1. Go to your project dashboard
2. Click on "Settings" (gear icon) in the sidebar
3. Click on "API" in the settings menu
4. Copy the following:
   - **Project URL** (looks like: `https://your-project-id.supabase.co`)
   - **Anon public key** (long string starting with `eyJ...`)

## Step 3: Update Configuration

1. Open `src/config/supabase.js` in your project
2. Replace the placeholder values:

```javascript
const supabaseUrl = 'YOUR_SUPABASE_URL' // Replace with your Project URL
const supabaseAnonKey = 'YOUR_SUPABASE_ANON_KEY' // Replace with your Anon public key
```

## Step 4: Create Database Tables

1. In your Supabase dashboard, go to "SQL Editor"
2. Click "New Query"
3. Copy and paste the entire content from `supabase-schema.sql`
4. Click "Run" to execute the SQL
5. You should see "Success. No rows returned" message

## Step 5: Test the Integration

1. Start your React app: `npm start`
2. Go to `http://localhost:3000/makecv`
3. Fill out the CV form
4. Click "Save Data"
5. Check your Supabase dashboard → Table Editor → `user_data` table
6. You should see your data saved there!

## Database Tables Created

- **user_data**: CV form data (name, email, profile image URL, etc.)
- **home_data**: Home page content
- **about_data**: About page content with skills
- **service_data**: Services with pricing
- **portfolio_data**: Projects with GitHub image URLs
- **news_data**: Articles with featured images
- **contact_data**: Contact information and social links

## Features

✅ **GitHub Image URLs**: All images are stored as URLs (no file uploads)
✅ **Real-time Data**: Data is saved to Supabase database
✅ **Password Protection**: All edit pages require password: `7337`
✅ **JSON Storage**: Complex data (arrays, objects) stored as JSONB
✅ **Auto Timestamps**: Created/updated timestamps automatically added

## URLs for Testing

- `http://localhost:3000/makecv` - CV Form (saves to user_data)
- `http://localhost:3000/makehome` - Home Editor (saves to home_data)
- `http://localhost:3000/makeabout` - About Editor (saves to about_data)
- `http://localhost:3000/makeservice` - Service Editor (saves to service_data)
- `http://localhost:3000/makeportfolio` - Portfolio Editor (saves to portfolio_data)
- `http://localhost:3000/makenews` - News Editor (saves to news_data)
- `http://localhost:3000/makecontact` - Contact Editor (saves to contact_data)

## Troubleshooting

### If you get connection errors:
1. Check your Supabase URL and key are correct
2. Make sure your Supabase project is active
3. Check browser console for specific error messages

### If data doesn't save:
1. Check Supabase dashboard → Table Editor
2. Verify RLS policies are set correctly
3. Check browser network tab for API errors

### If images don't load:
1. Make sure GitHub URLs are in raw format
2. Check if GitHub repository is public
3. Verify image URLs are accessible

## Security Notes

- All tables have Row Level Security (RLS) enabled
- Public read/write access is currently enabled (modify as needed)
- Consider adding authentication for production use
- GitHub image URLs are stored as plain text (no security issues)

## Next Steps

1. Customize the database schema if needed
2. Add authentication for production
3. Set up proper RLS policies
4. Add data validation
5. Implement real-time subscriptions
