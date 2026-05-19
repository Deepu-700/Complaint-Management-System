// App.jsx
// Root component with routing and layout

import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Dashboard from './pages/Dashboard';
import Complaints from './pages/Complaints';
import ComplaintDetails from './pages/ComplaintDetails';
import SubmitComplaint from './pages/SubmitComplaint';
import AIAnalysis from './pages/AIAnalysis';
import Analytics from './pages/Analytics';
import Login from './pages/Login';
import Register from './pages/Register';
import { useAuth } from './context/AuthContext';

// ✅ Protected Route — agar user login nahi hai to /login pe bhejo
const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) return null;
  if (!user) return <Navigate to="/login" replace />;

  return children;
};

// Pages without sidebar
const noSidebarRoutes = ['/login', '/register'];

function App() {
  const location = useLocation();
  const showSidebar = !noSidebarRoutes.includes(location.pathname);

  return (
    <div className="min-h-screen bg-gray-50">
      {showSidebar ? (
        <>
          <Navbar />
          <main className="ml-64 min-h-screen p-6 lg:p-8">
            <div className="max-w-7xl mx-auto">
              <Routes>
                <Route path="/" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
                <Route path="/complaints" element={<ProtectedRoute><Complaints /></ProtectedRoute>} />
                <Route path="/complaints/:id" element={<ProtectedRoute><ComplaintDetails /></ProtectedRoute>} />
                <Route path="/submit" element={<ProtectedRoute><SubmitComplaint /></ProtectedRoute>} />
                <Route path="/ai-analysis" element={<ProtectedRoute><AIAnalysis /></ProtectedRoute>} />
                <Route path="/analytics" element={<ProtectedRoute><Analytics /></ProtectedRoute>} />
              </Routes>
            </div>
          </main>
        </>
      ) : (
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Routes>
      )}
    </div>
  );
}

export default App;