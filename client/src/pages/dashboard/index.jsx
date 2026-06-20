// pages/Dashboard/index.jsx

import React, { useState } from "react";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";

const Dashboard = () => {
  const [isOpen, setIsOpen] = useState(true);
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

        {/* Dashboard Content */}
        <div className="p-8 mt-[80px]">
          <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm dark:shadow-black/30 border border-gray-200 dark:border-slate-700 h-[500px] flex items-center justify-center transition-colors duration-300">
            <h1 className="text-2xl font-semibold text-gray-400 dark:text-slate-500">
              Dashboard Content Here
            </h1>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
