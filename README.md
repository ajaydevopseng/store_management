# BizFlow — Full-Stack Business Management System

A complete inventory, billing, and employee management application built with React, Node.js, Express, and MySQL.

---

## 🗂 Project Structure

```
bizflow/
├── backend/                  # Node.js + Express API
│   ├── config/
│   │   └── db.js             # MySQL connection pool
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── productController.js
│   │   ├── invoiceController.js
│   │   ├── employeeController.js
│   │   └── dashboardController.js
│   ├── middleware/
│   │   ├── auth.js           # JWT authentication + role-based auth
│   │   └── errorHandler.js
│   ├── routes/
│   │   └── index.js          # All API routes
│   ├── .env.example
│   ├── package.json
│   └── server.js             # Express app entry point
│
├── frontend/                 # React application
│   ├── public/
│   │   └── index.html
│   ├── src/
│   │   ├── components/
│   │   │   └── layout/
│   │   │       └── Layout.js # Sidebar + navigation shell
│   │   ├── context/
│   │   │   └── AuthContext.js
│   │   ├── pages/
│   │   │   ├── Login.js
│   │   │   ├── Dashboard.js
│   │   │   ├── Inventory.js
│   │   │   ├── Billing.js
│   │   │   ├── InvoiceDetail.js
│   │   │   ├── Employees.js
│   │   │   └── Users.js
│   │   ├── utils/
│   │   │   └── api.js        # Axios instance
│   │   ├── App.js
│   │   ├── index.js
│   │   └── index.css         # Global styles + design system
│   └── package.json
│
└── database/
    └── schema.sql            # Full DB schema + sample data
```

---

## ⚙️ Prerequisites

- Node.js v18+
- MySQL 8.0+
- npm or yarn

---

## 🚀 Setup Instructions

### Step 1 — Database Setup

1. Open MySQL and create the database:

```sql
mysql -u root -p
```

2. Run the schema file:

```bash
mysql -u root -p < database/schema.sql
```

This creates all tables and inserts sample data including a default admin user.

---

### Step 2 — Backend Setup

```bash
cd backend
npm install
```

Copy the environment file and configure it:

```bash
cp .env.example .env
```

Edit `.env`:

```env
PORT=5000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=bizflow
JWT_SECRET=change_this_to_a_long_random_string_in_production
JWT_EXPIRES_IN=7d
NODE_ENV=development
FRONTEND_URL=http://localhost:3000
```

Start the backend:

```bash
# Development (with auto-reload)
npm run dev

# Production
npm start
```

Backend runs on: `http://localhost:5000`

---

### Step 3 — Frontend Setup

```bash
cd frontend
npm install
```

Copy the environment file:

```bash
cp .env.example .env
```

Edit `.env`:

```env
REACT_APP_API_URL=http://localhost:5000/api
```

Start the frontend:

```bash
npm start
```

Frontend runs on: `http://localhost:3000`

---

## 🔐 Default Login Credentials

| Role  | Email                  | Password   |
|-------|------------------------|------------|
| Admin | admin@bizflow.com      | Admin@123  |
| Staff | staff@bizflow.com      | Admin@123  |

> ⚠️ Change these passwords immediately in production!

---

## 📡 API Reference

### Authentication
| Method | Endpoint              | Description          | Auth     |
|--------|-----------------------|----------------------|----------|
| POST   | /api/auth/login       | Login user           | Public   |
| GET    | /api/auth/me          | Get current user     | Required |
| PUT    | /api/auth/change-password | Change password  | Required |

### Users (Admin only)
| Method | Endpoint        | Description   |
|--------|-----------------|---------------|
| GET    | /api/users      | List all users |
| POST   | /api/users      | Create user   |
| PUT    | /api/users/:id  | Update user   |

### Products (Inventory)
| Method | Endpoint                  | Description          | Admin Only |
|--------|---------------------------|----------------------|------------|
| GET    | /api/products             | List products (paginated, filterable) | No |
| GET    | /api/products/:id         | Get single product   | No         |
| GET    | /api/products/low-stock   | Get low-stock items  | No         |
| GET    | /api/products/categories  | Get categories       | No         |
| GET    | /api/products/export      | Export as CSV        | No         |
| POST   | /api/products             | Create product       | Yes        |
| PUT    | /api/products/:id         | Update product       | Yes        |
| DELETE | /api/products/:id         | Soft-delete product  | Yes        |

**Query Parameters for GET /products:**
- `search` — search by name or SKU
- `category` — filter by category ID
- `low_stock=true` — show only low-stock items
- `page`, `limit` — pagination
- `all=true` — return all (no pagination, for dropdowns)

### Invoices (Billing)
| Method | Endpoint              | Description           | Admin Only |
|--------|-----------------------|-----------------------|------------|
| GET    | /api/invoices         | List invoices         | No         |
| GET    | /api/invoices/:id     | Invoice + line items  | No         |
| GET    | /api/invoices/:id/pdf | Download PDF          | No         |
| GET    | /api/invoices/stats   | Revenue stats         | No         |
| GET    | /api/invoices/export  | Export as CSV         | No         |
| POST   | /api/invoices         | Create invoice        | No         |
| PUT    | /api/invoices/:id     | Update status/details | No         |
| DELETE | /api/invoices/:id     | Cancel invoice        | Yes        |

### Employees
| Method | Endpoint                        | Description            | Admin Only |
|--------|---------------------------------|------------------------|------------|
| GET    | /api/employees                  | List employees         | No         |
| GET    | /api/employees/:id              | Employee + attendance  | No         |
| GET    | /api/employees/stats            | Headcount & payroll    | No         |
| GET    | /api/employees/departments      | Distinct departments   | No         |
| GET    | /api/employees/attendance       | Monthly attendance log | No         |
| GET    | /api/employees/export           | Export as CSV          | No         |
| POST   | /api/employees                  | Add employee           | Yes        |
| PUT    | /api/employees/:id              | Update employee        | Yes        |
| DELETE | /api/employees/:id              | Remove employee        | Yes        |
| POST   | /api/employees/:id/attendance   | Mark attendance        | No         |

### Dashboard
| Method | Endpoint       | Description                    |
|--------|----------------|--------------------------------|
| GET    | /api/dashboard | KPIs, charts, recent activity  |

---

## 🏗️ Database Schema Overview

```
users          — System login accounts (admin/staff)
employees      — Employee records & HR data
attendance     — Daily check-in/check-out log
categories     — Product categories
products       — Inventory items with stock tracking
customers      — Customer records (linked to invoices)
invoices       — Invoice headers with totals & tax
invoice_items  — Line items per invoice (FK to products)
```

### Key Relationships
- `invoice_items.invoice_id` → `invoices.id` (CASCADE DELETE)
- `invoice_items.product_id` → `products.id` (SET NULL on delete)
- `attendance.employee_id` → `employees.id` (CASCADE DELETE)
- `products.category_id` → `categories.id` (SET NULL on delete)

---

## ✨ Features Summary

### 📦 Inventory
- Add, edit, soft-delete products
- Track stock quantity with per-product low-stock thresholds
- Color-coded low stock & out-of-stock indicators
- Search by name/SKU, filter by category
- Paginated results + CSV export

### 🧾 Billing
- Create multi-line invoices with product picker (auto-fills price from inventory)
- Support custom line items (no product SKU required)
- Auto-calculate subtotal → discount → GST → total
- Discount as percentage or fixed amount
- PDF invoice generation (server-side, via PDFKit)
- Status workflow: Draft → Sent → Paid / Overdue / Cancelled
- Deducts stock automatically on invoice creation

### 👥 Employees
- Full CRUD for employee records
- Department grouping, salary tracking
- Attendance marking (present/absent/late/half-day) with check-in/out times
- Payroll summary stats
- CSV export

### 🔒 Auth & Security
- JWT-based authentication (7-day expiry)
- Passwords hashed with bcrypt (cost factor 10)
- Role-based middleware: admin vs staff
- All routes protected; admin-only routes return 403 for staff
- Token validated on every request

### 📊 Dashboard
- Monthly revenue & invoice count
- Pending amount tracking
- 6-month revenue area chart (Recharts)
- Top 5 products by units sold (last 30 days)
- Recent invoices with status
- Low-stock alert panel

---

## 🌐 Deployment Guide

### Backend (e.g., Railway, Render, EC2)

1. Set all `.env` variables as environment variables on your platform
2. Set `NODE_ENV=production`
3. Set `FRONTEND_URL` to your deployed frontend URL
4. Run `npm start`

### Frontend (e.g., Vercel, Netlify)

1. Set `REACT_APP_API_URL` to your backend URL
2. Run `npm run build`
3. Deploy the `build/` folder

### Nginx Reverse Proxy (optional)

```nginx
server {
    listen 80;
    server_name yourdomain.com;

    location /api {
        proxy_pass http://localhost:5000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }

    location / {
        root /var/www/bizflow/build;
        try_files $uri /index.html;
    }
}
```

---

## 🛡️ Security Checklist for Production

- [ ] Change `JWT_SECRET` to a cryptographically random 64+ character string
- [ ] Change all default passwords
- [ ] Set `NODE_ENV=production`
- [ ] Enable HTTPS (SSL certificate)
- [ ] Set `FRONTEND_URL` to exact production domain
- [ ] Use environment variables — never hardcode secrets
- [ ] Enable MySQL user with minimal required permissions
- [ ] Set up regular database backups

---

## 🧩 Tech Stack

| Layer      | Technology              |
|------------|-------------------------|
| Frontend   | React 18, React Router v6, Recharts, Lucide Icons |
| Styling    | Custom CSS Design System (dark theme, CSS variables) |
| State Mgmt | React Context + useState/useEffect hooks |
| HTTP Client | Axios with interceptors |
| Backend    | Node.js, Express 4      |
| Auth       | JWT + bcryptjs          |
| Database   | MySQL 8 with mysql2 driver |
| PDF        | PDFKit (server-side)    |
| CSV Export | json2csv                |
| Security   | Helmet, CORS            |

---

## 📝 License

MIT — free to use and modify for any purpose.
