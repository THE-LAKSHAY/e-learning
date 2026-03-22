import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

import LoadingScreen    from "./LoadingScreen";
import HeroSection      from "./HeroSection";
import ExploreVehicles  from "./ExploreVehicles";
import WhyChooseUs      from "./WhyChooseUs";
import Testimonials     from "./Testimonials";
import BlogPosts        from "./BlogPosts";
import Footer           from "./Footer";

import AuthPage         from "./AuthPage";
import CustomerDashboard from "./CustomerDashboard";
import AdminLogin       from "./AdminLogin";
import AdminDashboard   from "./AdminDashboard";

import TestDriveForm    from "./TestDriveForm";
import BookingPage      from "./BookingPage";
import PaymentGateway   from "./PaymentGateway";
import OTPVerification  from "./OTPVerification";
import Library          from "./Library";
import MyProfile        from "./MyProfile";

/* ── Protected route — needs valid JWT ── */
const ProtectedRoute = ({ children, adminOnly = false }) => {
  const token = localStorage.getItem("token");
  const user  = localStorage.getItem("user");

  if (!token || !user) {
    return <Navigate to="/auth" replace />;
  }

  if (adminOnly) {
    const parsed = JSON.parse(user);
    if (!parsed.isAdmin) return <Navigate to="/dashboard" replace />;
  }

  return children;
};

/* ── Redirect if already logged in ── */
const GuestRoute = ({ children }) => {
  const token = localStorage.getItem("token");
  const user  = localStorage.getItem("user");

  if (token && user) {
    const parsed = JSON.parse(user);
    return <Navigate to={parsed.isAdmin ? "/admin-dashboard" : "/dashboard"} replace />;
  }

  return children;
};

const FullHomePage = () => (
  <div className="App">
    <div id="hero">      <HeroSection />      </div>
    <div id="inventory"> <ExploreVehicles />  </div>
    <div id="about">     <WhyChooseUs />      </div>
    <div id="reviews">   <Testimonials />     </div>
    <div id="blog">      <BlogPosts />        </div>
    <div id="contact">   <Footer />           </div>
  </div>
);

const App = () => {
  const [isLoading, setIsLoading] = useState(true);

  return (
    <>
      {isLoading && <LoadingScreen onComplete={() => setIsLoading(false)} />}

      <Router>
        <Routes>
          {/* Public */}
          <Route path="/"         element={<FullHomePage />} />
          <Route path="/library"  element={<Library />} />

          {/* Auth — redirect if already logged in */}
          <Route path="/auth" element={
            <GuestRoute><AuthPage /></GuestRoute>
          } />
          <Route path="/admin-login" element={
            <GuestRoute><AdminLogin /></GuestRoute>
          } />

          {/* User protected */}
          <Route path="/dashboard" element={
            <ProtectedRoute><CustomerDashboard /></ProtectedRoute>
          } />
          <Route path="/my-profile" element={
            <ProtectedRoute><MyProfile /></ProtectedRoute>
          } />
          <Route path="/test-drive" element={
            <ProtectedRoute><TestDriveForm /></ProtectedRoute>
          } />
          <Route path="/book-now" element={
            <ProtectedRoute><BookingPage /></ProtectedRoute>
          } />
          <Route path="/payment" element={
            <ProtectedRoute><PaymentGateway /></ProtectedRoute>
          } />
          <Route path="/otp" element={
            <ProtectedRoute><OTPVerification /></ProtectedRoute>
          } />

          {/* Admin only */}
          <Route path="/admin-dashboard" element={
            <ProtectedRoute adminOnly><AdminDashboard /></ProtectedRoute>
          } />
        </Routes>
      </Router>
    </>
  );
};

export default App;