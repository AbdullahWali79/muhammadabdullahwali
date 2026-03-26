# Quick Setup Checklist - New Supabase Project

یہ ایک quick checklist ہے جو آپ follow کر سکتے ہیں:

## ✅ Step-by-Step Checklist

### 1. Supabase Project بنائیں
- [ ] [supabase.com](https://supabase.com) پر جائیں
- [ ] Sign up / Login کریں
- [ ] "New Project" button پر کلک کریں
- [ ] Project details fill کریں:
  - [ ] Project name: `mern-cv-portfolio`
  - [ ] Strong database password (save کر لیں!)
  - [ ] Region select کریں
- [ ] "Create new project" پر کلک کریں
- [ ] 2-3 منٹ wait کریں (project ready ہونے کا)

### 2. API Credentials Copy کریں
- [ ] Settings → API section میں جائیں
- [ ] **Project URL** copy کریں
  - Format: `https://xxxxxxxxx.supabase.co`
- [ ] **Anon public key** copy کریں
  - Format: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`
  - ⚠️ "anon public" key use کریں (service_role نہیں!)

### 3. Code Update کریں
- [ ] `src/config/supabase.js` file کھولیں
- [ ] `supabaseUrl` update کریں (نئی URL paste کریں)
- [ ] `supabaseAnonKey` update کریں (نئی key paste کریں)
- [ ] File save کریں

### 4. Database Tables بنائیں
- [ ] Supabase Dashboard → SQL Editor
- [ ] "New Query" button پر کلک کریں
- [ ] `supabase-schema.sql` file کھولیں
- [ ] **پوری SQL content** copy کریں
- [ ] SQL Editor میں paste کریں
- [ ] "Run" button پر کلک کریں (یا F5)
- [ ] "Success" message verify کریں

### 5. Tables Verify کریں
- [ ] Table Editor میں جائیں
- [ ] یہ tables نظر آنی چاہئیں:
  - [ ] `user_data`
  - [ ] `home_data`
  - [ ] `about_data`
  - [ ] `service_data`
  - [ ] `portfolio_data`
  - [ ] `news_data`
  - [ ] `contact_data`
  - [ ] `security_settings`

### 6. Test کریں
- [ ] Terminal میں `npm start` run کریں
- [ ] Browser میں `http://localhost:3000/makeabout` کھولیں
- [ ] Password enter کریں: `7337`
- [ ] Description field میں کچھ type کریں
- [ ] "Save Changes" button پر کلک کریں
- [ ] Success message verify کریں
- [ ] Supabase Dashboard → Table Editor → `about_data`
- [ ] Data verify کریں

---

## 🔧 Agar Error آئے تو:

### Network Error
- [ ] Supabase project active ہے (paused نہیں)
- [ ] Internet connection چیک کریں
- [ ] Browser console (F12) میں errors دیکھیں

### Table Not Found
- [ ] SQL schema properly run کیا گیا ہے
- [ ] `supabase-schema.sql` دوبارہ run کریں

### Permission Denied
- [ ] RLS policies set ہیں
- [ ] SQL schema دوبارہ run کریں

---

## 📝 Credentials Save کریں

یہ information save کر لیں (safe jagah):

```
Project URL: https://___________________.supabase.co
Anon Key: eyJ____________________________________
Database Password: _____________________
```

---

**تمام steps complete ہونے کے بعد، آپ کا project ready ہو جائے گا! 🎉**

