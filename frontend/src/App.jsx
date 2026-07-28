import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import AdminDashboard from './pages/AdminDashboard';
import InternList from './pages/InternList'; // 
import ProtectedRoute from './components/ProtectedRoute';

// Placeholder for Intern Dashboard (We will build this next)
const InternDashboard = () => <div className="p-8 text-2xl font-bold">Intern Dashboard (Coming Soon)</div>;

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />

        <Route 
          path="/admin/dashboard" 
          element={
            <ProtectedRoute allowedRoles={['ROLE_ADMIN']}>
              <AdminDashboard />
            </ProtectedRoute>
          } 
        />
        <Route 
         path="/admin/interns" 
         element={
         <ProtectedRoute allowedRoles={['ROLE_ADMIN']}>
          <InternList />
         </ProtectedRoute>
        }
     />

 
        <Route 
          path="/intern/dashboard" 
          element={
            <ProtectedRoute allowedRoles={['ROLE_INTERN']}>
              <InternDashboard />
            </ProtectedRoute>
          } 
        />

        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  );
}

export default App;