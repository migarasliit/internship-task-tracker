import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import AdminDashboard from './pages/AdminDashboard';
import InternList from './pages/InternList'; // 
import ProtectedRoute from './components/ProtectedRoute';
import ProjectList from './pages/ProjectList'; // Import ProjectList component
import TaskList from './pages/TaskList'; // Import TaskList component
import InternDashboard from './pages/InternDashboard'; // Import InternDashboard component
import InternTaskList from './pages/InternTaskList'; // Import InternTaskList component
import InternLogs from './pages/InternWorkLogs'; // Import InternLogs component

 

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
        path="/admin/projects" 
        element={
        <ProtectedRoute allowedRoles={['ROLE_ADMIN']}>
          <ProjectList />
        </ProtectedRoute>
      } 
    />

         <Route 
         path="/admin/tasks" 
         element={
         <ProtectedRoute allowedRoles={['ROLE_ADMIN']}>
           <TaskList />
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

        <Route 
         path="/intern/tasks" 
         element={
          <ProtectedRoute allowedRoles={['ROLE_INTERN']}>
           <InternTaskList />
          </ProtectedRoute>
          } 
        />

       <Route 
        path="/intern/logs"
        element={
         <ProtectedRoute allowedRoles={['ROLE_INTERN']}>
           <InternLogs />
           </ProtectedRoute>
          }
        />

        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  );
}

export default App;