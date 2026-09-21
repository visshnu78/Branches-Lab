# Walkthrough — Branches Lab Full-Stack Implementation

We have converted the static Branches Lab website into a complete, full-stack web application featuring an Express.js backend, relational database schema, JWT authentication, and three new interactive frontend features.

---

## 📦 What Was Built

### 1. Backend Architecture & REST APIs
- **Database & Schema**: Configured [Prisma Schema](file:///C:/Users/RC/.gemini/antigravity/scratch/branches-lab/server/prisma/schema.prisma) with models for `User` (with roles: `CLIENT`, `ADMIN`), `Inquiry` (project proposals), and `Service` (offerings).
- **Authentication**: JWT issuance, token verification in [auth middleware](file:///C:/Users/RC/.gemini/antigravity/scratch/branches-lab/server/middleware/auth.js), and password hashing via `bcryptjs`.
- **RESTful Endpoints**:
  - [`auth.routes.js`](file:///C:/Users/RC/.gemini/antigravity/scratch/branches-lab/server/routes/auth.routes.js): `/api/auth/register`, `/api/auth/login`, `/api/auth/me`.
  - [`inquiry.routes.js`](file:///C:/Users/RC/.gemini/antigravity/scratch/branches-lab/server/routes/inquiry.routes.js): `/api/inquiries` (submit proposals, list, update status, delete).
  - [`service.routes.js`](file:///C:/Users/RC/.gemini/antigravity/scratch/branches-lab/server/routes/service.routes.js): `/api/services` (query filtering by `?category=...&search=...`).
- **Security & Reliability**: Configured [Express server](file:///C:/Users/RC/.gemini/antigravity/scratch/branches-lab/server/server.js) with `helmet`, `cors`, `express-rate-limit`, and centralized [error handling](file:///C:/Users/RC/.gemini/antigravity/scratch/branches-lab/server/middleware/errorHandler.js).

---

### 2. Three New Usability Features

#### Feature 1: Interactive "Start a Project" Modal & Asynchronous Intake
- **Location**: [`public/js/modal.js`](file:///C:/Users/RC/.gemini/antigravity/scratch/branches-lab/public/js/modal.js)
- **Experience**: Clicking any "Start a Project" button opens a modal intake form with budget, timeline, and service selector.
- **Async Handling**: Dispatches asynchronous requests to `/api/inquiries`, displays button loading states (`Submitting...`), and renders animated success/error toast notifications.
- **Smart Autofill**: Clicking "Learn More" on any service card automatically opens the modal with that specific service pre-selected.

#### Feature 2: Real-time Dynamic Service Search & Category Filtering
- **Location**: [`public/js/services.js`](file:///C:/Users/RC/.gemini/antigravity/scratch/branches-lab/public/js/services.js)
- **Experience**: Interactive category pills (`All`, `Strategy`, `Design`, `Engineering`, `AI & Data`, `Cloud & DevOps`, `Security`) paired with a live, debounced search bar.
- **Dynamic Updates**: Renders matching service cards dynamically with an empty state fallback if no services match.

#### Feature 3: Dark / Light Mode Toggle with Persistence
- **Location**: [`public/js/theme.js`](file:///C:/Users/RC/.gemini/antigravity/scratch/branches-lab/public/js/theme.js) & [`public/css/theme.css`](file:///C:/Users/RC/.gemini/antigravity/scratch/branches-lab/public/css/theme.css)
- **Experience**: Clean theme toggle button in the navbar (`🌙` / `☀️`) that switches CSS custom property tokens.
- **Persistence**: Automatically respects system OS dark mode preferences and persists manual user selection across reloads via `localStorage`.

---

## 🚀 How to Run Locally

### Step 1: Install Node.js
If Node.js is not yet installed on your system, install it using PowerShell:
```powershell
winget install OpenJS.NodeJS.LTS
```
*(Or download the LTS installer directly from [nodejs.org](https://nodejs.org/)).*

### Step 2: Install Dependencies & Initialize Database
In your terminal, navigate to `C:\Users\RC\.gemini\antigravity\scratch\branches-lab` and run:
```powershell
npm install
npm run prisma:push
npm run seed
```
> [!NOTE]
> The seed script creates the initial 6 services and a default admin user:
> - **Email**: `admin@brancheslab.com`
> - **Password**: `AdminPass2026!`

### Step 3: Start the Backend Server
```powershell
npm start
```
The server will start on **`http://localhost:5000`**.

> [!TIP]
> **Zero-Breakage Guarantee**: Even if you open [`index.html`](file:///C:/Users/RC/.gemini/antigravity/scratch/branches-lab/index.html) directly in a web browser without the Node server running, the site automatically detects this and falls back to an offline simulated API mode so you can test all 3 features (modal, search, theme) immediately!

---

## 🌐 Production Deployment Summary

| Environment | Recommendations |
|---|---|
| **Render / Railway (Recommended)** | Create a Web Service connected to your repository. Set `DATABASE_URL` to a managed PostgreSQL instance and set build command to `npm install && npx prisma db push --schema=server/prisma/schema.prisma && node server/prisma/seed.js`. |
| **Vercel + Decoupled API** | Deploy frontend to Vercel and Express server to Render. Set `CORS_ORIGIN` to your Vercel URL. |
