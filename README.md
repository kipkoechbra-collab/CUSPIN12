# 🎄 Chardon Holiday Market

A full-stack, European-inspired Christmas Market event platform for the historic **Chardon Holiday Market** in Chardon Square, Ohio. Built with React, TypeScript, Tailwind CSS, Node.js, Express, PostgreSQL, and Prisma ORM.

---

## 🎨 Visual Identity & Aesthetic

- **Primary Brand Color**: Deep Forest Green (`#173F35`)
- **Background**: Soft Warm Cream (`#F6F0E4`)
- **Accents**: Muted Champagne Gold (`#D4AF37`, `#DFBD69`), Soft Beige, White, Dark Charcoal text
- **Typography**: European Old-World Display (`Cinzel`), Editorial Classic (`Playfair Display`), Clean Modern Sans (`Inter`)

---

## 🚀 Features

### 🌟 Public Website
- **Hero Section**: Countdown timer to Opening Day (November 28, 2026), "Plan Your Visit", "Become a Vendor", and "Become a Sponsor" call-to-actions.
- **Top Announcement Bar**: Live notices regarding application windows and holiday updates.
- **The Magic of the Market**: Five curated experience pillars:
  - 🛍️ *Shop Unique* (handcrafted goods, candles, ornaments)
  - ✨ *Festive Fun* (twinkling lights, carriage rides, holiday spirit)
  - 🎶 *Holiday Entertainment* (live caroling, brass quintets, acoustic folk)
  - 🪵 *Local Makers* (talented Ohio artisans & woodcraft)
  - ☕ *Food & Drinks* (hot cocoa, spiced mulled cider, gingerbread)
- **4 Holiday Market Weekends**:
  - **Weekend 1**: November 28–29 (Grand Opening & Tree Lighting)
  - **Weekend 2**: December 4–6 (St. Nicholas & Confections Weekend)
  - **Weekend 3**: December 11–13 (Artisan & Master Woodcraft)
  - **Weekend 4**: December 18–20 (Solstice Magic & Grand Finale)
  - **Location**: Historic Chardon Square, Chardon, Ohio
- **Artisan Vendor Directory**: Searchable directory with product category & weekend filters.
- **Sponsorship Portal**: Tier breakdowns ($500 – $5,000) and online sponsorship contact inquiry form.
- **FAQ Accordion**: Categorized answers for general attendees, vendors, and sponsors.
- **Contact Us**: Direct inquiry form with submissions securely persisted in the database.
- **Newsletter**: Real-time subscriber registration with CSV export capability in admin.

### 📝 Vendor Application System & Workflow
**CRITICAL RULE**: Vendors are never automatically charged upon application submission.
```
1. Application Submitted (Status: PENDING)
     ↓
2. Selection Committee Review (Status: UNDER_REVIEW)
     ↓
3. Official Acceptance (Status: APPROVED → AWAITING_PAYMENT)
     ↓
4. Vendor Receives Payment Option in Vendor Portal
     ↓
5. Vendor Completes Space Fee Payment
     ↓
6. Space Confirmed (Status: PAID / CONFIRMED)
```

#### Vendor Packages:
1. **Single Weekend Vendor ($200)**:
   - Vendor space for one selected weekend
   - Choice of available weekend
   - Website vendor directory listing
   - Weekend vendor map inclusion
   - Market setup communications
2. **Season Vendor ($800)**:
   - Vendor space for all 4 market weekends
   - Website vendor directory listing
   - Vendor map inclusion for all weekends
   - Market setup communications
   - Dedicated social media mention

### 👤 Vendor Portal (`/vendor/dashboard`)
- Secure login and registration.
- Application tracking with live status badge (`PENDING`, `UNDER_REVIEW`, `APPROVED`, `AWAITING_PAYMENT`, `PAID`, `CONFIRMED`).
- Ability to edit business description, links, and pricing until locked by an administrator.
- Integrated payment portal for approved vendors to pay their booth fee.
- Direct messaging and announcement inbox from market coordinators.

### 🛡️ Protected Admin Dashboard (`/admin`)
- **Dashboard Overview**:
  - Total Applications, Pending, Approved, Rejected, Awaiting Payment, Paid Vendors
  - Single Weekend vs Full Season distribution
  - Total Collected Revenue ($)
  - Visual category & pipeline charts
- **Application Management**:
  - Filter by status (`Pending`, `Under Review`, `Approved`, `Rejected`, `Awaiting Payment`, `Paid`, `Confirmed`, `Cancelled`)
  - Filter by category and search by applicant/business name
  - Detailed modal with complete application data
  - Actions: `APPROVE`, `REJECT`, `MARK UNDER REVIEW`, `CONFIRM VENDOR`, `CANCEL`
  - Toggle Public Directory listing (`isPublicListing`)
  - Lock/Unlock vendor edits
  - Send private messages to vendor's portal
  - Complete **Admin Audit Log trail** tracking which administrator made each change
- **Payment Management**:
  - Track online and offline payments
  - Manually mark offline checks or cash payments with transaction reference notes
  - Process and record refunds with audit logging
- **Market Management**:
  - Edit market weekends, dates, opening hours, and vendor booth capacities
  - Manage Announcements and banner text
  - Manage FAQs
  - View Contact Us messages (mark as read / delete)
  - View & export Newsletter subscribers (CSV)
  - Create additional administrators
  - Update site settings (title, description, location, deadlines, pricing)

---

## 🛠️ Step-by-Step Setup Guide

### 1. Prerequisites
- Node.js 18+ or 20+
- PostgreSQL database (or Supabase Postgres instance)

### 2. Installing Dependencies
From the project root:
```bash
# Install root, backend and frontend dependencies
npm run install:all
```
Or individually:
```bash
cd server && npm install
cd ../client && npm install
```

### 3. Setting Environment Variables
Copy `.env.example` to `.env` in the root and in `server/.env`:
```env
DATABASE_URL="postgresql://postgres:[PASSWORD]@[HOST]:6543/postgres?pgbouncer=true"
DIRECT_URL="postgresql://postgres:[PASSWORD]@[HOST]:5432/postgres"

JWT_SECRET="your-secure-jwt-secret-at-least-32-characters"
JWT_REFRESH_SECRET="your-secure-refresh-secret-at-least-32-characters"
JWT_EXPIRES_IN="15m"
JWT_REFRESH_EXPIRES_IN="7d"

NODE_ENV="development"
PORT=3001
CLIENT_URL="http://localhost:5173"
SERVER_URL="http://localhost:3001"

ADMIN_SETUP_KEY="chardon-admin-setup-2024"
```

### 4. Running Prisma Database Push / Migrations
Sync the Prisma schema to your PostgreSQL database:
```bash
cd server
npx prisma db push
```

### 5. Seeding the Database & Creating Initial Admin
Run the automated seed script to populate market weekends, FAQs, announcements, site settings, and the default admin user:
```bash
cd server
npm run seed
```
**Default Admin Credentials:**
- **Email**: `admin@chardonholidaymarket.com`
- **Password**: `admin123456`

*(You can create additional administrators securely from `/admin/users` after logging in.)*

### 6. Running Locally
Start both backend (Express on port 3001) and frontend (Vite on port 5173):
```bash
# Run from root
npm run dev
```
Or run separately:
```bash
# Terminal 1 (Backend)
cd server && npm run dev

# Terminal 2 (Frontend)
cd client && npm run dev
```

Visit the website at: **`http://localhost:5173`**
Admin portal: **`http://localhost:5173/admin`**

### 7. Building for Production
```bash
# Build server and client
npm run build
```
Outputs:
- Server: `server/dist/`
- Client: `client/dist/`

### 8. Deploying to Vercel
1. Push this repository to GitHub.
2. In the [Vercel Dashboard](https://vercel.com), click **Add New Project** and import the repository.
3. Configure the Project Settings:
   - **Framework Preset**: Vite
   - **Root Directory**: `./client`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
4. For the backend API, you can either:
   - Deploy `server/` to Render, Railway, or AWS.
   - Or deploy server routes using Vercel Serverless Functions (`/api`).
5. Add the environment variables (`DATABASE_URL`, `DIRECT_URL`, `JWT_SECRET`, etc.) in the Vercel Project Settings.

---

## 🔒 Security Best Practices
- Passwords hashed using bcrypt (12 salt rounds).
- JWT Authentication with role-based access control (`VENDOR`, `ADMIN`).
- Rate limiting on authentication routes and contact form submissions.
- Strict helmet HTTP security headers and CORS whitelisting.
- Input validation on all endpoints with Zod schemas.
- Non-destructive and destructive action confirmation dialogs with persistent audit trail.
