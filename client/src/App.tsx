import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { AnnouncementBar } from './components/layout/AnnouncementBar';

// Public Pages
import { Home } from './pages/Home';
import { EventDetails } from './pages/EventDetails';
import { Vendors } from './pages/Vendors';
import { BecomeVendor } from './pages/BecomeVendor';
import { Sponsors } from './pages/Sponsors';
import { FAQ } from './pages/FAQ';
import { Contact } from './pages/Contact';
import { Login } from './pages/Login';
import { NotFound } from './pages/NotFound';

// Vendor Portal
import { VendorDashboard } from './pages/vendor/VendorDashboard';

// Admin Portal
import { AdminLayout } from './pages/admin/AdminLayout';
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { AdminApplications } from './pages/admin/AdminApplications';
import { AdminVendors } from './pages/admin/AdminVendors';
import { AdminPayments } from './pages/admin/AdminPayments';
import { AdminWeekends } from './pages/admin/AdminWeekends';
import { AdminSponsors } from './pages/admin/AdminSponsors';
import { AdminAnnouncements } from './pages/admin/AdminAnnouncements';
import { AdminMessages } from './pages/admin/AdminMessages';
import { AdminNewsletter } from './pages/admin/AdminNewsletter';
import { AdminFAQs } from './pages/admin/AdminFAQs';
import { AdminUsers } from './pages/admin/AdminUsers';
import { AdminSettings } from './pages/admin/AdminSettings';

// Protected Route wrappers
const ProtectedAdminRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, loading, isAdmin } = useAuth();
  const location = useLocation();

  if (loading) {
    return <div className="min-h-screen bg-cream-100 flex items-center justify-center font-bold">Verifying admin access...</div>;
  }
  if (!user || !isAdmin) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  return <>{children}</>;
};

const ProtectedVendorRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return <div className="min-h-screen bg-cream-100 flex items-center justify-center font-bold">Verifying session...</div>;
  }
  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  return <>{children}</>;
};

// Public Layout Wrapper
const PublicLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="flex flex-col min-h-screen">
      <AnnouncementBar />
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <AuthProvider>
      <ToastProvider>
        <BrowserRouter>
          <Routes>
            {/* Public Routes with Navbar + Footer */}
            <Route path="/" element={<PublicLayout><Home /></PublicLayout>} />
            <Route path="/event-details" element={<PublicLayout><EventDetails /></PublicLayout>} />
            <Route path="/vendors" element={<PublicLayout><Vendors /></PublicLayout>} />
            <Route path="/become-vendor" element={<PublicLayout><BecomeVendor /></PublicLayout>} />
            <Route path="/sponsors" element={<PublicLayout><Sponsors /></PublicLayout>} />
            <Route path="/faq" element={<PublicLayout><FAQ /></PublicLayout>} />
            <Route path="/contact" element={<PublicLayout><Contact /></PublicLayout>} />
            <Route path="/login" element={<PublicLayout><Login /></PublicLayout>} />

            {/* Vendor Protected Dashboard */}
            <Route
              path="/vendor/dashboard"
              element={
                <ProtectedVendorRoute>
                  <PublicLayout>
                    <VendorDashboard />
                  </PublicLayout>
                </ProtectedVendorRoute>
              }
            />

            {/* Admin Protected Layout & Subroutes */}
            <Route
              path="/admin"
              element={
                <ProtectedAdminRoute>
                  <AdminLayout />
                </ProtectedAdminRoute>
              }
            >
              <Route index element={<AdminDashboard />} />
              <Route path="applications" element={<AdminApplications />} />
              <Route path="vendors" element={<AdminVendors />} />
              <Route path="payments" element={<AdminPayments />} />
              <Route path="weekends" element={<AdminWeekends />} />
              <Route path="sponsors" element={<AdminSponsors />} />
              <Route path="announcements" element={<AdminAnnouncements />} />
              <Route path="messages" element={<AdminMessages />} />
              <Route path="newsletter" element={<AdminNewsletter />} />
              <Route path="faqs" element={<AdminFAQs />} />
              <Route path="users" element={<AdminUsers />} />
              <Route path="settings" element={<AdminSettings />} />
            </Route>

            {/* 404 Catch All */}
            <Route path="*" element={<PublicLayout><NotFound /></PublicLayout>} />
          </Routes>
        </BrowserRouter>
      </ToastProvider>
    </AuthProvider>
  );
};

export default App;
