// pages/Dashboard/Invoices.jsx

import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import {
  FileText,
  CheckCircle2,
  Clock,
  IndianRupee,
  Plus,
  SlidersHorizontal,
  ChevronLeft,
  ChevronRight,
  Pencil,
  Trash2,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import ConfirmDeleteModal from "../../pages/components/confirmDeleteModal";

const TABS = [
  { key: "all", label: "All" },
  { key: "Paid", label: "Paid" },
  { key: "Pending", label: "Pending" },
  { key: "Draft", label: "Draft" },
  { key: "Overdue", label: "Overdue" },
];

const ROWS_PER_PAGE = 6;

const StatusBadge = ({ status }) => {
  const toneMap = {
    Paid: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
    Pending:
      "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
    Overdue: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
    Draft: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
  };

  return (
    <span
      className={`inline-flex items-center text-xs font-semibold px-2.5 py-1 rounded-full ${
        toneMap[status] ||
        "bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400"
      }`}
    >
      {status}
    </span>
  );
};

const formatINR = (amount) => `₹${(amount || 0).toLocaleString("en-IN")}`;

const formatDate = (dateStr) => {
  if (!dateStr) return "—";
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return "—";
  return d.toLocaleDateString("en-US", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};

const getInitials = (name = "") =>
  name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0].toUpperCase())
    .join("");

const AVATAR_COLORS = [
  "#16a34a",
  "#2563eb",
  "#9333ea",
  "#ea580c",
  "#0891b2",
  "#db2777",
];

const colorForName = (name = "") => {
  const sum = name.split("").reduce((acc, ch) => acc + ch.charCodeAt(0), 0);
  return AVATAR_COLORS[sum % AVATAR_COLORS.length];
};

const Invoices = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("all");
  const [invoices, setInvoices] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [deletingId, setDeletingId] = useState(null);
  const [invoiceToDelete, setInvoiceToDelete] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        const [invoicesRes, statsRes] = await Promise.all([
          axios.get("/api/v12/getInvoices", { withCredentials: true }),
          axios.get("/api/v12/dashboard/stats", { withCredentials: true }),
        ]);

        setInvoices(invoicesRes.data.invoices || []);
        setStats(statsRes.data.stats || null);
      } catch (err) {
        console.error(err);
        setError(
          err.response?.data?.message ||
            "Failed to load invoices. Please try again.",
        );
        toast.error(err.response?.data?.message || "Failed to load invoices.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [activeTab]);

  const filteredInvoices = invoices.filter((invoice) => {
    if (activeTab === "all") return true;
    return invoice.status === activeTab;
  });

  const totalPages = Math.max(
    1,
    Math.ceil(filteredInvoices.length / ROWS_PER_PAGE),
  );
  const safePage = Math.min(currentPage, totalPages);
  const startIndex = (safePage - 1) * ROWS_PER_PAGE;
  const paginatedInvoices = filteredInvoices.slice(
    startIndex,
    startIndex + ROWS_PER_PAGE,
  );

  const goToPage = (page) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
  };

  // Overdue count isn't returned by dashboardStats, so derive it from the list itself
  const overdueCount = invoices.filter(
    (inv) => inv.status === "Overdue",
  ).length;
  const pendingAmount = invoices
    .filter((inv) => inv.status === "Pending")
    .reduce((sum, inv) => sum + (inv.totalAmount || 0), 0);
  const paidAmount = invoices
    .filter((inv) => inv.status === "Paid")
    .reduce((sum, inv) => sum + (inv.totalAmount || 0), 0);

  const STATS = [
    {
      icon: FileText,
      label: "Total Invoices",
      value: stats ? String(stats.totalInvoice) : "—",
      sub: "All time",
      iconBg: "bg-slate-100 dark:bg-slate-800",
      iconColor: "text-slate-600 dark:text-slate-300",
    },
    {
      icon: CheckCircle2,
      label: "Paid",
      value: stats ? String(stats.paidInvoices) : "—",
      sub: `${formatINR(paidAmount)} received`,
      valueColor: "text-green-600 dark:text-green-400",
      iconBg: "bg-green-100 dark:bg-green-900/30",
      iconColor: "text-green-700 dark:text-green-400",
    },
    {
      icon: Clock,
      label: "Pending",
      value: stats ? String(stats.pendingInvoice) : "—",
      sub: `${formatINR(pendingAmount)} outstanding`,
      valueColor: "text-amber-600 dark:text-amber-400",
      iconBg: "bg-amber-100 dark:bg-amber-900/30",
      iconColor: "text-amber-700 dark:text-amber-400",
    },
    {
      icon: IndianRupee,
      label: "Total Revenue",
      value: stats ? formatINR(stats.totalRevenue) : "—",
      iconBg: "bg-blue-100 dark:bg-blue-900/30",
      iconColor: "text-blue-700 dark:text-blue-400",
    },
  ];

  const requestDelete = (invoice) => setInvoiceToDelete(invoice);

  const closeModal = () => {
    if (deletingId) return;
    setInvoiceToDelete(null);
  };

  const confirmDelete = async () => {
    if (!invoiceToDelete) return;
    const id = invoiceToDelete._id;

    try {
      setDeletingId(id);

      await axios.delete(`/api/v12/delete/${id}`, {
        withCredentials: true,
      });

      setInvoices((prev) => prev.filter((inv) => inv._id !== id));
      toast.success(`${invoiceToDelete.invoiceNumber} was deleted.`);
      setInvoiceToDelete(null);
    } catch (err) {
      console.error(err);
      toast.error(
        err.response?.data?.message ||
          "Failed to delete invoice. Please try again.",
      );
    } finally {
      setDeletingId(null);
    }
  };

  const handleEdit = (invoice) => {
    navigate(`/dashboard/invoices/status/${invoice._id}`);
  };

  return (
    <div className="p-8">
      {/* Page header */}
      <div className="flex items-start justify-between mb-7">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
            Invoices
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Manage and track your client billing.
          </p>
        </div>

        <button
          className="flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white text-sm font-semibold px-5 py-2.5 rounded-xl transition-colors shadow-sm hover:shadow-md hover:shadow-green-200 dark:hover:shadow-green-900/40"
          onClick={() => navigate("/dashboard/invoices/new")}
        >
          <Plus size={16} />
          New Invoice
        </button>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-4 gap-5 mb-7">
        {STATS.map(
          ({
            icon: Icon,
            label,
            value,
            sub,
            valueColor,
            iconBg,
            iconColor,
          }) => (
            <div
              key={label}
              className="bg-white dark:bg-slate-900 rounded-2xl border border-gray-200 dark:border-slate-700 shadow-sm dark:shadow-black/30 p-5 transition-colors duration-300"
            >
              <div className="flex items-center justify-between mb-4">
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {label}
                </p>
                <div
                  className={`w-8 h-8 rounded-lg flex items-center justify-center ${iconBg}`}
                >
                  <Icon size={15} className={iconColor} />
                </div>
              </div>
              <p
                className={`text-2xl font-bold ${
                  valueColor || "text-slate-900 dark:text-white"
                }`}
              >
                {loading ? "—" : value}
              </p>
              {sub && (
                <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">
                  {loading ? "" : sub}
                </p>
              )}
            </div>
          ),
        )}
      </div>

      {/* Table card */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-gray-200 dark:border-slate-700 shadow-sm dark:shadow-black/30 transition-colors duration-300">
        <div className="flex items-center justify-between px-6 pt-5 pb-4">
          <div className="flex items-center gap-1 bg-slate-50 dark:bg-slate-800 rounded-xl p-1">
            {TABS.map((tab) => {
              const isActive = activeTab === tab.key;
              const count =
                tab.key === "all"
                  ? invoices.length
                  : tab.key === "Overdue"
                    ? overdueCount
                    : invoices.filter((inv) => inv.status === tab.key).length;

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
                  {!loading && (
                    <span className="ml-1.5 text-xs text-slate-400 dark:text-slate-500">
                      {count}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          <button className="flex items-center gap-1.5 text-sm font-medium text-slate-600 dark:text-slate-300 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-3.5 py-2 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors">
            <SlidersHorizontal size={14} />
            Advanced Filters
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-t border-b border-slate-100 dark:border-slate-800">
                <th className="text-left text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wide px-6 py-3">
                  Invoice ID
                </th>
                <th className="text-left text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wide px-6 py-3">
                  Client
                </th>
                <th className="text-left text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wide px-6 py-3">
                  Issue Date
                </th>
                <th className="text-left text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wide px-6 py-3">
                  Due Date
                </th>
                <th className="text-left text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wide px-6 py-3">
                  Amount
                </th>
                <th className="text-left text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wide px-6 py-3">
                  Status
                </th>
                <th className="text-right text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wide px-6 py-3">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td
                    colSpan={7}
                    className="text-center text-sm text-slate-400 dark:text-slate-500 py-12"
                  >
                    Loading invoices...
                  </td>
                </tr>
              ) : error ? (
                <tr>
                  <td
                    colSpan={7}
                    className="text-center text-sm text-red-500 dark:text-red-400 py-12"
                  >
                    {error}
                  </td>
                </tr>
              ) : paginatedInvoices.length === 0 ? (
                <tr>
                  <td
                    colSpan={7}
                    className="text-center text-sm text-slate-400 dark:text-slate-500 py-12"
                  >
                    No invoices found in this category.
                  </td>
                </tr>
              ) : (
                paginatedInvoices.map((invoice) => {
                  const client = invoice.clientId;
                  const clientName = client?.name || "—";
                  const isDeleting = deletingId === invoice._id;

                  return (
                    <tr
                      key={invoice._id}
                      className="border-b border-slate-100 dark:border-slate-800 last:border-b-0 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
                    >
                      <td className="px-6 py-4 text-sm font-semibold text-slate-800 dark:text-slate-100">
                        {invoice.invoiceNumber}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2.5">
                          <div
                            className="w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-bold text-white flex-shrink-0"
                            style={{
                              backgroundColor: colorForName(clientName),
                            }}
                          >
                            {getInitials(clientName)}
                          </div>
                          <span className="text-sm text-slate-700 dark:text-slate-200">
                            {clientName}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-500 dark:text-slate-400">
                        {formatDate(invoice.issueDate)}
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-500 dark:text-slate-400">
                        {formatDate(invoice.dueDate)}
                      </td>
                      <td className="px-6 py-4 text-sm font-medium text-slate-800 dark:text-slate-100">
                        {formatINR(invoice.totalAmount)}
                      </td>
                      <td className="px-6 py-4">
                        <StatusBadge status={invoice.status} />
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleEdit(invoice)}
                            title="Edit invoice"
                            className="w-8 h-8 flex items-center justify-center rounded-lg text-slate-500 dark:text-slate-400 hover:bg-blue-50 dark:hover:bg-blue-900/30 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                          >
                            <Pencil size={15} />
                          </button>
                          <button
                            onClick={() => requestDelete(invoice)}
                            disabled={isDeleting}
                            title="Delete invoice"
                            className={`w-8 h-8 flex items-center justify-center rounded-lg transition-colors ${
                              isDeleting
                                ? "text-slate-300 dark:text-slate-600 cursor-not-allowed"
                                : "text-slate-500 dark:text-slate-400 hover:bg-red-50 dark:hover:bg-red-900/30 hover:text-red-600 dark:hover:text-red-400"
                            }`}
                          >
                            <Trash2 size={15} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination footer */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-slate-100 dark:border-slate-800">
          <p className="text-xs text-slate-400 dark:text-slate-500">
            Showing {paginatedInvoices.length === 0 ? 0 : startIndex + 1}–
            {Math.min(startIndex + ROWS_PER_PAGE, filteredInvoices.length)} of{" "}
            {filteredInvoices.length} results
          </p>
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => goToPage(safePage - 1)}
              disabled={safePage === 1}
              className={`w-8 h-8 flex items-center justify-center rounded-lg transition-colors ${
                safePage === 1
                  ? "text-slate-300 dark:text-slate-600 cursor-not-allowed"
                  : "text-slate-400 dark:text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"
              }`}
            >
              <ChevronLeft size={15} />
            </button>
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 px-2">
              {safePage} / {totalPages}
            </span>
            <button
              onClick={() => goToPage(safePage + 1)}
              disabled={safePage === totalPages}
              className={`w-8 h-8 flex items-center justify-center rounded-lg transition-colors ${
                safePage === totalPages
                  ? "text-slate-300 dark:text-slate-600 cursor-not-allowed"
                  : "text-slate-400 dark:text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"
              }`}
            >
              <ChevronRight size={15} />
            </button>
          </div>
        </div>
      </div>

      {/* Delete confirmation modal */}
      <ConfirmDeleteModal
        isOpen={!!invoiceToDelete}
        onClose={closeModal}
        onConfirm={confirmDelete}
        clientName={invoiceToDelete?.invoiceNumber}
        isDeleting={!!deletingId}
      />
    </div>
  );
};

export default Invoices;
