import { Routes, Route, Navigate } from "react-router-dom";
import LandingPage from "../src/pages/landingPage";
import Register from "../src/pages/Register.jsx";
import Login from "../src/pages/login.jsx";
import Dashboard from "../src/pages/dashboard/index.jsx";
import ForgetPassword from "../src/pages/ForgetPassword.jsx";
import DashboardSettings from "../src/pages/dashboard/settings.jsx";
import DashboardClient from "../src/pages/dashboard/clients.jsx";
import AddNewClient from "../src/pages/dashboard/AddClient.jsx";
import EditClient from "../src/pages/dashboard/EditClient.jsx";
import InvoiceDashboard from "../src/pages/dashboard/Invoices.jsx"
import NewInvoice from "../src/pages/dashboard/NewInvoice.jsx";


const AppRoutes = ({ active, setActive }) => {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/home" />} />
      <Route path="/signup" element={<Register />} />
      <Route path="/login" element={<Login />} />
      <Route path="/dashboard" element={<Dashboard />}>
        <Route path="settings" element={<DashboardSettings />} />
        <Route path="clients" element={<DashboardClient />} />
        <Route path="addClients" element={<AddNewClient />} />
        <Route path="edit/:id" element={<EditClient />} />
        <Route path="Invoices" element={<InvoiceDashboard />} />
        <Route path="invoices/new" element={<NewInvoice />} />
      </Route>
      <Route path="/home" element={<LandingPage />} />
      <Route path="/forget-Password" element={<ForgetPassword />} />
    </Routes>
  );
};

export default AppRoutes;
