# Maikal Natural Foundation — Website

A full-stack website for Maikal Natural Foundation with a React frontend, Node.js/Express backend, and SQL Server database.

---

## Project Structure

```
kirotest/
├── backend/          ← Node.js + Express API
│   ├── src/
│   │   ├── routes/   ← All API routes
│   │   ├── config/   ← DB config, init.sql
│   │   ├── middleware/
│   │   └── utils/    ← upload.js (multer)
│   ├── uploads/      ← Uploaded images & PDFs (auto-created)
│   ├── public/       ← React build output (auto-generated)
│   └── .env          ← Environment variables (create from .env.example)
│
├── maikal-frontend/  ← React (Vite) frontend
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   │   └── admin/tabs/
│   │   ├── context/
│   │   └── utils/
│   └── public/images/ ← Static images
│
└── frontend/         ← Legacy HTML frontend (kept as backup)
```

---

## Prerequisites

- Node.js 18+
- SQL Server (local or remote)
- npm

---

## 1. Database Setup

Open **SSMS** and run `backend/src/config/init.sql` against your SQL Server.

This creates all tables:
- `admins`, `products`, `posts`, `gallery`, `contacts`
- `activities`, `publications`, `hero_slides`, `testimonials`

And seeds default data (admin user, products, hero slides, testimonials).

**Default admin credentials:**
- Email: `admin@maikalnatural.org`
- Password: `Maikal@2024`

---

## 2. Backend Setup

```bash
cd backend

# Copy and fill in your environment variables
copy .env.example .env
```

Edit `.env`:
```env
PORT=5000
NODE_ENV=production
JWT_SECRET=your_strong_secret_here
JWT_EXPIRES_IN=24h

DB_SERVER=your_sql_server_host
DB_PORT=1433
DB_DATABASE=maikal_natural
DB_USER=sa
DB_PASSWORD=your_db_password
DB_ENCRYPT=false
DB_TRUST_SERVER_CERTIFICATE=true
```

Install dependencies:
```bash
npm install
```

---

## 3. Build React Frontend

```bash
cd maikal-frontend
npm install
npm run build
```

This builds the React app into `backend/public/` — the Express server serves it automatically.

---

## 4. Run in Production

```bash
cd backend
npm run start:prod
```

Open `http://localhost:5000` — the full website is served from a single port.

- Website: `http://localhost:5000`
- Admin panel: `http://localhost:5000/admin`
- API: `http://localhost:5000/api`

---

## 5. Development Mode (two terminals)

**Terminal 1 — Backend:**
```bash
cd backend
npm run dev
```

**Terminal 2 — React frontend:**
```bash
cd maikal-frontend
npm run dev
```

- Frontend: `http://localhost:3000`
- Backend API: `http://localhost:5000`
- Swagger docs: `http://localhost:5000/api-docs`

---

## Admin Panel Features

| Tab | What admin can do |
|-----|-------------------|
| 🛒 Products | Add/edit/delete products with image upload |
| 📰 Posts | Add/edit/delete blog posts |
| 🖼️ Gallery | Add/delete gallery images |
| 🌿 Activities | Add/edit/delete activities with multi-image upload |
| 📚 Publications | Upload PDFs with cover images, public can download |
| 🎨 Hero Slides | Change hero slider images and text |
| ⭐ Testimonials | Add/edit/hide/delete customer testimonials |
| 💬 Messages | View contact form submissions |

---

## Website Pages

| URL | Page |
|-----|------|
| `/` | Home (hero, products, stories, about, contact) |
| `/activities` | Our Activities page |
| `/publications` | Publications / magazines download page |
| `/admin` | Admin panel (login required) |

---

## File Upload Storage

Uploaded files are stored in:
- `backend/uploads/images/` — product images, activity images, hero images, publication covers
- `backend/uploads/pdfs/` — publication PDFs

These are served at `/uploads/images/filename.jpg` and `/uploads/pdfs/filename.pdf`.

**Important:** Back up the `uploads/` folder when deploying — it contains all uploaded content.

---

## Deployment Checklist

- [ ] SQL Server running and accessible
- [ ] `backend/.env` created with correct DB credentials and strong `JWT_SECRET`
- [ ] `cd maikal-frontend && npm install && npm run build`
- [ ] `cd backend && npm install`
- [ ] `cd backend && npm run start:prod`
- [ ] Run `init.sql` in SSMS to create tables
- [ ] Test login at `/admin` with `admin@maikalnatural.org` / `Maikal@2024`
- [ ] Change admin password after first login
