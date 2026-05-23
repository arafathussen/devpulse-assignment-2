# 🚀 DevPulse API

DevPulse is a robust, role-based backend system built to track internal technical issues and feature requests. It serves as a collaborative platform where software development teams can securely report bugs, propose new features, and manage workflow resolutions.

---

## 🌐 Project Links

- **Live API (Vercel):** [https://devpulse-serverapi.vercel.app](https://devpulse-serverapi.vercel.app)
- **GitHub Repository:** [https://github.com/arafathussen/devpulse-assignment-2](https://github.com/arafathussen/devpulse-assignment-2)

---

## ✨ Key Features

- **Secure Authentication:** User registration and login flows protected by JWT and bcrypt password hashing.
- **Role-Based Access Control (RBAC):** Distinct permissions for `contributor` and `maintainer` roles to ensure secure issue management.
- **Advanced Issue Tracking:** Full CRUD operations for managing system bugs and feature requests.
- **Dynamic Filtering & Sorting:** Fetch issues sorted by creation date (`newest`/`oldest`) and filtered by `type` or `status`.
- **High-Performance Database:** Optimized raw SQL queries utilizing the native `pg` driver, bypassing expensive SQL JOINs to meet strict architectural constraints.

---

## 🛠️ Technology Stack

| Technology | Purpose |
|-----------|---------|
| **Node.js** | Runtime environment |
| **Express.js** | Backend web framework |
| **TypeScript** | Strongly typed programming language |
| **PostgreSQL** | Relational database (hosted on NeonDB) |
| **pg** | Native PostgreSQL driver for Node.js |
| **jsonwebtoken** | Secure API authentication |
| **bcrypt** | Cryptographic password hashing |

---

## ⚙️ Local Development Setup

Follow these instructions to run the project on your local machine:

**1. Clone the repository**
```bash
git clone https://github.com/arafathussen/devpulse-assignment-2.git
cd devpulse-assignment-2
```

**2. Install dependencies**
```bash
npm install
```

**3. Configure environment variables**
Create a `.env` file in the root directory and add the following:
```env
DATABASE_URL=your_neondb_connection_string
JWT_SECRET=your_jwt_secret_key
PORT=5000
```

**4. Start the server**
```bash
npm run dev
```
The server will initialize and listen on `http://localhost:5000`.

---

## 🌐 API Reference

### 🔐 Authentication Endpoints

| HTTP Method | Route | Access Level | Description |
|--------|----------|--------|-------------|
| **POST** | `/api/auth/signup` | Public | Register a new system user |
| **POST** | `/api/auth/login` | Public | Authenticate user and receive JWT |

### 📋 Issue Management Endpoints

| HTTP Method | Route | Access Level | Description |
|--------|----------|--------|-------------|
| **POST** | `/api/issues` | Authenticated | Submit a new issue |
| **GET** | `/api/issues` | Public | Retrieve all issues (supports queries) |
| **GET** | `/api/issues/:id` | Public | Retrieve detailed view of a single issue |
| **PATCH** | `/api/issues/:id` | Authenticated | Modify an existing issue |
| **DELETE** | `/api/issues/:id` | Maintainer Only | Permanently delete an issue |

**Available Query Parameters for `GET /api/issues`:**
- `sort`: `newest` (default) or `oldest`
- `type`: `bug` or `feature_request`
- `status`: `open`, `in_progress`, or `resolved`

---

## 🗄️ Database Architecture

### `users` Table
| Column | Data Type | Properties |
|-------|------|-------|
| `id` | SERIAL | Primary Key |
| `name` | VARCHAR(100) | Required |
| `email` | VARCHAR(255) | Unique, Required |
| `password` | TEXT | Hashed for security |
| `role` | VARCHAR(20) | `contributor` (default) or `maintainer` |
| `created_at` | TIMESTAMP | Auto-generated |
| `updated_at` | TIMESTAMP | Auto-updated |

### `issues` Table
| Column | Data Type | Properties |
|-------|------|-------|
| `id` | SERIAL | Primary Key |
| `title` | VARCHAR(150) | Required |
| `description` | TEXT | Required |
| `type` | VARCHAR(50) | `bug` or `feature_request` |
| `status` | VARCHAR(50) | `open` (default), `in_progress`, `resolved` |
| `reporter_id` | INTEGER | References user ID |
| `created_at` | TIMESTAMP | Auto-generated |
| `updated_at` | TIMESTAMP | Auto-updated |

---

## 🛡️ Role & Permission Matrix

| Operation | Contributor | Maintainer |
|--------|-------------|------------|
| View Public Endpoints | ✅ Allowed | ✅ Allowed |
| Create New Issues | ✅ Allowed | ✅ Allowed |
| Edit Own Open Issues | ✅ Allowed | ✅ Allowed |
| Edit Anyone's Issues | ❌ Denied | ✅ Allowed |
| Change Issue Status | ❌ Denied | ✅ Allowed |
| Delete Any Issue | ❌ Denied | ✅ Allowed |

---

<br>

> *Thanks for checking out my work! Developed with strict adherence to TypeScript, Modular Architecture, and secure API best practices.*
