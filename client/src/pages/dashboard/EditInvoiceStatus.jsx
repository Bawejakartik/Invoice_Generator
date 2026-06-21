// pages/Dashboard/EditInvoiceStatus.jsx

import  { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { ChevronRight, ArrowLeft, Save } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";

const STATUS_OPTIONS = [
  {
    value: "Draft",
    label: "Draft",
    description: "Not yet sent to client",
    dotColor: "bg-slate-400 dark:bg-slate-500",
    selectedBorder: "border-slate-400 dark:border-slate-500",
    selectedBg: "bg-slate-50 dark:bg-slate-800/60",
  },
  {
    value: "Pending",
    label: "Pending",
    description: "Awaiting client payment",
    dotColor: "bg-amber-400",
    selectedBorder: "border-amber-400",
    selectedBg: "bg-amber-50 dark:bg-amber-900/20",
  },
  {
    value: "Paid",
    label: "Paid",
    description: "Payment received in full",
    dotColor: "bg-green-500",
    selectedBorder: "border-green-500",
    selectedBg: "bg-green-50 dark:bg-green-900/20",
  },
  {
    value: "Overdue",
    label: "Overdue",
    description: "Past the due date",
    dotColor: "bg-red-500",
    selectedBorder: "border-red-500",
    selectedBg: "bg-red-50 dark:bg-red-900/20",
  },
];

const STATUS_BADGE = {
  Draft:   "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300",
  Pending: "bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400",
  Paid:    "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400",
  Overdue: "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400",
};

const EditInvoiceStatus = () => {
  const navigate = useNavigate();
  const { id } = useParams(); // invoice _id from route: /dashboard/invoices/:id/status

  const [invoice, setInvoice] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedStatus, setSelectedStatus] = useState(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchInvoice = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`/api/v12/getInvoice/${id}`, {
          withCredentials: true,
        });
        const inv = res.data.invoice;
        setInvoice(inv);
        setSelectedStatus(inv.status);
      } catch (err) {
        console.error(err);
        toast.error(err.response?.data?.message || "Failed to load invoice.");
      } finally {
        setLoading(false);
      }
    };

    fetchInvoice();
  }, [id]);

  const handleUpdate = async () => {
    if (!selectedStatus) {
      toast.error("Please select a status.");
      return;
    }
    if (selectedStatus === invoice?.status) {
      toast.info("Status is already set to " + selectedStatus);
      return;
    }

    try {
      setSaving(true);
      await axios.put(
        `/api/v12/status/${id}`,
        { status: selectedStatus },
        { withCredentials: true }
      );
      toast.success("Status updated successfully.");
      navigate("/dashboard/invoices");
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Failed to update status.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="p-8 flex items-center justify-center text-slate-400 dark:text-slate-500 text-sm">
        Loading invoice...
      </div>
    );
  }

  if (!invoice) {
    return (
      <div className="p-8 flex items-center justify-center text-red-500 text-sm">
        Invoice not found.
      </div>
    );
  }

  return (
    <div className="p-8">
      {/* Breadcrumb + header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <div className="flex items-center gap-1.5 text-sm text-slate-400 dark:text-slate-500 mb-2">
            <button
              onClick={() => navigate("/dashboard/invoices")}
              className="hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
            >
              Invoices
            </button>
            <ChevronRight size={14} />
            <span className="text-slate-500 dark:text-slate-400">
              #{invoice.invoiceNumber}
            </span>
            <ChevronRight size={14} />
            <span className="text-green-600 dark:text-green-400 font-medium">
              Update Status
            </span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
            Update Invoice Status
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Invoice #{invoice.invoiceNumber} · {invoice.client?.companyName || invoice.client?.name}
          </p>
        </div>
      </div>

      <div className="max-w-2xl space-y-5">
        {/* Invoice info card */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-gray-200 dark:border-slate-700 shadow-sm dark:shadow-black/30 p-6 transition-colors duration-300">
          <p className="text-sm font-semibold text-slate-800 dark:text-slate-100 mb-4">
            Current Invoice Info
          </p>

          <div className="grid grid-cols-2 gap-4 mb-5">
            <div>
              <p className="text-xs text-slate-400 dark:text-slate-500 mb-0.5">Client</p>
              <p className="text-sm font-medium text-slate-800 dark:text-slate-100">
                {invoice.client?.companyName || "—"} · {invoice.client?.name || "—"}
              </p>
            </div>
            <div>
              <p className="text-xs text-slate-400 dark:text-slate-500 mb-0.5">Current Status</p>
              <span
                className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full ${STATUS_BADGE[invoice.status]}`}
              >
                <span className="w-1.5 h-1.5 rounded-full bg-current opacity-70" />
                {invoice.status}
              </span>
            </div>
            <div>
              <p className="text-xs text-slate-400 dark:text-slate-500 mb-0.5">Issue Date</p>
              <p className="text-sm font-medium text-slate-800 dark:text-slate-100">
                {invoice.issueDate?.split("T")[0] || "—"}
              </p>
            </div>
            <div>
              <p className="text-xs text-slate-400 dark:text-slate-500 mb-0.5">Due Date</p>
              <p className="text-sm font-medium text-slate-800 dark:text-slate-100">
                {invoice.dueDate?.split("T")[0] || "—"}
              </p>
            </div>
          </div>

          <div className="border-t border-slate-100 dark:border-slate-800 pt-5">
            <p className="text-sm font-semibold text-slate-800 dark:text-slate-100 mb-3">
              Select New Status
            </p>
            <div className="grid grid-cols-2 gap-3">
              {STATUS_OPTIONS.map((opt) => {
                const isSelected = selectedStatus === opt.value;
                return (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => setSelectedStatus(opt.value)}
                    className={`flex items-center gap-3 text-left rounded-xl border-2 px-4 py-3.5 transition-all ${
                      isSelected
                        ? `${opt.selectedBorder} ${opt.selectedBg}`
                        : "border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700/60"
                    }`}
                  >
                    <span className={`w-2.5 h-2.5 rounded-full flex-shrink-0 ${opt.dotColor}`} />
                    <div>
                      <p className="text-sm font-semibold text-slate-800 dark:text-slate-100">
                        {opt.label}
                      </p>
                      <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">
                        {opt.description}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between">
          <button
            type="button"
            onClick={() => navigate("/dashboard/invoices")}
            className="flex items-center gap-2 text-sm font-semibold text-slate-600 dark:text-slate-300 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-5 py-2.5 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
          >
            <ArrowLeft size={15} />
            Cancel
          </button>

          <button
            type="button"
            onClick={handleUpdate}
            disabled={saving || selectedStatus === invoice.status}
            className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white text-sm font-semibold px-5 py-2.5 rounded-xl transition-colors shadow-sm hover:shadow-md hover:shadow-green-200 dark:hover:shadow-green-900/40 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Save size={15} />
            {saving ? "Updating..." : "Update Status"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditInvoiceStatus;