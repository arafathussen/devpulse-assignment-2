# 🚀 DevPulse API

> Internal Tech Issue & Feature Tracker — A collaborative platform for software teams to report bugs, suggest features, and coordinate resolutions.

## 🌐 Links

> **Live API:** `https://devpulse8106-api.vercel.app` *(Deployment link will be updated after deploy)*
> **GitHub Repo:** `https://github.com/arafathussen/devpulse-assignment-2`

---

## ✨ Features

- 🔐 JWT Authentication (Signup & Login)
- 👥 Role-Based Access Control (`contributor` / `maintainer`)
- 🐛 Create, Read, Update, Delete Issues
- 🚀 Custom No-JOIN Data Fetching Challenge
- 🔍 Filter Issues by `type`, `status`, `sort`
- ⚡ Raw PostgreSQL with native `pg` driver

---

## 🛠️ Tech Stack

| Technology | Purpose |
|-----------|---------|
| Node.js (LTS) | Runtime |
| TypeScript | Language (strict mode) |
| Express.js | Web Framework |
| PostgreSQL (NeonDB) | Database |
| `pg` | Native PostgreSQL driver |
| `bcrypt` | Password hashing |
| `jsonwebtoken` | JWT Authentication |
| `dotenv` | Environment variables |
| `cors` | Cross-origin resource sharing |

---

## 📁 Project Structure

```
src/
├── config/          # App configuration (env vars)
├── db/              # Database connection & table setup
├── middleware/       # auth.ts, globalErrorHandler.ts
├── modules/
│   ├── auth/        # signup, login (controller, service, route)
│   └── issues/      # CRUD (controller, service, route, interface)
├── types/           # TypeScript type extensions
├── utils/           # sendResponse utility
├── app.ts           # Express app setup
└── server.ts        # Entry point
```

---

## ⚙️ Setup & Run Locally

### 1. Clone the repository

```bash
git clone https://github.com/arafathussen/devpulse-assignment-2.git
cd devpulse-assignment-2
```

### 2. Install dependencies

```bash
npm install
```

### 3. Setup environment variables

Create a `.env` file in the root:

```env
DATABASE_URL=your_neondb_connection_string
JWT_SECRET=your_jwt_secret_key
PORT=5000
```

### 4. Run the development server

```bash
npm run dev
```

Server will start at: `http://localhost:5000`

---

## 🗄️ Database Schema

### Table: `users`

| Field | Type | Notes |
|-------|------|-------|
| `id` | SERIAL | Primary Key |
| `name` | VARCHAR(100) | Required |
| `email` | VARCHAR(255) | Unique, Required |
| `password` | TEXT | Hashed, never returned |
| `role` | VARCHAR(20) | `contributor` / `maintainer` |
| `created_at` | TIMESTAMP | Auto-generated |
| `updated_at` | TIMESTAMP | Auto-updated |

### Table: `issues`

| Field | Type | Notes |
|-------|------|-------|
| `id` | SERIAL | Primary Key |
| `title` | VARCHAR(150) | Required |
| `description` | TEXT | Required |
| `type` | VARCHAR(50) | `bug` / `feature_request` |
| `status` | VARCHAR(50) | `open` / `in_progress` / `resolved` |
| `reporter_id` | INTEGER | References users.id |
| `created_at` | TIMESTAMP | Auto-generated |
| `updated_at` | TIMESTAMP | Auto-updated |

---

## 🌐 API Endpoints

### 🔐 Authentication

| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| POST | `/api/auth/signup` | Public | Register a new user |
| POST | `/api/auth/login` | Public | Login and get JWT |

### 📋 Issues

| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| POST | `/api/issues` | Authenticated | Create a new issue |
| GET | `/api/issues` | Public | Get all issues (with filter & sort) |
| GET | `/api/issues/:id` | Public | Get a single issue |
| PATCH | `/api/issues/:id` | Authenticated | Update an issue |
| DELETE | `/api/issues/:id` | Maintainer only | Delete an issue |

### 🔍 Query Parameters for GET /api/issues

| Param | Values | Default |
|-------|--------|---------|
| `sort` | `newest`, `oldest` | `newest` |
| `type` | `bug`, `feature_request` | (none) |
| `status` | `open`, `in_progress`, `resolved` | (none) |

**Example:** `GET /api/issues?sort=newest&type=bug&status=open`

---

## 🔐 Authentication

Include the JWT token in the `Authorization` header (no Bearer prefix):

```
Authorization: <JWT_TOKEN>
```

---

## 📦 Response Format

### Success

```json
{
  "success": true,
  "message": "Operation description",
  "data": {}
}
```

### Error

```json
{
  "success": false,
  "message": "Error description",
  "errors": "Error details"
}
```

---

## 👥 Role Permissions

| Action | Contributor | Maintainer |
|--------|-------------|------------|
| Signup / Login | ✅ | ✅ |
| Create Issue | ✅ | ✅ |
| View Issues | ✅ | ✅ |
| Update Own Open Issue | ✅ | ✅ |
| Update Any Issue + Status | ❌ | ✅ |
| Delete Issue | ❌ | ✅ |
