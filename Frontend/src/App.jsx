import { BrowserRouter, Routes, Route } from "react-router-dom";
import Hero from "./pages/Hero.jsx";
import AboutUs from "./pages/About_Us.jsx";
import Contact from "./pages/Contact.jsx";

import ForgotPassword from "./pages/ForgotPassword.jsx";
import ResetPassword from "./pages/ResetPassword.jsx";

import AdminLogin from "./Admin/AdminLogin.jsx";
import AdminDashboard from "./Admin/AdminDashboard";
import ApplicationDetails from "./Admin/ApplicationDetails.jsx";

import UserLogin from "./User/Login.jsx"
import UserRegister from "./User/Register.jsx"
import UserLoginRegister from "./User/UserLoginRegister.jsx";
import UserDashboard from "./User/UserDashboard.jsx";
import UpdateProfile from "./User/UpdateProfile.jsx";
import ApplicationStatus from "./User/ApplicationStatus.jsx";

import { useEffect, useState } from "react";
function App() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(max-width: 768px)");

    const handleResize = () => {
      setIsMobile(mediaQuery.matches);
    };

    handleResize(); // run once on mount
    mediaQuery.addEventListener("change", handleResize);

    return () => mediaQuery.removeEventListener("change", handleResize);
  }, []);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Hero />} />
        <Route path="/about-us" element={<AboutUs />} />
        <Route path="/contact" element={<Contact />} />

        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />

        <Route path="/admin-login" element={<AdminLogin />} />
        <Route path="/admin-dashboard" element={<AdminDashboard />} />
        <Route path="/admin/applications/:id" element={<ApplicationDetails />} />

        {!isMobile && (
        <Route path="/user-login" element={<UserLoginRegister />} />
      )}

      {/* ✅ Mobile Version */}
      {isMobile && (
        <>
          <Route path="/user-login" element={<UserLogin />} />
          <Route path="/user-register" element={<UserRegister />} />
        </>
      )}
        <Route path="/user-dashboard" element={<UserDashboard />} />
        <Route path="/update-profile" element={<UpdateProfile />} />
        <Route path="/application-status" element={<ApplicationStatus />} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;
