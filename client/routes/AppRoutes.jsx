import { Routes, Route, Navigate } from "react-router-dom";
import LandingPage from "../src/pages/landingPage";
import Register from "../src/pages/Register.jsx";
import Login from "../src/pages/login.jsx";
import Dashboard from "../src/pages/dashboard/index.jsx";
import ForgetPassword from "../src/pages/ForgetPassword.jsx" ;

const AppRoutes = ({ active, setActive }) => {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/home" />} />
      <Route path="/signup" element={<Register />} />
      <Route path="/login" element={<Login />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/home" element={<LandingPage />} />
      <Route path="/forget-Password" element={<ForgetPassword />} />
    </Routes>
  );
};

export default AppRoutes;
