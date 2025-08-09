import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation, Navigate, Outlet } from 'react-router-dom';
import { FaSpinner } from 'react-icons/fa';
import { AuthProvider } from './contexts';
import './App.css';

// Layout Components
import Navbar from './components/layout/Navbar';
import Hero from './components/Hero/Hero';
import Footer from './components/layout/Footer';

// Public Pages
import Home from './pages/Home';
import Properties from './pages/Properties';
import PropertyDetails from './pages/PropertyDetails';
import Hotels from './pages/Hotels';
import HotelDetails from './pages/HotelDetails';
import About from './pages/About';
import Contact from './pages/Contact';
import Blog from './pages/Blog';
import BlogPost from './pages/BlogPost';

// Auth Pages
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';

// Dashboard Pages
import Dashboard from './pages/dashboard/Dashboard';
import AdminDashboard from './pages/dashboard/AdminDashboard';
import AgentDashboard from './pages/dashboard/AgentDashboard';
import HotelManagerDashboard from './pages/dashboard/HotelManagerDashboard';
import DashboardProperties from './pages/dashboard/Properties';
import DashboardBookings from './pages/dashboard/Bookings';
import DashboardUsers from './pages/dashboard/Users';
import DashboardSettings from './pages/dashboard/Settings';

// Error Pages
import NotFound from './pages/NotFound';
import Unauthorized from './pages/Unauthorized';

// Main App component with Router
function App() {
  return (
    <AuthProvider>
      <Router>
        <AppContent />
      </Router>
    </AuthProvider>
  );
}

// AppContent component that uses hooks
function AppContent() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const location = useLocation();
  const isHomePage = location.pathname === '/';

  // Check if user is authenticated on initial load
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem('access_token');
        
        if (token) {
          // Verify the token is still valid
          const response = await fetch('http://localhost:8000/api/v1/auth/users/me/', {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          });

          if (response.ok) {
            const userData = await response.json();
            setIsAuthenticated(true);
            setUser({
              ...userData,
              token,
              isAdmin: userData.is_staff || userData.is_superuser,
              // Add user_type to the user object for role-based access
              user_type: userData.user_type || 'buyer', // Default to 'buyer' if not specified
            });
          } else {
            // Token is invalid, clear it
            localStorage.removeItem('access_token');
            localStorage.removeItem('refresh_token');
          }
        }
      } catch (error) {
        console.error('Authentication check failed:', error);
        // Clear invalid tokens on error
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  // Handle login
  const handleLogin = (userData) => {
    setIsAuthenticated(true);
    setUser(userData);
  };

  // Handle logout
  const handleLogout = async () => {
    try {
      // Call the logout endpoint if needed
      const token = localStorage.getItem('access_token');
      if (token) {
        await fetch('http://localhost:8000/api/v1/auth/logout/', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            refresh: localStorage.getItem('refresh_token')
          }),
        });
      }
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      // Clear all auth data
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      setIsAuthenticated(false);
      setUser(null);
      
      // Redirect to home page after logout
      window.location.href = '/';
    }
  };

  // Protected Route Wrapper Component
  const ProtectedRoute = ({ requiredRole = null, children }) => {
    if (loading) {
      return (
        <div className="loading-screen">
          <FaSpinner className="spinner" />
          <p>Loading Shiats3...</p>
        </div>
      );
    }

    if (!isAuthenticated) {
      // Redirect to login if not authenticated
      return <Navigate to="/login" state={{ from: location.pathname }} replace />;
    }

    // Check if user has the required role if specified
    if (requiredRole && user?.user_type !== requiredRole) {
      return <Unauthorized />;
    }

    return children || <Outlet />;
  };

  // Role-based route components
  const AdminRoute = ({ children }) => (
    <ProtectedRoute requiredRole="admin">
      {children}
    </ProtectedRoute>
  );

  const AgentRoute = ({ children }) => (
    <ProtectedRoute requiredRole="agent">
      {children}
    </ProtectedRoute>
  );

  const HotelManagerRoute = ({ children }) => (
    <ProtectedRoute requiredRole="hotel_manager">
      {children}
    </ProtectedRoute>
  );

  if (loading) {
    return (
      <div className="loading-screen">
        <FaSpinner className="spinner" />
        <p>Loading Shiats3...</p>
      </div>
    );
  }

  return (
    <div className="app">
      <Navbar isAuthenticated={isAuthenticated} user={user} onLogout={handleLogout} />
      {isHomePage && <Hero />}
      <main className={isHomePage ? 'main--with-hero' : ''}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/properties" element={<Properties />} />
          <Route path="/properties/:id" element={<PropertyDetails />} />
          <Route path="/hotels" element={<Hotels />} />
          <Route path="/hotels/:id" element={<HotelDetails />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/blog/:slug" element={<BlogPost />} />
          
          {/* Auth Routes */}
          <Route 
            path="/login" 
            element={
              !isAuthenticated ? (
                <Login onLogin={handleLogin} />
              ) : (
                <Navigate to="/dashboard" replace />
              )
            } 
          />
          <Route 
            path="/register" 
            element={
              !isAuthenticated ? (
                <Register onRegister={handleLogin} />
              ) : (
                <Navigate to="/dashboard" replace />
              )
            } 
          />

          {/* Dashboard Routes */}
          <Route element={<ProtectedRoute />}>
            <Route path="/dashboard" element={<Dashboard user={user} />}>
              {/* Default dashboard based on user role */}
              <Route 
                index 
                element={
                  user?.user_type === 'admin' ? <AdminDashboard /> :
                  user?.user_type === 'agent' ? <AgentDashboard /> :
                  user?.user_type === 'hotel_manager' ? <HotelManagerDashboard /> :
                  <Navigate to="/" replace />
                } 
              />
              
              {/* Admin-only routes */}
              <Route element={<AdminRoute />}>
                <Route path="admin" element={<AdminDashboard />} />
                <Route path="users" element={<DashboardUsers />} />
              </Route>
              
              {/* Agent-only routes */}
              <Route element={<AgentRoute />}>
                <Route path="agent" element={<AgentDashboard />} />
                <Route path="properties" element={<DashboardProperties />} />
              </Route>
              
              {/* Hotel Manager-only routes */}
              <Route element={<HotelManagerRoute />}>
                <Route path="hotel-manager" element={<HotelManagerDashboard />} />
              </Route>
              
              {/* Shared dashboard routes */}
              <Route path="bookings" element={<DashboardBookings />} />
              <Route path="settings" element={<DashboardSettings />} />
            </Route>
          </Route>

          {/* 404 Route - Must be last */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default App;
