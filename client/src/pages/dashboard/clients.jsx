// pages/Dashboard/Clients.jsx

import React, { useState, useEffect } from "react";
import axiosInstance from "../../util/axiosInstance";
import { toast } from "react-toastify";
import {
  Users,
  CheckSquare,
  DollarSign,
  UserPlus,
  Filter,
  Download,
  ChevronLeft,
  ChevronRight,
  Pencil,
  Trash2,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import ConfirmDeleteModal from "../../pages/components/confirmDeleteModal";

const TABS = [
  { key: "all", label: "All Clients" },
  { key: "Paid", label: "Paid" },
  { key: "Pending", label: "Pending" },
  { key: "Overdue", label: "Overdue" },
];

const ROWS_PER_PAGE = 4;

const StatusBadge = ({ status }) => {
  const toneMap = {
    Paid: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
    Pending:
      "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
    Overdue: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
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

const Clients = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("all");
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [deletingId, setDeletingId] = useState(null);

  // Modal state — which client (if any) is pending delete confirmation
  const [clientToDelete, setClientToDelete] = useState(null);

  useEffect(() => {
    const fetchClients = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await axiosInstance.get(
          "/api/v10/getAllClient",
          { withCredentials: true },
        );

        setClients(response.data.clients || []);
      } catch (err) {
        console.error(err);
        setError(
          err.response?.data?.message ||
            "Failed to load clients. Please try again.",
        );
        toast.error(err.response?.data?.message || "Failed to load clients.");
      } finally {
        setLoading(false);
      }
    };

    fetchClients();
  }, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [activeTab]);

  const filteredClients = clients.filter((client) => {
    if (activeTab === "all") return true;
    return client.status === activeTab;
  });

  const totalPages = Math.max(
    1,
    Math.ceil(filteredClients.length / ROWS_PER_PAGE),
  );
  const safePage = Math.min(currentPage, totalPages);
  const startIndex = (safePage - 1) * ROWS_PER_PAGE;
  const paginatedClients = filteredClients.slice(
    startIndex,
    startIndex + ROWS_PER_PAGE,
  );

  const goToPage = (page) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
  };

  const getPageNumbers = () => {
    const maxButtons = 5;
    let start = Math.max(1, safePage - Math.floor(maxButtons / 2));
    let end = Math.min(totalPages, start + maxButtons - 1);
    start = Math.max(1, end - maxButtons + 1);
    const pages = [];
    for (let i = start; i <= end; i++) pages.push(i);
    return pages;
  };

  const totalClients = clients.length;
  const activeProjects = clients.reduce((sum, c) => sum + (c.projects || 0), 0);
  const totalBilled = clients.reduce((sum, c) => sum + (c.revenue || 0), 0);

  const formatCurrency = (amount) => {
    if (amount >= 1000) return `$${(amount / 1000).toFixed(1)}k`;
    return `$${amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}`;
  };

  const STATS = [
    {
      icon: Users,
      label: "Total Clients",
      value: String(totalClients),
      iconBg: "bg-green-100 dark:bg-green-900/30",
      iconColor: "text-green-700 dark:text-green-400",
    },
    {
      icon: CheckSquare,
      label: "Active Projects",
      value: String(activeProjects),
      iconBg: "bg-amber-100 dark:bg-amber-900/30",
      iconColor: "text-amber-700 dark:text-amber-400",
    },
    {
      icon: DollarSign,
      label: "Total Billed",
      value: formatCurrency(totalBilled),
      iconBg: "bg-blue-100 dark:bg-blue-900/30",
      iconColor: "text-blue-700 dark:text-blue-400",
    },
  ];

  // Opens the modal instead of window.confirm
  const requestDelete = (client) => {
    setClientToDelete(client);
  };

  const closeModal = () => {
    if (deletingId) return; // don't allow closing mid-request
    setClientToDelete(null);
  };

  // Actual delete — fires when "Delete Client" is confirmed in the modal
  const confirmDelete = async () => {
    if (!clientToDelete) return;
    const id = clientToDelete._id || clientToDelete.id;

    try {
      setDeletingId(id);

      // FIXED: was axios.get — delete requests must use axios.delete
      // to match the backend's route.delete('/delete/:id', ...)
      await axios.delete(`/api/v10/delete/${id}`, {
        withCredentials: true,
      });

      setClients((prev) => prev.filter((c) => (c._id || c.id) !== id));
      toast.success(`${clientToDelete.name} was deleted.`);
      setClientToDelete(null);
    } catch (err) {
      console.error(err);
      toast.error(
        err.response?.data?.message ||
          "Failed to delete client. Please try again.",
      );
    } finally {
      setDeletingId(null);
    }
  };

  const handleEdit = (client) => {
    const id = client._id || client.id;
    navigate(`/dashboard/edit/${id}`);
  };

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

        <button
          className="flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white text-sm font-semibold px-5 py-2.5 rounded-xl transition-colors shadow-sm hover:shadow-md hover:shadow-green-200 dark:hover:shadow-green-900/40"
          onClick={() => navigate("/dashboard/addClients")}
        >
          <UserPlus size={16} />
          Add New Client
        </button>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-3 gap-5 mb-7">
        {STATS.map(({ icon: Icon, label, value, iconBg, iconColor }) => (
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
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">
              {label}
            </p>
            <p className="text-2xl font-bold text-slate-900 dark:text-white">
              {loading ? "—" : value}
            </p>
          </div>
        ))}
      </div>

      {/* Table card */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-gray-200 dark:border-slate-700 shadow-sm dark:shadow-black/30 transition-colors duration-300">
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
          
          </div>
        </div>

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
                <th className="text-right text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wide px-6 py-3">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td
                    colSpan={6}
                    className="text-center text-sm text-slate-400 dark:text-slate-500 py-12"
                  >
                    Loading clients...
                  </td>
                </tr>
              ) : error ? (
                <tr>
                  <td
                    colSpan={6}
                    className="text-center text-sm text-red-500 dark:text-red-400 py-12"
                  >
                    {error}
                  </td>
                </tr>
              ) : paginatedClients.length === 0 ? (
                <tr>
                  <td
                    colSpan={6}
                    className="text-center text-sm text-slate-400 dark:text-slate-500 py-12"
                  >
                    No clients found in this category.
                  </td>
                </tr>
              ) : (
                paginatedClients.map((client) => {
                  const id = client._id || client.id;
                  const isDeleting = deletingId === id;

                  return (
                    <tr
                      key={id}
                      className="border-b border-slate-100 dark:border-slate-800 last:border-b-0 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div
                            className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0"
                            style={{
                              backgroundColor: client.avatarColor || "#64748b",
                            }}
                          >
                            {client.initials ||
                              client.name?.slice(0, 2).toUpperCase()}
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
                        {client.industry || "—"}
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-300">
                        {client.projects ?? 0}
                      </td>
                      <td className="px-6 py-4 text-sm font-medium text-slate-800 dark:text-slate-100">
                        $
                        {(client.revenue || 0).toLocaleString(undefined, {
                          minimumFractionDigits: 2,
                        })}
                      </td>
                      <td className="px-6 py-4">
                        <StatusBadge status={client.status} />
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleEdit(client)}
                            title="Edit client"
                            className="w-8 h-8 flex items-center justify-center rounded-lg text-slate-500 dark:text-slate-400 hover:bg-blue-50 dark:hover:bg-blue-900/30 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                          >
                            <Pencil size={15} />
                          </button>
                          <button
                            onClick={() => requestDelete(client)}
                            disabled={isDeleting}
                            title="Delete client"
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
            Showing {paginatedClients.length === 0 ? 0 : startIndex + 1}–
            {Math.min(startIndex + ROWS_PER_PAGE, filteredClients.length)} of{" "}
            {filteredClients.length} clients
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

            {getPageNumbers().map((page) => (
              <button
                key={page}
                onClick={() => goToPage(page)}
                className={`w-8 h-8 flex items-center justify-center rounded-lg text-xs font-semibold transition-colors ${
                  page === safePage
                    ? "bg-green-500 text-white"
                    : "text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                }`}
              >
                {page}
              </button>
            ))}

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
        isOpen={!!clientToDelete}
        onClose={closeModal}
        onConfirm={confirmDelete}
        clientName={clientToDelete?.name}
        isDeleting={!!deletingId}
      />
    </div>
  );
};

export default Clients;
