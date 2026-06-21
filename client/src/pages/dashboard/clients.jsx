// pages/Dashboard/Clients.jsx

import { useState } from "react";
import {
  Users,
  CheckSquare,
  DollarSign,
  UserPlus,
  Filter,
  Download,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

// ---- Dummy data ----
const DUMMY_CLIENTS = [
  {
    id: 1,
    name: "Nexus Dynamics",
    email: "contact@nexusdyn.com",
    industry: "FinTech SaaS",
    projects: 4,
    revenue: 32400.0,
    status: "Active",
    avatarColor: "#0F2E1D",
    initials: "ND",
  },
  {
    id: 2,
    name: "Arbor Creative",
    email: "hello@arbor.agency",
    industry: "Marketing Agency",
    projects: 2,
    revenue: 18900.0,
    status: "Active",
    avatarColor: "#C2410C",
    initials: "AC",
  },
  {
    id: 3,
    name: "Vertex Logistics",
    email: "finance@vertex.io",
    industry: "Logistics",
    projects: 0,
    revenue: 54200.0,
    status: "Inactive",
    avatarColor: "#1D4ED8",
    initials: "VL",
  },
  {
    id: 4,
    name: "Sarah Chen Studios",
    email: "sarah@studios.io",
    industry: "Web Design",
    projects: 1,
    revenue: 8500.0,
    status: "Active",
    avatarColor: "#7C3AED",
    initials: "SC",
  },
  {
    id: 5,
    name: "Bluepeak Capital",
    email: "ops@bluepeak.com",
    industry: "Investment",
    projects: 3,
    revenue: 41200.0,
    status: "Active",
    avatarColor: "#0E7490",
    initials: "BC",
  },
  {
    id: 6,
    name: "Hartwell & Co",
    email: "info@hartwellco.com",
    industry: "Legal Services",
    projects: 0,
    revenue: 12750.0,
    status: "Inactive",
    avatarColor: "#9D174D",
    initials: "HC",
  },
];

const TABS = [
  { key: "all", label: "All Clients" },
  { key: "active", label: "Active" },
  { key: "inactive", label: "Inactive" },
];

const STATS = [
  {
    icon: Users,
    label: "Total Clients",
    value: "42",
    badge: "+12%",
    badgeTone: "positive",
    iconBg: "bg-green-100 dark:bg-green-900/30",
    iconColor: "text-green-700 dark:text-green-400",
  },
  {
    icon: CheckSquare,
    label: "Active Projects",
    value: "18",
    iconBg: "bg-amber-100 dark:bg-amber-900/30",
    iconColor: "text-amber-700 dark:text-amber-400",
  },
  {
    icon: DollarSign,
    label: "Total Billed",
    value: "$124.5k",
    iconBg: "bg-blue-100 dark:bg-blue-900/30",
    iconColor: "text-blue-700 dark:text-blue-400",
  },
];

const StatusBadge = ({ status }) => {
  const isActive = status === "Active";
  return (
    <span
      className={`inline-flex items-center text-xs font-semibold px-2.5 py-1 rounded-full ${
        isActive
          ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
          : "bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400"
      }`}
    >
      {status}
    </span>
  );
};

const Clients = () => {
  const [activeTab, setActiveTab] = useState("all");

  const filteredClients = DUMMY_CLIENTS.filter((client) => {
    if (activeTab === "all") return true;
    if (activeTab === "active") return client.status === "Active";
    if (activeTab === "inactive") return client.status === "Inactive";
    return true;
  });

  return (
    <div className="p-8">
      {/* Page header */}
      <div className="flex items-start justify-between mb-7">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
            Client Directory
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Manage your professional relationships and billing history.
          </p>
        </div>

        <button className="flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white text-sm font-semibold px-5 py-2.5 rounded-xl transition-colors shadow-sm hover:shadow-md hover:shadow-green-200 dark:hover:shadow-green-900/40">
          <UserPlus size={16} />
          Add New Client
        </button>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-3 gap-5 mb-7">
        {STATS.map(({ icon: Icon, label, value, badge, iconBg, iconColor }) => (
          <div
            key={label}
            className="bg-white dark:bg-slate-900 rounded-2xl border border-gray-200 dark:border-slate-700 shadow-sm dark:shadow-black/30 p-5 transition-colors duration-300"
          >
            <div className="flex items-center justify-between mb-4">
              <div
                className={`w-9 h-9 rounded-xl flex items-center justify-center ${iconBg}`}
              >
                <Icon size={17} className={iconColor} />
              </div>
              {badge && (
                <span className="text-xs font-semibold text-green-700 dark:text-green-400 bg-green-50 dark:bg-green-900/30 px-2 py-0.5 rounded-full">
                  {badge}
                </span>
              )}
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">
              {label}
            </p>
            <p className="text-2xl font-bold text-slate-900 dark:text-white">
              {value}
            </p>
          </div>
        ))}
      </div>

      {/* Table card */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-gray-200 dark:border-slate-700 shadow-sm dark:shadow-black/30 transition-colors duration-300">
        {/* Tabs + actions row */}
        <div className="flex items-center justify-between px-6 pt-5 pb-4">
          <div className="flex items-center gap-1 bg-slate-50 dark:bg-slate-800 rounded-xl p-1">
            {TABS.map((tab) => {
              const isActive = activeTab === tab.key;
              return (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={`text-sm font-medium px-4 py-1.5 rounded-lg transition-colors duration-150 ${
                    isActive
                      ? "bg-white dark:bg-slate-700 text-green-700 dark:text-green-400 shadow-sm"
                      : "text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
                  }`}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>

          <div className="flex items-center gap-2">
            <button className="flex items-center gap-1.5 text-sm font-medium text-slate-600 dark:text-slate-300 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-3.5 py-2 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors">
              <Filter size={14} />
              Filters
            </button>
            <button className="flex items-center gap-1.5 text-sm font-medium text-slate-600 dark:text-slate-300 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-3.5 py-2 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors">
              <Download size={14} />
              Export
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-t border-b border-slate-100 dark:border-slate-800">
                <th className="text-left text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wide px-6 py-3">
                  Client Name
                </th>
                <th className="text-left text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wide px-6 py-3">
                  Industry
                </th>
                <th className="text-left text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wide px-6 py-3">
                  Projects
                </th>
                <th className="text-left text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wide px-6 py-3">
                  Total Revenue
                </th>
                <th className="text-left text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wide px-6 py-3">
                  Status
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredClients.length === 0 ? (
                <tr>
                  <td
                    colSpan={5}
                    className="text-center text-sm text-slate-400 dark:text-slate-500 py-12"
                  >
                    No clients found in this category.
                  </td>
                </tr>
              ) : (
                filteredClients.map((client) => (
                  <tr
                    key={client.id}
                    className="border-b border-slate-100 dark:border-slate-800 last:border-b-0 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div
                          className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0"
                          style={{ backgroundColor: client.avatarColor }}
                        >
                          {client.initials}
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-slate-800 dark:text-slate-100">
                            {client.name}
                          </p>
                          <p className="text-xs text-slate-400 dark:text-slate-500">
                            {client.email}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-300">
                      {client.industry}
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-300">
                      {client.projects}
                    </td>
                    <td className="px-6 py-4 text-sm font-medium text-slate-800 dark:text-slate-100">
                      $
                      {client.revenue.toLocaleString(undefined, {
                        minimumFractionDigits: 2,
                      })}
                    </td>
                    <td className="px-6 py-4">
                      <StatusBadge status={client.status} />
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination footer */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-slate-100 dark:border-slate-800">
          <p className="text-xs text-slate-400 dark:text-slate-500">
            Showing {filteredClients.length} of 42 clients
          </p>
          <div className="flex items-center gap-1.5">
            <button className="w-8 h-8 flex items-center justify-center rounded-lg text-slate-400 dark:text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
              <ChevronLeft size={15} />
            </button>
            <button className="w-8 h-8 flex items-center justify-center rounded-lg bg-green-500 text-white text-xs font-semibold">
              1
            </button>
            <button className="w-8 h-8 flex items-center justify-center rounded-lg text-slate-500 dark:text-slate-400 text-xs font-semibold hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
              2
            </button>
            <button className="w-8 h-8 flex items-center justify-center rounded-lg text-slate-500 dark:text-slate-400 text-xs font-semibold hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
              3
            </button>
            <button className="w-8 h-8 flex items-center justify-center rounded-lg text-slate-400 dark:text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
              <ChevronRight size={15} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Clients;
