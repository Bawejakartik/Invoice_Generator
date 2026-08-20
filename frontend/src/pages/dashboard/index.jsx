// pages/Dashboard/index.jsx

import React, { useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import DashboardOverview from "./DashboardOverview";

const Dashboard = () => {
  const [isOpen, setIsOpen] = useState(true);
  const location = useLocation();

  const isOverview = location.pathname === "/dashboard";

  return (
    <div className="bg-[#F4F6FB] dark:bg-slate-950 min-h-screen transition-colors duration-300">
      {/* Sidebar */}
      <Sidebar isOpen={isOpen} setIsOpen={setIsOpen} />

      {/* Main Content Area */}
      <div
        className={`transition-all duration-300 ${
          isOpen ? "ml-[250px]" : "ml-[85px]"
        }`}
      >
        <Topbar />

        <div>
          {/* Replaced the "Dashboard Content Here" placeholder with
              the real DashboardOverview page (KPIs, charts, recent
              invoices table, etc). Nested routes like /dashboard/settings
              or /dashboard/clients still render via <Outlet />. */}
          {isOverview ? <DashboardOverview /> : <Outlet />}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
