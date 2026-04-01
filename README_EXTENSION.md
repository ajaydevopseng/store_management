# BizFlow v2 — Extension Guide

## What's new in this update

| Feature | Where |
|---|---|
| Customer OTP login (mobile) | `backend/controllers/customerAuthController.js` |
| Customer shop / cart / checkout | `frontend/src/pages/customer/Shop.js` |
| Order history (customer) | `frontend/src/pages/customer/CustomerOrders.js` |
| Admin order management | `frontend/src/pages/admin/AdminOrders.js` |
| Real-time stock enforcement | `backend/controllers/orderController.js` |
| Indian payroll calculator | `backend/controllers/salaryController.js` |
| Payroll UI (admin) | `frontend/src/pages/admin/SalaryCalculator.js` |
| DB schema additions | `database/migration_v2.sql` |

---

## Setup

### Step 1 — Run the DB migration

```bash
mysql -u root -p bizflow < database/migration_v2.sql
```

### Step 2 — Copy new backend files

```bash
cp backend/controllers/customerAuthController.js  <your-project>/backend/controllers/
cp backend/controllers/orderController.js          <your-project>/backend/controllers/
cp backend/controllers/salaryController.js         <your-project>/backend/controllers/
cp backend/middleware/customerAuth.js              <your-project>/backend/middleware/
cp backend/routes/newRoutes.js                     <your-project>/backend/routes/customer.js
```

### Step 3 — Register routes in server.js

```js
const customerRoutes = require('./routes/customer');
app.use('/api/customer', customerRoutes);

// Admin order routes (add to your existing routes/index.js)
const { authenticate, adminOnly } = require('./middleware/auth');
const orderCtrl = require('./controllers/orderController');
router.get('/admin/orders',           authenticate, orderCtrl.adminListOrders);
router.put('/admin/orders/:id/status',authenticate, adminOnly, orderCtrl.adminUpdateOrderStatus);

// Salary routes (add to existing employee routes)
const salaryCtrl = require('./controllers/salaryController');
router.get('/:id/salary-structure',  authenticate, salaryCtrl.getSalaryStructure);
router.put('/:id/salary-structure',  authenticate, adminOnly, salaryCtrl.upsertSalaryStructure);
router.post('/:id/salary/preview',   authenticate, salaryCtrl.previewSalary);
router.post('/:id/salary/generate',  authenticate, adminOnly, salaryCtrl.generateSalary);
router.get('/:id/salary',            authenticate, salaryCtrl.getSalaryRecords);
router.put('/salary/:id/pay',        authenticate, adminOnly, salaryCtrl.markPaid);
router.get('/salary/summary',        authenticate, salaryCtrl.payrollSummary);
```

### Step 4 — Add env vars (backend .env)

```env
# Leave blank in development — OTP will print to console
MSG91_AUTH_KEY=
MSG91_TEMPLATE_ID=
```

### Step 5 — Copy frontend pages

```bash
cp -r frontend/src/pages/customer  <your-project>/frontend/src/pages/
cp frontend/src/pages/admin/SalaryCalculator.js  <your-project>/frontend/src/pages/admin/
cp frontend/src/pages/admin/AdminOrders.js        <your-project>/frontend/src/pages/admin/
```

### Step 6 — Update App.js routing

```jsx
import CustomerLogin    from './pages/customer/CustomerLogin';
import Shop             from './pages/customer/Shop';
import CustomerOrders   from './pages/customer/CustomerOrders';
import AdminOrders      from './pages/admin/AdminOrders';
import SalaryCalculator from './pages/admin/SalaryCalculator';

// Customer protected route helper
function CustomerProtectedRoute({ children }) {
  const token = localStorage.getItem('customer_token');
  return token ? children : <Navigate to="/customer/login" />;
}

// Inside <Routes>:
<Route path="/customer/login"   element={<CustomerLogin />} />
<Route path="/shop"             element={<CustomerProtectedRoute><Shop /></CustomerProtectedRoute>} />
<Route path="/customer/orders"  element={<CustomerProtectedRoute><CustomerOrders /></CustomerProtectedRoute>} />
<Route path="/admin/orders"     element={<ProtectedRoute><Layout><AdminOrders /></Layout></ProtectedRoute>} />
<Route path="/salary"           element={<ProtectedRoute><Layout><SalaryCalculator /></Layout></ProtectedRoute>} />
```

### Step 7 — Add sidebar links (Layout.js)

```js
{ path: '/admin/orders', label: 'Customer Orders', icon: Package }
{ path: '/salary',       label: 'Payroll',         icon: Calculator }
```

---

## How stock enforcement works

```
products.quantity       = total physical stock
products.reserved_qty   = qty locked by pending/processing orders
available_qty           = quantity - reserved_qty  ← what customers see
```

1. Customer adds items → **check-stock** endpoint verifies `available_qty` before checkout
2. On order creation → `reserved_qty` incremented (stock locked, no overselling)
3. Admin marks order **delivered** → `quantity` decremented, `reserved_qty` released
4. Admin marks order **cancelled** → only `reserved_qty` released (no stock deduction)

---

## How salary calculation works

Each employee has a **salary_structure** record (configurable per employee). Given the employee's monthly CTC (`employees.salary`):

```
Basic        = CTC × basic_percent%          (default 50%)
HRA          = Basic × hra_percent%           (default 20%)
DA           = Basic × da_percent%            (default 10%)
Special      = fixed monthly amount
Overtime     = hours × overtime_rate

Gross        = Basic + HRA + DA + Special + Overtime − LOP

LOP          = (absent_days / working_days) × Basic
PF (emp)     = 12% of min(Basic, ₹15,000)    [EPFO cap]
ESI (emp)    = 0.75% of Gross  [only if Gross ≤ ₹21,000]

Net Pay      = Gross − PF(emp) − ESI(emp) − other_deductions
CTC          = Gross + PF(employer) + ESI(employer)
```

Attendance data is pulled automatically from the existing `attendance` table.

---

## OTP flow

```
Customer enters phone
       ↓
POST /api/customer/auth/send-otp
  → upsert customer record
  → generate 6-digit OTP (10 min expiry)
  → send via MSG91 (or console log in dev)
       ↓
Customer enters OTP
       ↓
POST /api/customer/auth/verify-otp
  → validate OTP + expiry
  → clear OTP from DB
  → return JWT (role: 'customer')
       ↓
All customer API calls use this JWT
```

Rate limiting: max 3 OTP requests per 10-minute window per phone number.

---

## Production checklist

- [ ] Set `MSG91_AUTH_KEY` and `MSG91_TEMPLATE_ID` in backend .env
- [ ] Create MSG91 OTP template with variable `{{otp}}`
- [ ] Change `NODE_ENV=production` (disables console OTP logging)
- [ ] Run `migration_v2.sql` on production database
- [ ] Configure per-employee salary structures from the Payroll page
- [ ] Review and adjust default salary structure percentages
