// pages/Dashboard/NewInvoice.jsx

import React, { useState, useEffect, useMemo } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import {
  ChevronRight,
  Check,
  Plus,
  Trash2,
  ArrowLeft,
  Save,
  Send,
  Search,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const STEPS = [
  { key: 1, label: "Client Details" },
  { key: 2, label: "Service Items" },
  { key: 3, label: "Review" },
];

const emptyItem = () => ({
  description: "",
  quantity: 1,
  unitPrice: 0,
});

const formatINR = (amount) =>
  `₹${(Number(amount) || 0).toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;

const todayISO = () => new Date().toISOString().split("T")[0];

const addDaysISO = (days) => {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d.toISOString().split("T")[0];
};

const NewInvoice = () => {
  const navigate = useNavigate();

  const [step, setStep] = useState(1);
  const [clients, setClients] = useState([]);
  const [loadingClients, setLoadingClients] = useState(true);
  const [clientSearch, setClientSearch] = useState("");
  const [showClientDropdown, setShowClientDropdown] = useState(false);

  const [selectedClient, setSelectedClient] = useState(null);
  const [issueDate, setIssueDate] = useState(todayISO());
  const [dueDate, setDueDate] = useState(addDaysISO(30));

  const [items, setItems] = useState([emptyItem()]);
  const [taxPercentage, setTaxPercentage] = useState(0);
  const [discount, setDiscount] = useState(0);
  const [notes, setNotes] = useState("");

  const [savingDraft, setSavingDraft] = useState(false);
  const [finalizing, setFinalizing] = useState(false);
  const [invoiceId, setInvoiceId] = useState(null); // set once a draft is saved
  const [invoiceNumber, setInvoiceNumber] = useState("New");

  // Fetch all clients up front so the dropdown works immediately
  useEffect(() => {
    const fetchClients = async () => {
      try {
        setLoadingClients(true);
        const res = await axios.get("/api/v10/getAllClient", {
          withCredentials: true,
        });
        setClients(res.data.clients || []);
      } catch (err) {
        console.error(err);
        toast.error(err.response?.data?.message || "Failed to load clients.");
      } finally {
        setLoadingClients(false);
      }
    };

    fetchClients();
  }, []);

  const filteredClients = useMemo(() => {
    if (!clientSearch.trim()) return clients;
    const q = clientSearch.toLowerCase();
    return clients.filter(
      (c) =>
        c.name?.toLowerCase().includes(q) ||
        c.companyName?.toLowerCase().includes(q) ||
        c.email?.toLowerCase().includes(q),
    );
  }, [clients, clientSearch]);

  const handleSelectClient = (client) => {
    setSelectedClient(client);
    setClientSearch(`${client.name} — ${client.companyName}`);
    setShowClientDropdown(false);
  };

  // Line items
  const updateItem = (index, field, value) => {
    setItems((prev) =>
      prev.map((item, i) => (i === index ? { ...item, [field]: value } : item)),
    );
  };

  const addItem = () => setItems((prev) => [...prev, emptyItem()]);

  const removeItem = (index) => {
    setItems((prev) =>
      prev.length === 1 ? prev : prev.filter((_, i) => i !== index),
    );
  };

  // Calculations
  const itemsWithAmount = items.map((item) => ({
    ...item,
    amount: (Number(item.quantity) || 0) * (Number(item.unitPrice) || 0),
  }));

  const subTotal = itemsWithAmount.reduce((sum, i) => sum + i.amount, 0);
  const taxAmount = (subTotal * (Number(taxPercentage) || 0)) / 100;
  const totalAmount = subTotal + taxAmount - (Number(discount) || 0);

  const buildPayload = (status) => ({
    clientId: selectedClient?._id,
    issueDate,
    dueDate,
    items: itemsWithAmount,
    taxPercentage: Number(taxPercentage) || 0,
    discount: Number(discount) || 0,
    notes,
    status,
  });

  const validateStep1 = () => {
    if (!selectedClient) {
      toast.error("Please select a client.");
      return false;
    }
    if (!issueDate || !dueDate) {
      toast.error("Please set both issue date and due date.");
      return false;
    }
    return true;
  };

  const validateStep2 = () => {
    const valid = itemsWithAmount.every(
      (i) => i.description.trim() && i.quantity > 0 && i.unitPrice >= 0,
    );
    if (!valid) {
      toast.error("Please fill in all service item fields.");
      return false;
    }
    return true;
  };

  const goNext = () => {
    if (step === 1 && !validateStep1()) return;
    if (step === 2 && !validateStep2()) return;
    setStep((s) => Math.min(3, s + 1));
  };

  const goBack = () => setStep((s) => Math.max(1, s - 1));

  // Save as Draft — creates if no invoice exists yet, otherwise updates the existing draft
  const handleSaveDraft = async () => {
    if (!validateStep1() || !validateStep2()) return;

    try {
      setSavingDraft(true);

      if (!invoiceId) {
        const res = await axios.post(
          "/api/v12/invoice",
          buildPayload("Draft"),
          { withCredentials: true },
        );
        setInvoiceId(res.data.invoice._id);
        setInvoiceNumber(res.data.invoice.invoiceNumber);
        toast.success("Saved as draft.");
      } else {
        const res = await axios.put(
          `/api/v12/update/${invoiceId}`,
          buildPayload("Draft"),
          { withCredentials: true },
        );
        setInvoiceNumber(
          res.data.updateInvoice?.invoiceNumber || invoiceNumber,
        );
        toast.success("Draft updated.");
      }
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Failed to save draft.");
    } finally {
      setSavingDraft(false);
    }
  };

  // Finalize & Send — creates/updates the invoice as Pending, then emails it
  const handleFinalizeAndSend = async () => {
    if (!validateStep1() || !validateStep2()) return;

    try {
      setFinalizing(true);
      let id = invoiceId;

      if (!id) {
        const res = await axios.post(
          "/api/v12/invoice",
          buildPayload("Pending"),
          { withCredentials: true },
        );
        id = res.data.invoice._id;
        setInvoiceId(id);
        setInvoiceNumber(res.data.invoice.invoiceNumber);
      } else {
        const res = await axios.put(
          `/api/v12/update/${id}`,
          buildPayload("Pending"),
          { withCredentials: true },
        );
        setInvoiceNumber(
          res.data.updateInvoice?.invoiceNumber || invoiceNumber,
        );
      }

      await axios.post(
        `/api/v12/invoice/${id}/sendEmail`,
        {},
        { withCredentials: true },
      );

      toast.success("Invoice finalized and sent to client.");
      navigate("/dashboard/invoices");
    } catch (err) {
      console.error(err);
      toast.error(
        err.response?.data?.message || "Failed to finalize and send invoice.",
      );
    } finally {
      setFinalizing(false);
    }
  };

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
            <span className="text-green-600 dark:text-green-400 font-medium">
              Create New
            </span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
            New Invoice
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Invoice ID #{invoiceNumber === "New" ? "—" : invoiceNumber}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleSaveDraft}
            disabled={savingDraft || finalizing}
            className="flex items-center gap-2 text-sm font-semibold text-slate-600 dark:text-slate-300 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-5 py-2.5 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Save size={15} />
            {savingDraft ? "Saving..." : "Save as Draft"}
          </button>
          <button
            onClick={handleFinalizeAndSend}
            disabled={savingDraft || finalizing}
            className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white text-sm font-semibold px-5 py-2.5 rounded-xl transition-colors shadow-sm hover:shadow-md hover:shadow-green-200 dark:hover:shadow-green-900/40 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            <Send size={15} />
            {finalizing ? "Sending..." : "Finalize & Send"}
          </button>
        </div>
      </div>

      {/* Step indicator */}
      <div className="flex items-center gap-3 mb-7">
        {STEPS.map((s, idx) => (
          <React.Fragment key={s.key}>
            <div className="flex items-center gap-2">
              <div
                className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${
                  step === s.key
                    ? "bg-green-600 text-white"
                    : step > s.key
                      ? "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400"
                      : "bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-500"
                }`}
              >
                {step > s.key ? <Check size={14} /> : s.key}
              </div>
              <span
                className={`text-sm font-medium ${
                  step === s.key
                    ? "text-slate-900 dark:text-white"
                    : "text-slate-400 dark:text-slate-500"
                }`}
              >
                {s.label}
              </span>
            </div>
            {idx < STEPS.length - 1 && (
              <div className="flex-1 h-px bg-slate-200 dark:bg-slate-700 max-w-16" />
            )}
          </React.Fragment>
        ))}
      </div>

      {/* Main two-column layout */}
      <div className="grid grid-cols-3 gap-6">
        {/* Left: form steps */}
        <div className="col-span-2 space-y-5">
          {step === 1 && (
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-gray-200 dark:border-slate-700 shadow-sm dark:shadow-black/30 p-6 transition-colors duration-300">
              <p className="text-sm font-semibold text-slate-800 dark:text-slate-100 mb-4">
                Client Details
              </p>

              <div className="relative mb-5">
                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1.5">
                  Select Client
                </label>
                <div className="relative">
                  <Search
                    size={15}
                    className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                  />
                  <input
                    type="text"
                    value={clientSearch}
                    onChange={(e) => {
                      setClientSearch(e.target.value);
                      setSelectedClient(null);
                      setShowClientDropdown(true);
                    }}
                    onFocus={() => setShowClientDropdown(true)}
                    placeholder={
                      loadingClients
                        ? "Loading clients..."
                        : "Search or select a client..."
                    }
                    disabled={loadingClients}
                    className="w-full text-sm text-slate-800 dark:text-slate-100 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl pl-10 pr-3.5 py-2.5 focus:outline-none focus:ring-2 focus:ring-green-500/50 focus:border-green-500 transition-colors disabled:opacity-60"
                  />
                </div>

                {showClientDropdown && !loadingClients && (
                  <div className="absolute z-10 mt-1.5 w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-lg max-h-64 overflow-y-auto">
                    {filteredClients.length === 0 ? (
                      <p className="text-sm text-slate-400 dark:text-slate-500 px-4 py-3">
                        No clients found.
                      </p>
                    ) : (
                      filteredClients.map((client) => (
                        <button
                          type="button"
                          key={client._id}
                          onClick={() => handleSelectClient(client)}
                          className="w-full text-left px-4 py-2.5 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors border-b border-slate-50 dark:border-slate-700/50 last:border-b-0"
                        >
                          <p className="text-sm font-medium text-slate-800 dark:text-slate-100">
                            {client.name}
                          </p>
                          <p className="text-xs text-slate-400 dark:text-slate-500">
                            {client.companyName} · {client.email}
                          </p>
                        </button>
                      ))
                    )}
                  </div>
                )}
              </div>

              {selectedClient && (
                <div className="grid grid-cols-2 gap-4 mb-5 p-4 bg-slate-50 dark:bg-slate-800/60 rounded-xl">
                  <div>
                    <p className="text-xs text-slate-400 dark:text-slate-500 mb-0.5">
                      Company
                    </p>
                    <p className="text-sm font-medium text-slate-800 dark:text-slate-100">
                      {selectedClient.companyName}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-400 dark:text-slate-500 mb-0.5">
                      Email
                    </p>
                    <p className="text-sm font-medium text-slate-800 dark:text-slate-100">
                      {selectedClient.email}
                    </p>
                  </div>
                  <div className="col-span-2">
                    <p className="text-xs text-slate-400 dark:text-slate-500 mb-0.5">
                      Address
                    </p>
                    <p className="text-sm font-medium text-slate-800 dark:text-slate-100">
                      {selectedClient.address}
                    </p>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1.5">
                    Issue Date
                  </label>
                  <input
                    type="date"
                    value={issueDate}
                    onChange={(e) => setIssueDate(e.target.value)}
                    className="w-full text-sm text-slate-800 dark:text-slate-100 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3.5 py-2.5 focus:outline-none focus:ring-2 focus:ring-green-500/50 focus:border-green-500 transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1.5">
                    Due Date
                  </label>
                  <input
                    type="date"
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                    className="w-full text-sm text-slate-800 dark:text-slate-100 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3.5 py-2.5 focus:outline-none focus:ring-2 focus:ring-green-500/50 focus:border-green-500 transition-colors"
                  />
                </div>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-gray-200 dark:border-slate-700 shadow-sm dark:shadow-black/30 p-6 transition-colors duration-300">
              <p className="text-sm font-semibold text-slate-800 dark:text-slate-100 mb-4">
                Service Items
              </p>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-slate-100 dark:border-slate-800">
                      <th className="text-left text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wide pb-2.5">
                        Description
                      </th>
                      <th className="text-left text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wide pb-2.5 w-20">
                        Qty
                      </th>
                      <th className="text-left text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wide pb-2.5 w-28">
                        Rate
                      </th>
                      <th className="text-right text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wide pb-2.5 w-28">
                        Amount
                      </th>
                      <th className="w-8"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {itemsWithAmount.map((item, index) => (
                      <tr
                        key={index}
                        className="border-b border-slate-50 dark:border-slate-800/60"
                      >
                        <td className="py-2.5 pr-3">
                          <input
                            type="text"
                            value={item.description}
                            onChange={(e) =>
                              updateItem(index, "description", e.target.value)
                            }
                            placeholder="e.g. UI/UX Design"
                            className="w-full text-sm text-slate-800 dark:text-slate-100 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500/50 focus:border-green-500 transition-colors"
                          />
                        </td>
                        <td className="py-2.5 pr-3">
                          <input
                            type="number"
                            min="0"
                            value={item.quantity}
                            onChange={(e) =>
                              updateItem(index, "quantity", e.target.value)
                            }
                            className="w-full text-sm text-slate-800 dark:text-slate-100 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500/50 focus:border-green-500 transition-colors"
                          />
                        </td>
                        <td className="py-2.5 pr-3">
                          <input
                            type="number"
                            min="0"
                            value={item.unitPrice}
                            onChange={(e) =>
                              updateItem(index, "unitPrice", e.target.value)
                            }
                            className="w-full text-sm text-slate-800 dark:text-slate-100 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500/50 focus:border-green-500 transition-colors"
                          />
                        </td>
                        <td className="py-2.5 pr-3 text-right text-sm font-semibold text-slate-800 dark:text-slate-100 whitespace-nowrap">
                          {formatINR(item.amount)}
                        </td>
                        <td className="py-2.5">
                          <button
                            type="button"
                            onClick={() => removeItem(index)}
                            disabled={itemsWithAmount.length === 1}
                            className="w-7 h-7 flex items-center justify-center rounded-lg text-slate-400 dark:text-slate-500 hover:bg-red-50 dark:hover:bg-red-900/30 hover:text-red-500 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                          >
                            <Trash2 size={14} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <button
                type="button"
                onClick={addItem}
                className="flex items-center gap-1.5 text-sm font-medium text-green-600 dark:text-green-400 hover:text-green-700 dark:hover:text-green-300 mt-3 transition-colors"
              >
                <Plus size={14} />
                Add Line Item
              </button>

              <div className="grid grid-cols-2 gap-4 mt-6 pt-5 border-t border-slate-100 dark:border-slate-800">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1.5">
                    Tax (%)
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={taxPercentage}
                    onChange={(e) => setTaxPercentage(e.target.value)}
                    className="w-full text-sm text-slate-800 dark:text-slate-100 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3.5 py-2.5 focus:outline-none focus:ring-2 focus:ring-green-500/50 focus:border-green-500 transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1.5">
                    Discount (₹)
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={discount}
                    onChange={(e) => setDiscount(e.target.value)}
                    className="w-full text-sm text-slate-800 dark:text-slate-100 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3.5 py-2.5 focus:outline-none focus:ring-2 focus:ring-green-500/50 focus:border-green-500 transition-colors"
                  />
                </div>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-5">
              <div className="bg-white dark:bg-slate-900 rounded-2xl border border-gray-200 dark:border-slate-700 shadow-sm dark:shadow-black/30 p-6 transition-colors duration-300">
                <p className="text-sm font-semibold text-slate-800 dark:text-slate-100 mb-3">
                  Client Details
                </p>
                <p className="text-sm font-semibold text-slate-800 dark:text-slate-100">
                  {selectedClient?.companyName}
                </p>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  {selectedClient?.name}
                </p>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  {selectedClient?.email}
                </p>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  {selectedClient?.address}
                </p>
              </div>

              <div className="bg-white dark:bg-slate-900 rounded-2xl border border-gray-200 dark:border-slate-700 shadow-sm dark:shadow-black/30 p-6 transition-colors duration-300">
                <p className="text-sm font-semibold text-slate-800 dark:text-slate-100 mb-3">
                  Service Items
                </p>
                <div className="divide-y divide-slate-50 dark:divide-slate-800/60">
                  {itemsWithAmount.map((item, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between py-2.5"
                    >
                      <div>
                        <p className="text-sm font-medium text-slate-800 dark:text-slate-100">
                          {item.description || "Untitled item"}
                        </p>
                        <p className="text-xs text-slate-400 dark:text-slate-500">
                          {item.quantity} × {formatINR(item.unitPrice)}
                        </p>
                      </div>
                      <p className="text-sm font-semibold text-slate-800 dark:text-slate-100">
                        {formatINR(item.amount)}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white dark:bg-slate-900 rounded-2xl border border-gray-200 dark:border-slate-700 shadow-sm dark:shadow-black/30 p-6 transition-colors duration-300">
                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1.5">
                  Notes / Terms
                </label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={3}
                  placeholder="Payment is due within 30 days. Late payments are subject to a 1.5% monthly interest charge."
                  className="w-full text-sm text-slate-800 dark:text-slate-100 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3.5 py-2.5 focus:outline-none focus:ring-2 focus:ring-green-500/50 focus:border-green-500 transition-colors resize-none"
                />
              </div>

              <div className="bg-white dark:bg-slate-900 rounded-2xl border border-gray-200 dark:border-slate-700 shadow-sm dark:shadow-black/30 p-6 transition-colors duration-300">
                <p className="text-sm font-semibold text-slate-800 dark:text-slate-100 mb-3">
                  Financial Summary
                </p>
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-500 dark:text-slate-400">
                      Subtotal
                    </span>
                    <span className="font-medium text-slate-800 dark:text-slate-100">
                      {formatINR(subTotal)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-500 dark:text-slate-400">
                      Discount
                    </span>
                    <span className="font-medium text-red-500">
                      −{formatINR(discount)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-500 dark:text-slate-400">
                      Tax ({Number(taxPercentage) || 0}%)
                    </span>
                    <span className="font-medium text-slate-800 dark:text-slate-100">
                      {formatINR(taxAmount)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-base pt-2 border-t border-slate-100 dark:border-slate-800">
                    <span className="font-semibold text-slate-800 dark:text-slate-100">
                      Total Due
                    </span>
                    <span className="font-bold text-green-600 dark:text-green-400">
                      {formatINR(totalAmount)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step navigation */}
          <div className="flex items-center justify-between">
            <button
              type="button"
              onClick={goBack}
              disabled={step === 1}
              className={`flex items-center gap-2 text-sm font-semibold px-5 py-2.5 rounded-xl border transition-colors ${
                step === 1
                  ? "text-slate-300 dark:text-slate-600 border-slate-100 dark:border-slate-800 cursor-not-allowed"
                  : "text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700"
              }`}
            >
              <ArrowLeft size={15} />
              Back
            </button>

            {step < 3 && (
              <button
                type="button"
                onClick={goNext}
                className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white text-sm font-semibold px-5 py-2.5 rounded-xl transition-colors shadow-sm hover:shadow-md hover:shadow-green-200 dark:hover:shadow-green-900/40"
              >
                Next: {STEPS[step]?.label}
                <ChevronRight size={15} />
              </button>
            )}
          </div>
        </div>

        {/* Right: live preview */}
        <div className="col-span-1">
          <div className="sticky top-6 bg-white dark:bg-slate-900 rounded-2xl border border-gray-200 dark:border-slate-700 shadow-sm dark:shadow-black/30 p-6 transition-colors duration-300">
            <p className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wide mb-4">
              Live Preview
            </p>

            <div className="flex items-center justify-between mb-5">
              <p className="text-lg font-extrabold text-slate-900 dark:text-white tracking-tight">
                FreelancIO
              </p>
              <p className="text-xs font-semibold text-slate-400 dark:text-slate-500">
                INVOICE
              </p>
            </div>

            <div className="flex items-center justify-between text-xs text-slate-400 dark:text-slate-500 mb-4">
              <span>#{invoiceNumber === "New" ? "—" : invoiceNumber}</span>
              <span>{issueDate || "—"}</span>
            </div>

            <div className="mb-4">
              <p className="text-xs text-slate-400 dark:text-slate-500 mb-0.5">
                Billed To
              </p>
              <p className="text-sm font-semibold text-slate-800 dark:text-slate-100">
                {selectedClient?.companyName || "No client selected"}
              </p>
              {selectedClient && (
                <p className="text-xs text-slate-400 dark:text-slate-500">
                  {selectedClient.address}
                </p>
              )}
            </div>

            <div className="border-t border-slate-100 dark:border-slate-800 pt-3 space-y-2">
              {itemsWithAmount
                .filter((i) => i.description.trim())
                .map((item, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between text-xs"
                  >
                    <span className="text-slate-600 dark:text-slate-300 truncate pr-2">
                      {item.description}
                    </span>
                    <span className="text-slate-700 dark:text-slate-200 font-medium whitespace-nowrap">
                      {formatINR(item.amount)}
                    </span>
                  </div>
                ))}
              {itemsWithAmount.every((i) => !i.description.trim()) && (
                <p className="text-xs text-slate-300 dark:text-slate-600 italic">
                  No items added yet
                </p>
              )}
            </div>

            <div className="border-t border-slate-100 dark:border-slate-800 mt-4 pt-3 space-y-1.5">
              <div className="flex items-center justify-between text-xs text-slate-400 dark:text-slate-500">
                <span>Subtotal</span>
                <span>{formatINR(subTotal)}</span>
              </div>
              <div className="flex items-center justify-between text-sm font-bold text-slate-900 dark:text-white pt-1">
                <span>Total Due</span>
                <span>{formatINR(totalAmount)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewInvoice;
