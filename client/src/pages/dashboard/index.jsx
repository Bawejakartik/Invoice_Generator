// pages/Dashboard/index.jsx

import React, { useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";

const Dashboard = () => {
  const [isOpen, setIsOpen] = useState(true);
  const location = useLocation();

  // Only show the default overview content when we're EXACTLY at
  // "/dashboard". Any nested route (e.g. /dashboard/settings) should
  // render through <Outlet /> instead.
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

        <div className="mt-[80px]">
          {isOverview ? (
            // Default dashboard overview content
            <div className="p-8">
              <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm dark:shadow-black/30 border border-gray-200 dark:border-slate-700 h-[500px] flex items-center justify-center transition-colors duration-300">
                <h1 className="text-2xl font-semibold text-gray-400 dark:text-slate-500">
                  Dashboard Content Here
                </h1>
              </div>
            </div>
          ) : (
            // Nested routes (e.g. /dashboard/settings) render here
            <Outlet />
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
