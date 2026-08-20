// pages/Dashboard/Settings.jsx

import React, { useState } from "react";
import { Upload, Shield, Wallet, LifeBuoy, LogOut } from "lucide-react";
import SettingsSidebar from "../../pages/components/SettingsSidebar";
import axiosInstance from "../../util/axiosInstance";

const Settings = () => {
  const [activeSection, setActiveSection] = useState("business");
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const [businessName, setBusinessName] = useState("");
  const [professionalTitle, setProfessionalTitle] = useState("");
  const [professionalEmail, setProfessionalEmail] = useState("");
  const [website, setWebsite] = useState("");
  const [address, setAddress] = useState("");

  // Form state for Tax Settings
  const [taxRate, setTaxRate] = useState("20");
  const [includeTaxOnInvoices, setIncludeTaxOnInvoices] = useState(false);
  const [applyRegionalVat, setApplyRegionalVat] = useState(false);
  const [taxRegNumber, setTaxRegNumber] = useState("GB 123 4567 89");
  const [reportingCurrency, setReportingCurrency] = useState(
    "GBP - British Pound Sterling (£)",
  );

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      const response = await axiosInstance.post("/api/v8/logout", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        // Redirect to login page or home after successful logout
        window.location.href = "/login";
      } else {
        console.error("Logout failed:", response.statusText);
      }
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      setIsLoggingOut(false);
    }
  };

  return (
    <div className="p-8">
      {/* Page heading */}
      <div className="mb-7 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
            Account Settings
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Manage your professional identity and financial preferences.
          </p>
        </div>

        {/* Logout button */}
        <button
          onClick={handleLogout}
          disabled={isLoggingOut}
          className="flex items-center gap-2 px-4 py-2.5 text-sm font-semibold text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-800/40 rounded-xl hover:bg-red-100 dark:hover:bg-red-900/40 hover:border-red-200 dark:hover:border-red-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <LogOut size={15} className={isLoggingOut ? "animate-spin" : ""} />
          {isLoggingOut ? "Signing out…" : "Sign Out"}
        </button>
      </div>

      <div className="flex gap-8">
        {/* Sub-sidebar */}
        <SettingsSidebar active={activeSection} onChange={setActiveSection} />

        {/* Main content column */}
        <div className="flex-1 flex flex-col gap-6">
          {/* Business Profile card */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-gray-200 dark:border-slate-700 shadow-sm dark:shadow-black/30 p-6 transition-colors duration-300">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-base font-semibold text-slate-800 dark:text-white">
                Business Profile
              </h2>
              <span className="text-xs font-semibold text-green-700 dark:text-green-400 bg-green-50 dark:bg-green-900/30 px-2.5 py-1 rounded-full">
                Public info
              </span>
            </div>

            {/* Logo + Business Name + Title row */}
            <div className="grid grid-cols-[110px_1fr_1fr] gap-4 mb-4">
              <div>
                <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1.5">
                  Business Logo
                </label>
                <div className="w-[90px] h-[90px] rounded-xl border-2 border-dashed border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 flex flex-col items-center justify-center gap-1 cursor-pointer hover:border-green-400 dark:hover:border-green-500 transition-colors">
                  <Upload
                    size={16}
                    className="text-slate-400 dark:text-slate-500"
                  />
                  <span className="text-[10px] text-slate-400 dark:text-slate-500">
                    Upload PNG/JPG
                  </span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1.5">
                  Business Name
                </label>
                <input
                  type="text"
                  value={businessName}
                  onChange={(e) => setBusinessName(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-800 dark:text-slate-100 outline-none transition-all focus:border-green-400 dark:focus:border-green-500 focus:ring-2 focus:ring-green-100 dark:focus:ring-green-900/40 focus:bg-white dark:focus:bg-slate-800"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1.5">
                  Professional Title
                </label>
                <input
                  type="text"
                  value={professionalTitle}
                  onChange={(e) => setProfessionalTitle(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-800 dark:text-slate-100 outline-none transition-all focus:border-green-400 dark:focus:border-green-500 focus:ring-2 focus:ring-green-100 dark:focus:ring-green-900/40 focus:bg-white dark:focus:bg-slate-800"
                />
              </div>
            </div>

            {/* Email */}
            <div className="mb-4">
              <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1.5">
                Professional Email
              </label>
              <input
                type="email"
                value={professionalEmail}
                onChange={(e) => setProfessionalEmail(e.target.value)}
                className="w-full px-3.5 py-2.5 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-800 dark:text-slate-100 outline-none transition-all focus:border-green-400 dark:focus:border-green-500 focus:ring-2 focus:ring-green-100 dark:focus:ring-green-900/40 focus:bg-white dark:focus:bg-slate-800"
              />
            </div>

            {/* Website */}
            <div className="mb-4">
              <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1.5">
                Website
              </label>
              <input
                type="text"
                value={website}
                onChange={(e) => setWebsite(e.target.value)}
                className="w-full px-3.5 py-2.5 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-800 dark:text-slate-100 outline-none transition-all focus:border-green-400 dark:focus:border-green-500 focus:ring-2 focus:ring-green-100 dark:focus:ring-green-900/40 focus:bg-white dark:focus:bg-slate-800"
              />
            </div>

            {/* Registered Address */}
            <div>
              <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1.5">
                Registered Address
              </label>
              <textarea
                rows={2}
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="w-full px-3.5 py-2.5 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-800 dark:text-slate-100 outline-none transition-all focus:border-green-400 dark:focus:border-green-500 focus:ring-2 focus:ring-green-100 dark:focus:ring-green-900/40 focus:bg-white dark:focus:bg-slate-800 resize-none"
              />
            </div>
          </div>

          {/* Tax Settings card */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-gray-200 dark:border-slate-700 shadow-sm dark:shadow-black/30 p-6 transition-colors duration-300">
            <h2 className="text-base font-semibold text-slate-800 dark:text-white mb-5">
              Tax Settings
            </h2>

            {/* Default Tax Rate */}
            <div className="flex items-center justify-between mb-4 pb-4 border-b border-slate-100 dark:border-slate-800">
              <div>
                <p className="text-sm font-medium text-slate-700 dark:text-slate-200">
                  Default Tax Rate
                </p>
                <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">
                  This will be applied to all new invoices by default.
                </p>
              </div>
              <div className="flex items-center gap-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2">
                <input
                  type="text"
                  value={taxRate}
                  onChange={(e) => setTaxRate(e.target.value)}
                  className="w-10 bg-transparent outline-none text-sm text-slate-800 dark:text-slate-100 text-right"
                />
                <span className="text-sm text-slate-500 dark:text-slate-400">
                  %
                </span>
              </div>
            </div>

            {/* Checkboxes */}
            <div className="flex flex-col gap-3 mb-5">
              <label className="flex items-center gap-2.5 cursor-pointer select-none">
                <div
                  onClick={() => setIncludeTaxOnInvoices((p) => !p)}
                  className={`w-4 h-4 rounded flex items-center justify-center border transition-all flex-shrink-0 ${
                    includeTaxOnInvoices
                      ? "bg-green-500 border-green-500"
                      : "border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-800"
                  }`}
                >
                  {includeTaxOnInvoices && (
                    <svg
                      className="w-2.5 h-2.5"
                      viewBox="0 0 12 10"
                      fill="none"
                      stroke="white"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <polyline points="1,5 4.5,9 11,1" />
                    </svg>
                  )}
                </div>
                <span className="text-sm text-slate-600 dark:text-slate-300">
                  Always include Tax ID on invoices
                </span>
              </label>

              <label className="flex items-center gap-2.5 cursor-pointer select-none">
                <div
                  onClick={() => setApplyRegionalVat((p) => !p)}
                  className={`w-4 h-4 rounded flex items-center justify-center border transition-all flex-shrink-0 ${
                    applyRegionalVat
                      ? "bg-green-500 border-green-500"
                      : "border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-800"
                  }`}
                >
                  {applyRegionalVat && (
                    <svg
                      className="w-2.5 h-2.5"
                      viewBox="0 0 12 10"
                      fill="none"
                      stroke="white"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <polyline points="1,5 4.5,9 11,1" />
                    </svg>
                  )}
                </div>
                <span className="text-sm text-slate-600 dark:text-slate-300">
                  Apply regional VAT based on client address
                </span>
              </label>
            </div>

            {/* Tax Reg Number + Reporting Currency */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1.5">
                  Tax Registration Number (VAT/EIN)
                </label>
                <input
                  type="text"
                  value={taxRegNumber}
                  onChange={(e) => setTaxRegNumber(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-800 dark:text-slate-100 outline-none transition-all focus:border-green-400 dark:focus:border-green-500 focus:ring-2 focus:ring-green-100 dark:focus:ring-green-900/40 focus:bg-white dark:focus:bg-slate-800"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1.5">
                  Reporting Currency
                </label>
                <select
                  value={reportingCurrency}
                  onChange={(e) => setReportingCurrency(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-800 dark:text-slate-100 outline-none transition-all focus:border-green-400 dark:focus:border-green-500 focus:ring-2 focus:ring-green-100 dark:focus:ring-green-900/40 focus:bg-white dark:focus:bg-slate-800"
                >
                  <option>GBP - British Pound Sterling (£)</option>
                  <option>USD - US Dollar ($)</option>
                  <option>EUR - Euro (€)</option>
                </select>
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex items-center justify-end gap-3 mt-6">
              <button className="px-5 py-2.5 text-sm font-semibold text-slate-600 dark:text-slate-300 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors">
                Discard Changes
              </button>
              <button className="px-5 py-2.5 text-sm font-semibold text-white bg-green-500 hover:bg-green-600 rounded-xl transition-colors shadow-sm hover:shadow-md hover:shadow-green-200 dark:hover:shadow-green-900/40">
                Save Changes
              </button>
            </div>
          </div>

          {/* Bottom info cards */}
          <div className="grid grid-cols-3 gap-5">
            {/* Security card */}
            <div className="bg-blue-50 dark:bg-slate-900 border border-blue-100 dark:border-slate-700 rounded-2xl p-5 transition-colors duration-300">
              <div className="w-9 h-9 rounded-full bg-blue-100 dark:bg-blue-900/40 flex items-center justify-center mb-3">
                <Shield
                  size={17}
                  className="text-blue-600 dark:text-blue-400"
                />
              </div>
              <h3 className="text-sm font-semibold text-slate-800 dark:text-white mb-1">
                Security
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mb-4 leading-relaxed">
                Two-factor authentication is active for your account.
              </p>
              <button className="text-xs font-semibold text-green-700 dark:text-green-400 hover:text-green-500 transition-colors">
                Manage Security
              </button>
            </div>

            {/* Payouts card */}
            <div className="bg-amber-50 dark:bg-slate-900 border border-amber-100 dark:border-slate-700 rounded-2xl p-5 transition-colors duration-300">
              <div className="w-9 h-9 rounded-full bg-amber-100 dark:bg-amber-900/40 flex items-center justify-center mb-3">
                <Wallet
                  size={17}
                  className="text-amber-600 dark:text-amber-400"
                />
              </div>
              <h3 className="text-sm font-semibold text-slate-800 dark:text-white mb-1">
                Payouts
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mb-4 leading-relaxed">
                Your next scheduled payout is Monday, Nov 27th.
              </p>
              <button className="text-xs font-semibold text-green-700 dark:text-green-400 hover:text-green-500 transition-colors">
                View Schedule
              </button>
            </div>

            {/* Need help card */}
            <div className="bg-[#0F2E1D] dark:bg-green-950 border border-transparent rounded-2xl p-5 relative overflow-hidden transition-colors duration-300">
              <div className="w-9 h-9 rounded-full bg-green-800/60 dark:bg-green-900/60 flex items-center justify-center mb-3">
                <LifeBuoy size={17} className="text-green-300" />
              </div>
              <h3 className="text-sm font-semibold text-white mb-1">
                Need help?
              </h3>
              <p className="text-xs text-green-200/80 mb-4 leading-relaxed">
                Our dedicated support team is available 24/7 for Pro users.
              </p>
              <button className="text-xs font-semibold text-white bg-green-600 hover:bg-green-500 px-3.5 py-2 rounded-lg transition-colors">
                Contact Support
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
