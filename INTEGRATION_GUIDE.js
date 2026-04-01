// ================================================================
// ADD TO src/App.js  — new routes to insert into your <Routes> block
// ================================================================

// Import at top:
// import CustomerLogin    from './pages/customer/CustomerLogin';
// import Shop             from './pages/customer/Shop';
// import CustomerOrders   from './pages/customer/CustomerOrders';
// import AdminOrders      from './pages/admin/AdminOrders';
// import SalaryCalculator from './pages/admin/SalaryCalculator';

// Add inside <Routes>:
/*
  {/* Public customer routes (no admin auth) *\/}
  <Route path="/customer/login" element={<CustomerLogin />} />
  <Route path="/shop"           element={<CustomerProtectedRoute><Shop /></CustomerProtectedRoute>} />
  <Route path="/customer/orders" element={<CustomerProtectedRoute><CustomerOrders /></CustomerProtectedRoute>} />

  {/* Admin routes (inside existing Layout) *\/}
  <Route path="/admin/orders"   element={<ProtectedRoute><Layout><AdminOrders /></Layout></ProtectedRoute>} />
  <Route path="/salary"         element={<ProtectedRoute><Layout><SalaryCalculator /></Layout></ProtectedRoute>} />
*/

// ================================================================
// CustomerProtectedRoute helper — add to App.js or a separate file
// ================================================================
/*
function CustomerProtectedRoute({ children }) {
  const token = localStorage.getItem('customer_token');
  return token ? children : <Navigate to="/customer/login" />;
}
*/

// ================================================================
// ADD TO sidebar in Layout.js  (inside nav links)
// ================================================================
/*
  { path: '/admin/orders',  label: 'Customer Orders', icon: Package  }
  { path: '/salary',        label: 'Payroll',         icon: Calculator }
*/

// ================================================================
// .env additions for BACKEND
// ================================================================
/*
# MSG91 (India SMS) — leave blank to use console mock in dev
MSG91_AUTH_KEY=your_msg91_authkey_here
MSG91_TEMPLATE_ID=your_otp_template_id_here
*/

// ================================================================
// server.js — add these two lines after existing route mounts
// ================================================================
/*
const customerRoutes = require('./routes/customer');
app.use('/api/customer', customerRoutes);

const adminOrderRoutes = require('./routes/adminOrders');
app.use('/api/admin', adminOrderRoutes);
*/
