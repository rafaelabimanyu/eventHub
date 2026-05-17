import React from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { AuthProvider } from './context/AuthContext';
import Home from './pages/Home';
import EventDetail from './pages/EventDetail';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import MyTickets from './pages/MyTickets';
import AdminValidator from './pages/AdminValidator';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';

// AnimatePresence requires useLocation to know when the route changes
const AnimatedRoutes = () => {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<Home />} />
        <Route path="/event/:id" element={<EventDetail />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        
        {/* Protected Routes for Visitor */}
        <Route element={<ProtectedRoute allowedRoles={['visitor', 'admin']} />}>
          <Route path="/my-tickets" element={<MyTickets />} />
        </Route>

        {/* Protected Routes for Admin */}
        <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/admin/validator" element={<AdminValidator />} />
        </Route>
      </Routes>
    </AnimatePresence>
  );
};

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <div className="App font-sans bg-gray-50 min-h-screen flex flex-col overflow-x-hidden">
          <Navbar />
          <main className="flex-grow">
            <AnimatedRoutes />
          </main>
        </div>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
