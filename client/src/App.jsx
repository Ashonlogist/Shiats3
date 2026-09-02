import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation, Navigate, Outlet } from 'react-router-dom';
import { FaSpinner } from 'react-icons/fa';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { ContentProvider } from './contexts/ContentContext';
import './App.css';
import './styles/global.css';

// Layout Components
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import ProtectedRoute from './components/auth/ProtectedRoute';
import Hero from './components/Hero/Hero.jsx';

// Public Pages
import Home from './pages/Home';
import Properties from './pages/Properties';
import PropertyDetails from './pages/PropertyDetails';
import Hotels from './pages/Hotels';
import HotelDetails from './pages/HotelDetails';
import About from './pages/About';
import Contact from './pages/Contact';
import Portfolio from './pages/Portfolio';
import PortfolioDetail from './pages/PortfolioDetail';
import Search from './pages/Search';

// Auth Pages
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';

// Dashboard Pages
import Dashboard from './pages/dashboard/Dashboard';
import AdminDashboard from './pages/dashboard/AdminDashboard';
import AgentDashboard from './pages/dashboard/AgentDashboard';
import HotelManagerDashboard from './pages/dashboard/HotelManagerDashboard';
import DashboardProperties from './pages/dashboard/Properties';
import DashboardHotels from './pages/dashboard/Hotels';
import DashboardBookings from './pages/dashboard/Bookings';
import DashboardUsers from './pages/dashboard/Users';
import DashboardSettings from './pages/dashboard/Settings';
import PropertyForm from './pages/dashboard/PropertyForm';
import HotelForm from './pages/dashboard/HotelForm';
import UserForm from './pages/dashboard/UserForm';
import Reports from './pages/dashboard/Reports';
import SiteContent from './pages/dashboard/SiteContent';
import UserProfile from './components/dashboard/UserProfile';

// Error Pages
import NotFound from './pages/NotFound';
import Unauthorized from './pages/Unauthorized';

// Main App component with Router
function App() {
  return (
    <AuthProvider>
      <ContentProvider>
        <Router>
          <AppContent />
        </Router>
      </ContentProvider>
    </AuthProvider>
  );
}

// AppContent component that uses hooks
function AppContent() {
  const { user, loading, isAdmin } = useAuth();
  const location = useLocation();

  // Pages that render a full-bleed hero image - hero runs under the transparent navbar
  const hasHero = ['/', '/properties', '/hotels', '/portfolio', '/about', '/contact', '/search'].includes(location.pathname);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <FaSpinner className="animate-spin text-4xl text-primary" />
      </div>
    );
  }

  const { logout } = useAuth();

  return (
    <div className="app">
      <Navbar 
        isAuthenticated={!!user}
        user={user}
        onLogout={logout}
      />
      <main className={hasHero ? 'main--with-hero' : 'main-content'}>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/properties" element={<Properties />} />
          <Route path="/properties/:id" element={<PropertyDetails />} />
          <Route path="/hotels" element={<Hotels />} />
          <Route path="/hotels/:id" element={<HotelDetails />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/portfolio" element={<Portfolio />} />
          <Route path="/portfolio/:id" element={<PortfolioDetail />} />
          <Route path="/search" element={<Search />} />
          
          {/* Auth Routes */}
          <Route 
            path="/login" 
            element={
              user ? (
                <Navigate to="/dashboard" replace />
              ) : (
                <Login />
              )
            } 
          />
          <Route 
            path="/register" 
            element={
              user ? (
                <Navigate to="/dashboard" replace />
              ) : (
                <Register />
              )
            } 
          />

          {/* Dashboard Routes */}
          <Route 
            path="/dashboard" 
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          >
            <Route 
              index 
              element={
                isAdmin ? <AdminDashboard /> :
                user?.user_type === 'agent' ? <AgentDashboard /> :
                user?.user_type === 'hotel_manager' ? <HotelManagerDashboard /> :
                <Navigate to="/" replace />
              } 
            />
            
            {/* Admin-only routes */}
            <Route 
              path="admin" 
              element={
                <ProtectedRoute roles={['admin']}>
                  <AdminDashboard />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="users" 
              element={
                <ProtectedRoute roles={['admin']}>
                  <DashboardUsers />
                </ProtectedRoute>
              } 
            />
            
            {/* Agent-only routes */}
            <Route 
              path="agent" 
              element={
                <ProtectedRoute roles={['agent', 'admin']}>
                  <AgentDashboard />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="properties" 
              element={
                <ProtectedRoute roles={['agent', 'admin']}>
                  <DashboardProperties />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="properties/new" 
              element={
                <ProtectedRoute roles={['agent', 'admin']}>
                  <PropertyForm />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="hotels" 
              element={
                <ProtectedRoute roles={['hotel_manager', 'admin']}>
                  <DashboardHotels />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="hotels/new" 
              element={
                <ProtectedRoute roles={['hotel_manager', 'admin']}>
                  <HotelForm />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="users/new" 
              element={
                <ProtectedRoute roles={['admin']}>
                  <UserForm />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="site-content" 
              element={
                <ProtectedRoute roles={['admin']}>
                  <SiteContent />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="profile" 
              element={
                <ProtectedRoute>
                  <UserProfile />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="reports" 
              element={
                <ProtectedRoute roles={['admin']}>
                  <Reports />
                </ProtectedRoute>
              } 
            />
            
            {/* Hotel Manager-only routes */}
            <Route 
              path="hotel-manager" 
              element={
                <ProtectedRoute roles={['hotel_manager', 'admin']}>
                  <HotelManagerDashboard />
                </ProtectedRoute>
              } 
            />
            
            {/* Shared dashboard routes */}
            <Route 
              path="bookings" 
              element={
                <ProtectedRoute>
                  <DashboardBookings />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="settings" 
              element={
                <ProtectedRoute>
                  <DashboardSettings />
                </ProtectedRoute>
              } 
            />
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
