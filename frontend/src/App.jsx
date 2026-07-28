import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import ProtectedRoute from './components/ProtectedRoute';

// Placeholder pages (We will build the real ones next)
const AdminDashboard = () => <div className="p-8 text-2xl font-bold">Admin Dashboard (Coming Soon)</div>;
const InternDashboard = () => <div className="p-8 text-2xl font-bold">Intern Dashboard (Coming Soon)</div>;

function App() {
  return (
    <Router>
      <Routes>
        {/* Public Route */}
        <Route path="/login" element={<Login />} />

        {/* Admin Protected Routes */}
        <Route 
          path="/admin/dashboard" 
          element={
            <ProtectedRoute allowedRoles={['ROLE_ADMIN']}>
              <AdminDashboard />
            </ProtectedRoute>
          } 
        />

        {/* Intern Protected Routes */}
        <Route 
          path="/intern/dashboard" 
          element={
            <ProtectedRoute allowedRoles={['ROLE_INTERN']}>
              <InternDashboard />
            </ProtectedRoute>
          } 
        />

        {/* Default redirect to login */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  );
}

export default App;