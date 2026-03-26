# New Supabase Project Setup Guide (Urdu/English)

یہ گائیڈ آپ کو ایک نئے Supabase پروجیکٹ کو set up کرنے میں مدد کرے گی۔

## Step 1: Supabase Project بنائیں (Create Supabase Project)

1. **Supabase website پر جائیں:**
   - [https://supabase.com](https://supabase.com) پر جائیں
   - "Start your project" یا "Sign up" پر کلک کریں

2. **Account بنائیں یا Login کریں:**
   - Google/GitHub account سے sign in کر سکتے ہیں
   - یا email/password سے account بنائیں

3. **New Project بنائیں:**
   - Dashboard پر "New Project" button پر کلک کریں
   - Organization select کریں (یا نیا بنائیں)

4. **Project Details بھریں:**
   - **Project Name**: `mern-cv-portfolio` (یا کوئی بھی نام)
   - **Database Password**: ایک مضبوط password بنائیں (یہ important ہے - save کر لیں!)
   - **Region**: اپنے مقام کے قریب والی region select کریں
   - **Pricing Plan**: Free tier select کریں (shuru mein)

5. **Create Project:**
   - "Create new project" button پر کلک کریں
   - Project بننے میں 2-3 منٹ لگ سکتے ہیں
   - Wait کریں until project ready ہو جائے

---

## Step 2: Project Credentials حاصل کریں (Get API Keys)

1. **Settings میں جائیں:**
   - Left sidebar میں ⚙️ "Settings" icon پر کلک کریں
   - یا project dashboard پر "Settings" tab select کریں

2. **API Section:**
   - Settings menu سے "API" option select کریں

3. **Credentials Copy کریں:**
   - **Project URL**: 
     - یہ کچھ ایسا لگے گا: `https://xxxxxxxxxxxxx.supabase.co`
     - "Project URL" کے سامنے والی value copy کریں
   
   - **Anon public key**:
     - یہ ایک لمبی string ہے جو `eyJ...` سے شروع ہوتی ہے
     - "anon public" key copy کریں (service_role key مت استعمال کریں!)

---

## Step 3: Configuration File Update کریں

1. **`src/config/supabase.js` file کھولیں:**
   ```bash
   # یہ file project root میں ہونی چاہیے
   src/config/supabase.js
   ```

2. **Nayi values paste کریں:**
   - Purani `supabaseUrl` کو نئے Project URL سے replace کریں
   - Purani `supabaseAnonKey` کو نئے Anon public key سے replace کریں

   **Example:**
   ```javascript
   import { createClient } from '@supabase/supabase-js'

   // نئے Supabase project کے credentials
   const supabaseUrl = 'https://your-new-project-id.supabase.co'  // ← یہاں نئی URL
   const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'  // ← یہاں نئی key

   export const supabase = createClient(supabaseUrl, supabaseAnonKey)

   // Database table names (یہ change نہیں کرنی)
   export const TABLES = {
     USER_DATA: 'user_data',
     HOME_DATA: 'home_data',
     ABOUT_DATA: 'about_data',
     SERVICE_DATA: 'service_data',
     PORTFOLIO_DATA: 'portfolio_data',
     NEWS_DATA: 'news_data',
     CONTACT_DATA: 'contact_data'
   }
   ```

3. **File save کریں** (Ctrl+S)

---

## Step 4: Database Tables بنائیں (Create Tables)

1. **Supabase Dashboard میں جائیں:**
   - Left sidebar میں "SQL Editor" پر کلک کریں
   - یا project dashboard سے "SQL Editor" tab select کریں

2. **New Query بنائیں:**
   - "New Query" button پر کلک کریں
   - یا "+ New Query" option select کریں

3. **SQL Schema Copy کریں:**
   - Apne project mein `supabase-schema.sql` file کھولیں
   - **پوری file کا content** copy کریں (Ctrl+A, Ctrl+C)
   - SQL Editor میں paste کریں (Ctrl+V)

4. **SQL Run کریں:**
   - "Run" button پر کلک کریں (یا F5 press کریں)
   - یا Ctrl+Enter press کریں

5. **Success Message چیک کریں:**
   - آپ کو "Success" message دکھنا چاہیے
   - اگر error آئے تو message پڑھیں اور fix کریں

---

## Step 5: Tables Verify کریں (Check Tables Created)

1. **Table Editor میں جائیں:**
   - Left sidebar میں "Table Editor" پر کلک کریں
   - یا project dashboard سے "Table Editor" tab select کریں

2. **Tables Check کریں:**
   - درج ذیل tables نظر آنی چاہئیں:
     - ✅ `user_data`
     - ✅ `home_data`
     - ✅ `about_data`
     - ✅ `service_data`
     - ✅ `portfolio_data`
     - ✅ `news_data`
     - ✅ `contact_data`
     - ✅ `security_settings`

3. **Agar koi table nahi hai:**
   - Step 4 دوبارہ چیک کریں
   - SQL schema properly paste کیا گیا ہے یا نہیں

---

## Step 6: RLS Policies چیک کریں (Verify Permissions)

1. **Authentication > Policies:**
   - Left sidebar میں "Authentication" expand کریں
   - "Policies" پر کلک کریں
   - یا Table Editor میں ہر table کے ساتھ "🔒" icon دیکھیں

2. **ہر table کے لیے policies verify کریں:**
   - ہر table کے لیے یہ policies ہونی چاہئیں:
     - ✅ "Allow public read access" (SELECT)
     - ✅ "Allow public insert access" (INSERT)
     - ✅ "Allow public update access" (UPDATE)

3. **Agar policies nahi hain:**
   - `supabase-schema.sql` file دوبارہ run کریں
   - یا manually policies add کریں

---

## Step 7: Test کریں (Test the Connection)

1. **React App Start کریں:**
   ```bash
   npm start
   ```

2. **Browser میں test URLs کھولیں:**
   - `http://localhost:3000/makeabout` - About page edit
   - `http://localhost:3000/makehome` - Home page edit
   - `http://localhost:3000/makecv` - CV form

3. **Data Save Test:**
   - کسی بھی page میں data fill کریں
   - "Save Changes" button پر کلک کریں
   - Success message آنا چاہیے

4. **Supabase Dashboard میں verify:**
   - Supabase dashboard → Table Editor
   - Related table میں data نظر آنا چاہیے

---

## Common Issues aur Solutions

### ❌ "Network error" آ رہا ہے:
1. **Supabase project active ہے یا نہیں چیک کریں:**
   - Dashboard میں project status "Active" ہونا چاہیے
   - Agar paused ہے تو "Resume" button پر کلک کریں

2. **Credentials verify کریں:**
   - `src/config/supabase.js` میں URL aur key correct ہیں یا نہیں
   - Copy-paste properly ہوا ہے یا نہیں

3. **Internet connection چیک کریں**

### ❌ "Table does not exist" error:
- SQL schema properly run نہیں ہوا
- `supabase-schema.sql` دوبارہ SQL Editor میں run کریں

### ❌ "Permission denied" error:
- RLS policies properly set نہیں ہیں
- `supabase-schema.sql` دوبارہ run کریں
- یا manually policies add کریں

### ❌ Browser console میں errors:
- Browser console کھولیں (F12)
- Error messages پڑھیں
- Detailed error copy کریں اور search کریں

---

## Important Notes (اہم نوٹس)

1. **Database Password:**
   - Project banate waqt jo password diya tha، وہ save کر لیں
   - اگر بھول گئے تو project settings سے reset کیا جا سکتا ہے

2. **API Keys Security:**
   - `anon` key public ہے (browser mein use hoti hai) - یہ safe ہے
   - `service_role` key کبھی browser/client code میں مت use کریں!
   - Production mein environment variables use کریں

3. **Free Tier Limits:**
   - Free tier پر کچھ limits ہیں (500MB database, etc.)
   - Agar project بڑا ہے تو paid plan consider کریں

4. **Region Selection:**
   - اپنے location کے قریب والی region select کریں
   - اس سے speed بہتر ہو گی

---

## Next Steps

1. ✅ Data save test کریں
2. ✅ Images properly load ہو رہی ہیں یا نہیں
3. ✅ All pages properly work کر رہی ہیں یا نہیں
4. ✅ Browser console میں کسی error کو چیک کریں

Agar کوئی issue ہے تو browser console کی errors share کریں! 🚀

