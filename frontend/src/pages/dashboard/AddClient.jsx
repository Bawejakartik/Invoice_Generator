// pages/Dashboard/AddNewClient.jsx

import React, { useState } from "react";
import axiosInstance from "../../util/axiosInstance";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { ChevronRight, Lightbulb } from "lucide-react";

const AddNewClient = () => {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [gstNumber, setGstNumber] = useState("");
  const [address, setAddress] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSaveClient = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const data = {
        name,
        companyName,
        email,
        phone,
        gstNumber,
        address,
      };

      await axiosInstance.post("/api/v10/client", data, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      toast.success("Client added successfully!");

      navigate("/dashboard/clients");
    } catch (error) {
      console.error(error);
      toast.error(
        error.response?.data?.message ||
          "Failed to add client. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    navigate("/dashboard/clients");
  };

  return (
    <div className="p-8">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm mb-4">
        <button
          onClick={() => navigate("/dashboard/clients")}
          className="text-green-700 dark:text-green-400 hover:text-green-500 transition-colors font-medium"
        >
          Clients
        </button>
        <ChevronRight
          size={14}
          className="text-slate-400 dark:text-slate-500"
        />
        <span className="text-slate-700 dark:text-slate-300 font-medium">
          Add New Client
        </span>
      </div>

      {/* Page heading */}
      <div className="mb-7">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
          Add New Client
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          Register a new professional relationship for your billing and
          projects.
        </p>
      </div>

      {/* Form card */}
      <form
        onSubmit={handleSaveClient}
        className="bg-white dark:bg-slate-900 rounded-2xl border border-gray-200 dark:border-slate-700 shadow-sm dark:shadow-black/30 p-6 max-w-3xl transition-colors duration-300"
      >
        {/* Row 1: Client Name + Company Name */}
        <div className="grid grid-cols-2 gap-5 mb-5">
          <div>
            <label className="block text-xs font-semibold text-green-700 dark:text-green-400 mb-1.5">
              Client Name (Full Name)
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Sarah Johnson"
              required
              className="w-full px-3.5 py-2.5 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 outline-none transition-all focus:border-green-400 dark:focus:border-green-500 focus:ring-2 focus:ring-green-100 dark:focus:ring-green-900/40 focus:bg-white dark:focus:bg-slate-800"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-green-700 dark:text-green-400 mb-1.5">
              Company Name
            </label>
            <input
              type="text"
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              placeholder="e.g. Acme Creative Studios"
              className="w-full px-3.5 py-2.5 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 outline-none transition-all focus:border-green-400 dark:focus:border-green-500 focus:ring-2 focus:ring-green-100 dark:focus:ring-green-900/40 focus:bg-white dark:focus:bg-slate-800"
            />
          </div>
        </div>

        {/* Row 2: Email + Phone */}
        <div className="grid grid-cols-2 gap-5 mb-5">
          <div>
            <label className="block text-xs font-semibold text-green-700 dark:text-green-400 mb-1.5">
              Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="sarah@company.com"
              required
              className="w-full px-3.5 py-2.5 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 outline-none transition-all focus:border-green-400 dark:focus:border-green-500 focus:ring-2 focus:ring-green-100 dark:focus:ring-green-900/40 focus:bg-white dark:focus:bg-slate-800"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-green-700 dark:text-green-400 mb-1.5">
              Phone Number
            </label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+1 (555) 000-0000"
              className="w-full px-3.5 py-2.5 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 outline-none transition-all focus:border-green-400 dark:focus:border-green-500 focus:ring-2 focus:ring-green-100 dark:focus:ring-green-900/40 focus:bg-white dark:focus:bg-slate-800"
            />
          </div>
        </div>

        {/* Row 3: GST Number */}
        <div className="mb-5">
          <label className="block text-xs font-semibold text-green-700 dark:text-green-400 mb-1.5">
            GST Number (or Tax ID)
          </label>
          <input
            type="text"
            value={gstNumber}
            onChange={(e) => setGstNumber(e.target.value)}
            placeholder="e.g. GSTIN1234567890"
            className="w-full px-3.5 py-2.5 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 outline-none transition-all focus:border-green-400 dark:focus:border-green-500 focus:ring-2 focus:ring-green-100 dark:focus:ring-green-900/40 focus:bg-white dark:focus:bg-slate-800"
          />
        </div>

        {/* Row 4: Billing Address */}
        <div className="mb-6">
          <label className="block text-xs font-semibold text-green-700 dark:text-green-400 mb-1.5">
            Billing Address
          </label>
          <textarea
            rows={3}
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            placeholder="Street Address, City, State, ZIP, Country"
            className="w-full px-3.5 py-2.5 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 outline-none transition-all focus:border-green-400 dark:focus:border-green-500 focus:ring-2 focus:ring-green-100 dark:focus:ring-green-900/40 focus:bg-white dark:focus:bg-slate-800 resize-none"
          />
        </div>

        {/* Divider */}
        <div className="border-t border-slate-100 dark:border-slate-800 mb-5" />

        {/* Actions */}
        <div className="flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={handleCancel}
            className="px-5 py-2.5 text-sm font-semibold text-slate-600 dark:text-slate-300 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className={`px-5 py-2.5 text-sm font-semibold text-white rounded-xl transition-all shadow-sm ${
              loading
                ? "bg-gray-400 dark:bg-gray-600 cursor-not-allowed"
                : "bg-green-500 hover:bg-green-600 hover:shadow-md hover:shadow-green-200 dark:hover:shadow-green-900/40"
            }`}
          >
            {loading ? "Saving..." : "Save Client"}
          </button>
        </div>
      </form>

      {/* Quick tip */}
      <div className="max-w-3xl mt-5 bg-indigo-50 dark:bg-slate-900 border border-indigo-100 dark:border-slate-700 rounded-2xl p-4 flex items-start gap-3 transition-colors duration-300">
        <div className="w-8 h-8 rounded-full bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center flex-shrink-0">
          <Lightbulb
            size={15}
            className="text-indigo-600 dark:text-indigo-400"
          />
        </div>
        <div>
          <p className="text-sm font-semibold text-slate-700 dark:text-slate-200">
            Quick Tip
          </p>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 leading-relaxed">
            Clients added here will automatically appear as options in your "New
            Invoice" dropdown. You can also attach these clients to specific
            active projects later.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AddNewClient;
