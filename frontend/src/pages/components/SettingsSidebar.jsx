// components/SettingsSidebar.jsx

import React from "react";
import { User, Briefcase, FileText, Percent, Bell } from "lucide-react";

const navItems = [
  { key: "general", label: "General", icon: User },
  { key: "business", label: "Business Profile", icon: Briefcase },
  { key: "invoicing", label: "Invoicing Settings", icon: FileText },
  { key: "tax", label: "Tax & Currency", icon: Percent },
  { key: "notifications", label: "Notifications", icon: Bell },
];

const SettingsSidebar = ({ active, onChange }) => {
  return (
    <div className="w-[230px] flex-shrink-0">
      <nav className="flex flex-col gap-1">
        {navItems.map(({ key, label, icon: Icon }) => {
          const isActive = active === key;
          return (
            <button
              key={key}
              onClick={() => onChange(key)}
              className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium text-left transition-colors duration-200 ${
                isActive
                  ? "bg-green-500 text-white"
                  : "text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
              }`}
            >
              <Icon
                size={17}
                className={
                  isActive ? "text-white" : "text-slate-400 dark:text-slate-500"
                }
              />
              {label}
            </button>
          );
        })}
      </nav>
    </div>
  );
};

export default SettingsSidebar;
