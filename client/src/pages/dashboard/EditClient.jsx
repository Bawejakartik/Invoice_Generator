// pages/Dashboard/EditClient.jsx

import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { Save, ChevronRight } from "lucide-react";
import { useNavigate, useParams, Link } from "react-router-dom";

const initialFormState = {
  name: "",
  companyName: "",
  email: "",
  phone: "",
  taxId: "",
  address: "",
};

const EditClient = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState(initialFormState);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [saving, setSaving] = useState(false);
  const [archiving, setArchiving] = useState(false);

  useEffect(() => {
    const fetchClient = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await axios.get(
          `http://localhost:4000/api/v10/${id}`,
          { withCredentials: true },
        );

        const client = response.data.client || response.data;

        setForm({
          name: client.name || "",
          companyName: client.companyName || "",
          email: client.email || "",
          phone: client.phone || "",
          taxId: client.taxId || "",
          address: client.address || "",
        });
      } catch (err) {
        console.error(err);
        setError(
          err.response?.data?.message ||
            "Failed to load client. Please try again.",
        );
        toast.error(err.response?.data?.message || "Failed to load client.");
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchClient();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleCancel = () => {
    navigate("/dashboard/clients");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setSaving(true);

      const response = await axios.post(
        `http://localhost:4000/api/v10/updatedClient/${id}`,
        form,
        { withCredentials: true },
      );

      toast.success(response.data?.message || "Client updated successfully");
      navigate("/dashboard/clients");
    } catch (err) {
      console.error(err);
      toast.error(
        err.response?.data?.message ||
          "Failed to update client. Please try again.",
      );
    } finally {
      setSaving(false);
    }
  };

  const handleArchive = async () => {
    const confirmed = window.confirm(
      "Archive this client? You can stop creating new invoices for them while keeping their history.",
    );
    if (!confirmed) return;

    try {
      setArchiving(true);

      const response = await axios.post(
        `http://localhost:4000/api/v10/updatedClient/${id}`,
        { status: "Archived" },
        { withCredentials: true },
      );

      toast.success(response.data?.message || "Client archived");
      navigate("/dashboard/clients");
    } catch (err) {
      console.error(err);
      toast.error(
        err.response?.data?.message ||
          "Failed to archive client. Please try again.",
      );
    } finally {
      setArchiving(false);
    }
  };

  return (
    <div className="p-8">
      {/* Breadcrumb */}
      <div className="flex items-center gap-1.5 text-sm text-slate-400 dark:text-slate-500 mb-3">
        <Link
          to="/dashboard/clients"
          className="hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
        >
          Clients
        </Link>
        <ChevronRight size={14} />
        <span className="text-green-600 dark:text-green-400 font-medium">
          Edit Client
        </span>
      </div>

      {/* Page header */}
      <div className="mb-7">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
          Edit Client
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          Update information for your existing client profile.
        </p>
      </div>

      {loading ? (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-gray-200 dark:border-slate-700 shadow-sm dark:shadow-black/30 p-12 text-center text-sm text-slate-400 dark:text-slate-500">
          Loading client...
        </div>
      ) : error ? (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-gray-200 dark:border-slate-700 shadow-sm dark:shadow-black/30 p-12 text-center text-sm text-red-500 dark:text-red-400">
          {error}
        </div>
      ) : (
        <form onSubmit={handleSubmit}>
          {/* Form card */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-gray-200 dark:border-slate-700 shadow-sm dark:shadow-black/30 p-7 transition-colors duration-300">
            <div className="grid grid-cols-2 gap-x-10 gap-y-5">
              {/* Left column */}
              <div>
                <p className="text-xs font-semibold text-green-600 dark:text-green-400 uppercase tracking-wide mb-4">
                  Basic Information
                </p>

                <div className="mb-5">
                  <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1.5">
                    Full Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    required
                    className="w-full text-sm text-slate-800 dark:text-slate-100 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3.5 py-2.5 focus:outline-none focus:ring-2 focus:ring-green-500/50 focus:border-green-500 transition-colors"
                  />
                </div>

                <div className="mb-5">
                  <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1.5">
                    Company Name
                  </label>
                  <input
                    type="text"
                    name="companyName"
                    value={form.companyName}
                    onChange={handleChange}
                    className="w-full text-sm text-slate-800 dark:text-slate-100 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3.5 py-2.5 focus:outline-none focus:ring-2 focus:ring-green-500/50 focus:border-green-500 transition-colors"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1.5">
                      Email Address
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={form.email}
                      onChange={handleChange}
                      required
                      className="w-full text-sm text-slate-800 dark:text-slate-100 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3.5 py-2.5 focus:outline-none focus:ring-2 focus:ring-green-500/50 focus:border-green-500 transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1.5">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={form.phone}
                      onChange={handleChange}
                      className="w-full text-sm text-slate-800 dark:text-slate-100 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3.5 py-2.5 focus:outline-none focus:ring-2 focus:ring-green-500/50 focus:border-green-500 transition-colors"
                    />
                  </div>
                </div>
              </div>

              {/* Right column */}
              <div>
                <p className="text-xs font-semibold text-green-600 dark:text-green-400 uppercase tracking-wide mb-4">
                  Billing Details
                </p>

                <div className="mb-5">
                  <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1.5">
                    Tax ID / GST Number
                  </label>
                  <input
                    type="text"
                    name="taxId"
                    value={form.taxId}
                    onChange={handleChange}
                    className="w-full text-sm text-slate-800 dark:text-slate-100 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3.5 py-2.5 focus:outline-none focus:ring-2 focus:ring-green-500/50 focus:border-green-500 transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1.5">
                    Address
                  </label>
                  <textarea
                    name="address"
                    value={form.address}
                    onChange={handleChange}
                    rows={3}
                    className="w-full text-sm text-slate-800 dark:text-slate-100 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3.5 py-2.5 focus:outline-none focus:ring-2 focus:ring-green-500/50 focus:border-green-500 transition-colors resize-none"
                  />
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end gap-3 mt-8 pt-6 border-t border-slate-100 dark:border-slate-800">
              <button
                type="button"
                onClick={handleCancel}
                disabled={saving}
                className="text-sm font-semibold text-slate-600 dark:text-slate-300 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-5 py-2.5 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={saving}
                className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white text-sm font-semibold px-5 py-2.5 rounded-xl transition-colors shadow-sm hover:shadow-md hover:shadow-green-200 dark:hover:shadow-green-900/40 disabled:opacity-60 disabled:cursor-not-allowed"
              >
                <Save size={16} />
                {saving ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </div>
        </form>
      )}

      {/* Archive client card */}
      <div className="flex items-center justify-between bg-white dark:bg-slate-900 rounded-2xl border border-gray-200 dark:border-slate-700 shadow-sm dark:shadow-black/30 p-6 mt-5 transition-colors duration-300">
        <div>
          <p className="text-sm font-semibold text-red-600 dark:text-red-400">
            Archive Client
          </p>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Stop creating new invoices for this client while keeping history.
          </p>
        </div>
        <button
          type="button"
          onClick={handleArchive}
          disabled={archiving || loading}
          className="text-sm font-semibold text-red-600 dark:text-red-400 bg-white dark:bg-slate-800 border border-red-200 dark:border-red-900/50 px-5 py-2.5 rounded-xl hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {archiving ? "Archiving..." : "Archive"}
        </button>
      </div>
    </div>
  );
};

export default EditClient;
