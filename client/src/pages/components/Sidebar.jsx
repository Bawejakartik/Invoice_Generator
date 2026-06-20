// components/Sidebar.jsx

import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  FileText,
  CreditCard,
  BarChart3,
  Users,
  Settings,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

const Sidebar = ({ isOpen, setIsOpen }) => {
  const navigate = useNavigate();
  const location = useLocation();

  // Each item now maps to a real route. Add more as you build out pages.
  const menuItems = [
    { icon: LayoutDashboard, label: "Dashboard", path: "/dashboard" },
    { icon: FileText, label: "Invoices", path: "/dashboard/invoices" },
    {
      icon: CreditCard,
      label: "Transactions",
      path: "/dashboard/transactions",
    },
    { icon: BarChart3, label: "Reports", path: "/dashboard/reports" },
    { icon: Users, label: "Clients", path: "/dashboard/clients" },
    { icon: Settings, label: "Settings", path: "/dashboard/settings" },
  ];

  return (
    <div
      className={`h-screen bg-[#071A2F] text-white fixed left-0 top-0 z-50 transition-all duration-300 flex flex-col justify-between ${
        isOpen ? "w-[250px]" : "w-[85px]"
      }`}
    >
      {/* Top Section */}
      <div>
        {/* Logo + Toggle */}
        <div
          className={`py-6 border-b border-white/10 flex items-center ${
            isOpen ? "justify-between px-4" : "justify-center px-0"
          }`}
        >
          {isOpen && (
            <div>
              <h1 className="text-2xl font-bold">
                Freelanc<span className="text-[#17C964]">IO</span>
              </h1>

              <p className="text-xs text-gray-400 mt-1">Financial Dashboard</p>
            </div>
          )}

          <button
            onClick={() => setIsOpen(!isOpen)}
            className="bg-[#0E2A47] p-2 rounded-lg hover:bg-[#16395f] transition"
          >
            {isOpen ? <ChevronLeft size={18} /> : <ChevronRight size={18} />}
          </button>
        </div>

        {/* Navigation */}
        <div className="mt-6 flex flex-col gap-2">
          {menuItems.map((item, index) => {
            // Active state now comes from the actual URL, not local state.
            // "Dashboard" only counts as active on an exact match so it
            // doesn't stay highlighted while you're on /dashboard/settings.
            const isActive =
              item.path === "/dashboard"
                ? location.pathname === "/dashboard"
                : location.pathname.startsWith(item.path);

            return (
              <button
                key={index}
                onClick={() => navigate(item.path)}
                className={`relative flex items-center ${
                  isOpen ? "justify-start px-4" : "justify-center px-0"
                } gap-3 py-3 transition-all duration-200 overflow-hidden ${
                  isActive
                    ? "bg-[#0E2A47]"
                    : "text-gray-300 hover:bg-[#0E2A47]/70"
                }`}
              >
                {/* Active Left Border */}
                {isActive && (
                  <div className="absolute left-0 top-0 h-full w-[4px] bg-[#17C964] rounded-r-full"></div>
                )}

                {/* Icon */}
                <item.icon
                  size={20}
                  className={`transition-all duration-200 ${
                    isActive ? "text-[#17C964]" : "text-gray-400"
                  }`}
                />

                {/* Label */}
                {isOpen && (
                  <span
                    className={`text-sm font-medium ${
                      isActive ? "text-[#17C964]" : "text-gray-300"
                    }`}
                  >
                    {item.label}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Upgrade Card */}
      {isOpen && (
        <div className="m-4 bg-[#0E2A47] rounded-2xl p-4">
          <h2 className="font-semibold text-sm">Upgrade Pro</h2>

          <p className="text-xs text-gray-400 mt-2">
            Unlock advanced analytics and unlimited invoices.
          </p>

          <button className="w-full mt-4 bg-[#17C964] hover:bg-[#13b357] transition-all text-black font-semibold py-2 rounded-xl text-sm">
            Get Pro Access
          </button>
        </div>
      )}
    </div>
  );
};

export default Sidebar;
