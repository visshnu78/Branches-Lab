# Branches Lab — Full-Stack Web Application

A modern, high-converting digital innovation hub website backed by an Express.js RESTful API, Prisma ORM, relational database (SQLite/PostgreSQL), and JWT authentication.

---

## 🚀 Features

1. **Interactive "Start a Project" Modal & Asynchronous Intake**
   - Modal inquiry intake replacing static placeholder links.
   - Client-side validation for name, email, service type, budget, timeline, and project overview.
   - Asynchronous `POST /api/inquiries` submission with loading spinner and animated toast notifications.
   - Auto-selects service when opened via individual service cards.

2. **Real-time Dynamic Service Search & Category Filtering**
   - Instant live search by keyword (title/description) with 250ms debouncing.
   - Filter pills for categories: `All`, `Strategy`, `Design`, `Engineering`, `AI & Data`, `Cloud & DevOps`, `Security`.
   - Smooth card transitions and empty search state.

3. **Dark / Light Mode Toggle with Persistence**
   - Theme toggle button in the navbar (`🌙` / `☀️`).
   - Automatically detects OS `prefers-color-scheme`.
   - Persists user selection in `localStorage`.

4. **Robust RESTful API & Database Architecture**
   - **Auth**: User registration, login with `bcryptjs` password hashing, and JWT token issuance.
   - **Inquiries**: CRUD operations for client proposals with role-based access.
   - **Services**: CRUD operations with search and category filtering query parameters.
   - **Security**: Hardened with `helmet`, `cors`, and `express-rate-limit`.
   - **Graceful Fallback**: Works immediately in-browser (mock offline mode) even before launching the Node server!

---

## 📁 Project Structure

```
branches-lab/
├── .env.example              # Environment variables template
├── .env                      # Local development environment configuration
├── package.json              # Dependencies and run scripts
├── README.md                 # Documentation & setup guide
├── index.html                # Frontend landing page with interactive integrations
├── public/
│   ├── css/
│   │   └── theme.css         # Dark/Light tokens, modal, search, and toast styles
│   └── js/
│       ├── api.js            # API client (Fetch API + graceful offline mock fallback)
│       ├── theme.js          # Dark / Light mode controller
│       ├── services.js       # Dynamic search and category filtering
│       └── modal.js          # Inquiry modal, validation, and toast notifications
└── server/
    ├── server.js             # Express.js entry point & middleware configuration
    ├── prisma/
    │   ├── schema.prisma     # Prisma database models (User, Inquiry, Service)
    │   └── seed.js           # Database seeder (Default admin + 6 core services)
    ├── middleware/
    │   ├── auth.js           # JWT verification & Admin authorization
    │   ├── errorHandler.js   # Centralized server error handling
    │   └── validate.js       # Input validation for inquiries and auth
    └── routes/
        ├── auth.routes.js    # /api/auth endpoints
        ├── inquiry.routes.js # /api/inquiries endpoints
        └── service.routes.js # /api/services endpoints
```

---

## 🛠️ Quickstart & Local Setup

### 1. Prerequisites
Install [Node.js (LTS version 18 or 20+)](https://nodejs.org/) on your machine:
```powershell
# Using Windows winget:
winget install OpenJS.NodeJS.LTS
```

### 2. Install Dependencies
Open a terminal in the project root:
```bash
npm install
```

### 3. Initialize Database & Seed Data
```bash
# Push the Prisma schema to create the SQLite database (dev.db)
npm run prisma:push

# Seed the database with default services and admin user
npm run seed
```

*Default Admin Account created by seed:*
- **Email:** `admin@brancheslab.com`
- **Password:** `AdminPass2026!`

### 4. Start the Server
```bash
# Production mode
npm start

# Or development mode with auto-reload (requires nodemon)
npm run dev
```

The application will be live at: **`http://localhost:5000`**

---

## 📡 API Reference

### Authentication (`/api/auth`)
| Method | Endpoint | Access | Description |
|---|---|---|---|
| `POST` | `/api/auth/register` | Public | Register client account (`{ name, email, password }`) |
| `POST` | `/api/auth/login` | Public | Login and receive JWT token (`{ email, password }`) |
| `GET` | `/api/auth/me` | Protected | Get current user profile (`Bearer <token>`) |

### Inquiries (`/api/inquiries`)
| Method | Endpoint | Access | Description |
|---|---|---|---|
| `POST` | `/api/inquiries` | Public | Submit project proposal |
| `GET` | `/api/inquiries` | Protected | List inquiries (Admin sees all, Client sees own) |
| `PATCH` | `/api/inquiries/:id/status` | Admin | Update status (`PENDING`, `IN_REVIEW`, `ACCEPTED`, `REJECTED`) |
| `DELETE` | `/api/inquiries/:id` | Admin | Delete an inquiry |

### Services (`/api/services`)
| Method | Endpoint | Access | Description |
|---|---|---|---|
| `GET` | `/api/services` | Public | Get services with optional `?category=...&search=...` |
| `POST` | `/api/services` | Admin | Create a new service offering |
| `PUT` | `/api/services/:id` | Admin | Update an existing service |
| `DELETE` | `/api/services/:id` | Admin | Delete a service |

---

## 🌐 Production Deployment Guide

### Option A: Unified Deployment on Render / Railway
1. Push your repository to GitHub.
2. In [Render](https://render.com) or [Railway](https://railway.app), create a new **Web Service** pointing to your repository.
3. Set the following environment variables:
   - `PORT`: `5000`
   - `NODE_ENV`: `production`
   - `DATABASE_URL`: `postgresql://user:pass@host:5432/dbname` (attach a managed Postgres database).
   - `JWT_SECRET`: A strong random string (e.g. 64 hex characters).
   - `CORS_ORIGIN`: Your production domain.
4. Set Build Command: `npm install && npx prisma db push --schema=server/prisma/schema.prisma && node server/prisma/seed.js`
5. Set Start Command: `npm start`

### Option B: Decoupled (Vercel Frontend + Render Backend)
- **Frontend**: Deploy the root directory to Vercel. In `public/js/api.js`, set `API_BASE_URL` to your Render backend URL.
- **Backend**: Deploy the `/server` directory to Render with CORS set to your Vercel domain.
