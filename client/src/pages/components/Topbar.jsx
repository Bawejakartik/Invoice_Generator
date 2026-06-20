// components/Topbar.jsx

import React from "react";
import { Bell, Plus, Search } from "lucide-react";
import ThemeToggle from "../../../components/ThemeToggle";

const Topbar = () => {
  return (
    <div className="h-[80px] bg-white dark:bg-slate-900 border-b border-gray-200 dark:border-slate-700 flex items-center justify-between px-8 sticky top-0 z-40 transition-colors duration-300">
      {/* Search Bar */}
      <div className="flex items-center bg-[#F4F6FB] dark:bg-slate-800 rounded-xl px-4 py-2 w-[320px] transition-colors duration-300">
        <Search size={18} className="text-gray-400 dark:text-slate-500" />

        <input
          type="text"
          placeholder="Search data, invoices..."
          className="bg-transparent outline-none ml-3 text-sm w-full text-slate-800 dark:text-slate-100 placeholder-gray-400 dark:placeholder-slate-500"
        />
      </div>

      {/* Right Section */}
      <div className="flex items-center gap-5">
        {/* Dark mode toggle */}
        <ThemeToggle />

        <button className="relative text-gray-600 dark:text-slate-300 hover:text-black dark:hover:text-white transition-colors">
          <Bell size={20} />

          <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full"></span>
        </button>

        <button className="bg-[#17C964] hover:bg-[#13b357] transition-all text-black font-semibold px-5 py-2.5 rounded-xl flex items-center gap-2">
          <Plus size={18} />
          New Invoice
        </button>

        <img
          src="https://i.pravatar.cc/40"
          alt="profile"
          className="w-10 h-10 rounded-full border-2 border-gray-200 dark:border-slate-700"
        />
      </div>
    </div>
  );
};

export default Topbar;
