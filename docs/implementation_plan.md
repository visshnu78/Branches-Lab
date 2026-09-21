# Full-Stack Implementation Plan — Branches Lab

Transform the static "Branches Lab" website into a production-ready, full-stack web application featuring an Express.js backend, relational database, secure JWT authentication, dynamic APIs, and modern UX features.

---

## User Review Required

> [!IMPORTANT]
> **Database & Architecture Choice**:
> We propose **Node.js + Express** with **Prisma ORM** and **SQLite** for development (with zero-config local setup) that can seamlessly switch to **PostgreSQL** in production with a single environment variable change (`DATABASE_URL`).
> 
> Please review and confirm if you prefer **SQLite/PostgreSQL** or would rather use **MongoDB / Mongoose**.

> [!NOTE]
> All code will be structured cleanly into a unified repository with a `/server` backend directory and `/public` or root frontend directory for easy local development and deployment.

---

## 1. Tech Stack Selection & Justification

| Component | Choice | Rationale |
|---|---|---|
| **Runtime & Framework** | **Node.js + Express.js** | Unifies the entire stack in JavaScript/TypeScript. Huge ecosystem, lightweight, non-blocking I/O ideal for RESTful API services. |
| **Database & ORM** | **Prisma + SQLite (Dev) / PostgreSQL (Prod)** | Prisma provides type-safe schema modeling, automatic migrations, and flexibility. SQLite requires zero external services locally, while PostgreSQL handles scale in production. |
| **Authentication** | **JWT (JSON Web Tokens) + bcryptjs** | Stateless authentication suitable for decoupled frontend/backend. Secure password hashing with salt rounds. |
| **Validation & Security** | **Zod / Joi, Helmet, CORS, express-rate-limit** | Mitigates common vulnerabilities (XSS, brute force, header poisoning, CORS misconfigurations). |
| **Frontend** | **Vanilla JS (ES6 Modules) + Fetch API** | Preserves the ultra-fast, lightweight (~15KB) footprint of the existing site without introducing heavy framework overhead. |

---

## 2. Database Schema (Prisma Schema)

```prisma
// server/prisma/schema.prisma

datasource db {
  provider = "sqlite" // Change to "postgresql" for production
  url      = env("DATABASE_URL")
}

generator client {
  provider = "prisma-client-js"
}

model User {
  id           String      @id @default(uuid())
  email        String      @unique
  passwordHash String
  name         String
  role         String      @default("CLIENT") // "CLIENT" | "ADMIN"
  createdAt    DateTime    @default(now())
  updatedAt    DateTime    @updatedAt
  inquiries    Inquiry[]
}

model Inquiry {
  id          String      @id @default(uuid())
  clientName  String
  email       String
  company     String?
  serviceType String
  budget      String
  timeline    String
  details     String
  status      String      @default("PENDING") // "PENDING" | "IN_REVIEW" | "ACCEPTED" | "REJECTED"
  userId      String?
  user        User?       @relation(fields: [userId], references: [id])
  createdAt   DateTime    @default(now())
  updatedAt   DateTime    @updatedAt
}

model Service {
  id          String      @id @default(uuid())
  title       String
  slug        String      @unique
  category    String      // "STRATEGY" | "DESIGN" | "ENGINEERING" | "AI_DATA" | "INFRASTRUCTURE" | "SECURITY"
  description String
  icon        String
  featured    Boolean     @default(false)
  createdAt   DateTime    @default(now())
  updatedAt   DateTime    @updatedAt
}
```

---

## 3. RESTful API Endpoints

### Authentication (`/api/auth`)
- `POST /api/auth/register` — Create new client or admin account (validates email, hashes password with `bcryptjs`).
- `POST /api/auth/login` — Authenticate user and issue JWT cookie/bearer token.
- `GET /api/auth/me` — Return currently authenticated user profile (protected via JWT middleware).

### Project Inquiries (`/api/inquiries`)
- `POST /api/inquiries` — Public endpoint: submit a project proposal with budget, timeline, and details.
- `GET /api/inquiries` — Protected (Admin/Client): list inquiries (Admin sees all; Client sees their own).
- `PATCH /api/inquiries/:id/status` — Protected (Admin): update status (`PENDING` → `IN_REVIEW` → `ACCEPTED`).
- `DELETE /api/inquiries/:id` — Protected (Admin): remove inquiry.

### Services (`/api/services`)
- `GET /api/services` — Public: retrieve services list with query filters (`?category=...&search=...`).
- `POST /api/services` — Protected (Admin): add new service offering.
- `PUT /api/services/:id` — Protected (Admin): update service details.
- `DELETE /api/services/:id` — Protected (Admin): delete service.

---

## 4. Proposed Features (Usability & Engagement)

### Feature 1: Interactive "Start a Project" Modal with Asynchronous Intake
- **Description**: Replaces static `#contact` anchors with an interactive multi-step or sleek modal inquiry intake form.
- **Functionality**:
  - Validates budget, timeline, service category, and project scope.
  - Submits asynchronously via `fetch` to `/api/inquiries`.
  - Displays instant visual states: loading spinner, field-level error messages, and an animated success confirmation toast.

### Feature 2: Real-time Service Search & Category Filtering
- **Description**: Adds live search bar and filter pills (All, Strategy, Design, Engineering, AI & Data, Security) to the Services section.
- **Functionality**:
  - Client-side debounced search with instant DOM updates or dynamic backend `/api/services?search=...` querying.
  - Smooth card transitions when switching categories without page reloads.

### Feature 3: Dark / Light Mode with System Preference & Local Storage Sync
- **Description**: High-contrast theme toggle accessible in the navbar.
- **Functionality**:
  - CSS custom properties (`--clr-bg`, `--clr-surface`, `--clr-text`, etc.) flipped via `data-theme="dark"`.
  - Remembers user selection in `localStorage` and detects OS `prefers-color-scheme`.

### Feature 4: Admin/Client Portal View (Bonus)
- **Description**: A dashboard overlay/page to view submitted project leads, review status, and manage active service offerings.

---

## 5. Proposed File Structure Changes

```
branches-lab/
├── .env.example
├── .gitignore
├── package.json
├── index.html                    # Frontend landing page (updated with dynamic integrations)
├── public/
│   ├── css/
│   │   └── theme.css             # Theme tokens (Light/Dark variables)
│   └── js/
│       ├── api.js                # Reusable Fetch API client (auth, inquiries, services)
│       ├── modal.js              # Inquiry Modal logic & form handling
│       ├── services.js           # Dynamic search and filtering
│       └── theme.js              # Dark/Light mode switcher
└── server/
    ├── server.js                 # Express application entry point
    ├── prisma/
    │   ├── schema.prisma         # Database models & relations
    │   └── seed.js               # Initial services & admin user seed
    ├── middleware/
    │   ├── auth.js               # JWT verification & role authorization
    │   ├── errorHandler.js       # Global error handler
    │   └── validate.js           # Request payload validator
    └── routes/
        ├── auth.routes.js        # /api/auth
        ├── inquiry.routes.js     # /api/inquiries
        └── service.routes.js     # /api/services
```

---

## 6. Deployment & Environment Strategy

### Environment Variables (`.env.example`)
```env
PORT=5000
NODE_ENV=development
DATABASE_URL="file:./dev.db"
JWT_SECRET="your-super-secret-jwt-key-change-in-production"
JWT_EXPIRES_IN="7d"
CORS_ORIGIN="http://localhost:5000"
```

### Deployment Options:
1. **PaaS (Render / Railway / Fly.io)**:
   - Deploy as a unified full-stack Node.js app serving the static frontend from `public`/root, with a managed PostgreSQL database.
2. **Decoupled (Vercel/Netlify for Frontend + Render/Railway for Backend)**:
   - Frontend hosted on CDN edge; backend runs Express API with CORS configured to the frontend domain.

---

## 7. Verification Plan

### Automated / Programmatic Verification:
- **API Test Suite / Health Checks**:
  - Test `/api/auth/register` and `/api/auth/login` to confirm JWT issuance and password hashing.
  - Test `/api/inquiries` POST validation (reject invalid email, missing required fields).
  - Test `/api/services` filtering by query parameter (`?category=ENGINEERING`).
- **Linter & Syntax Verification**:
  - Verify Express server boots with zero syntax or runtime errors.

### Manual Verification:
- Open the webpage in browser:
  - Verify the **Theme Toggle** switches between Dark and Light mode seamlessly.
  - Click **"Start a Project"**: verify modal opens, form fields validate, and submission sends data to the backend.
  - Test **Service Search and Filter**: type keywords into the search box and verify matching cards are highlighted/filtered.
  - Inspect Network tab in DevTools to ensure zero CORS or console errors.
