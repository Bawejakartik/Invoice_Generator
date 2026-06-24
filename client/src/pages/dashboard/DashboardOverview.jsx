// pages/Dashboard/DashboardOverview.jsx

import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import {
  FileText,
  TrendingUp,
  CheckCircle,
  Clock,
  Calendar,
  Download,
  Plus,
  ArrowUpRight,
  AlertTriangle,
} from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
} from "recharts";

const STATUS_COLORS = {
  Paid: "#22c55e",
  Pending: "#f59e0b",
  Overdue: "#ef4444",
};

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

const DashboardOverview = () => {
  const navigate = useNavigate();
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await axios.get(
          "https://invoice-generator-z035.onrender.com/api/v13/dashboard-summary",
          { withCredentials: true },
        );

        setSummary(response.data.data);
      } catch (err) {
        console.error(err);
        setError(
          err.response?.data?.message || "Failed to load dashboard data.",
        );
        toast.error(
          err.response?.data?.message || "Failed to load dashboard data.",
        );
      } finally {
        setLoading(false);
      }
    };

    fetchSummary();
  }, []);

  const formatCurrency = (amount) =>
    `$${(amount || 0).toLocaleString(undefined, { minimumFractionDigits: 0 })}`;

  if (loading) {
    return (
      <div className="p-8">
        <p className="text-sm text-slate-400 dark:text-slate-500">
          Loading dashboard...
        </p>
      </div>
    );
  }

  if (error || !summary) {
    return (
      <div className="p-8">
        <p className="text-sm text-red-500 dark:text-red-400">
          {error || "No data available."}
        </p>
      </div>
    );
  }

  const {
    kpis,
    monthlyRevenueTrend,
    invoiceStatusDistribution,
    revenueByClient,
    recentInvoices,
  } = summary;

  const pieData = invoiceStatusDistribution.map((s) => ({
    name: s.status,
    value: s.count,
  }));

  return (
    <div className="p-8">
      {/* Greeting header */}
      <div className="flex items-start justify-between mb-7">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
            Good Morning, Alex
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Here's what's happening with your finances today.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-1.5 text-sm font-medium text-slate-600 dark:text-slate-300 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-3.5 py-2 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors">
            <Calendar size={14} />
            Last 30 Days
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-4 gap-5 mb-6">
        {/* Total Invoices */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-gray-200 dark:border-slate-700 shadow-sm dark:shadow-black/30 p-5 transition-colors duration-300">
          <div className="flex items-center justify-between mb-4">
            <div className="w-9 h-9 rounded-xl bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
              <FileText
                size={17}
                className="text-green-700 dark:text-green-400"
              />
            </div>
            <span className="text-xs font-semibold text-green-700 dark:text-green-400 bg-green-50 dark:bg-green-900/30 px-2 py-0.5 rounded-full">
              Active
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mb-1 uppercase tracking-wide font-semibold">
            Total Invoices
          </p>
          <p className="text-2xl font-bold text-slate-900 dark:text-white mb-1">
            {kpis.totalInvoices}
          </p>
          <p className="text-xs text-green-600 dark:text-green-400 flex items-center gap-1">
            <ArrowUpRight size={12} />
            {kpis.invoiceDeltaFromLastMonth >= 0 ? "+" : ""}
            {kpis.invoiceDeltaFromLastMonth} from last month
          </p>
        </div>

        {/* Total Revenue */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-gray-200 dark:border-slate-700 shadow-sm dark:shadow-black/30 p-5 transition-colors duration-300">
          <div className="flex items-center justify-between mb-4">
            <div className="w-9 h-9 rounded-xl bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
              <TrendingUp
                size={17}
                className="text-blue-700 dark:text-blue-400"
              />
            </div>
            <span className="text-xs font-semibold text-green-700 dark:text-green-400 bg-green-50 dark:bg-green-900/30 px-2 py-0.5 rounded-full">
              +{kpis.revenueGrowthPercent}%
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mb-1 uppercase tracking-wide font-semibold">
            Total Revenue
          </p>
          <p className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
            {formatCurrency(kpis.totalRevenue)}
          </p>
          <div className="w-full h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-blue-500 rounded-full"
              style={{
                width: `${Math.min(kpis.revenueGrowthPercent + 50, 100)}%`,
              }}
            />
          </div>
        </div>

        {/* Total Paid */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-gray-200 dark:border-slate-700 shadow-sm dark:shadow-black/30 p-5 transition-colors duration-300">
          <div className="flex items-center justify-between mb-4">
            <div className="w-9 h-9 rounded-xl bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center">
              <CheckCircle
                size={17}
                className="text-indigo-700 dark:text-indigo-400"
              />
            </div>
            <span className="text-xs font-semibold text-slate-400 dark:text-slate-500">
              {kpis.paidPercentOfRevenue}%
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mb-1 uppercase tracking-wide font-semibold">
            Total Paid
          </p>
          <p className="text-2xl font-bold text-slate-900 dark:text-white mb-1">
            {formatCurrency(kpis.totalPaid)}
          </p>
          <p className="text-xs text-slate-400 dark:text-slate-500">
            {kpis.avgPayoutDays != null
              ? `Avg payout ${kpis.avgPayoutDays} days`
              : "No payout data yet"}
          </p>
        </div>

        {/* Total Pending */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-gray-200 dark:border-slate-700 shadow-sm dark:shadow-black/30 p-5 transition-colors duration-300">
          <div className="flex items-center justify-between mb-4">
            <div className="w-9 h-9 rounded-xl bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
              <Clock size={17} className="text-amber-700 dark:text-amber-400" />
            </div>
            <span className="text-xs font-semibold text-slate-400 dark:text-slate-500">
              {kpis.pendingPercentOfRevenue}%
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mb-1 uppercase tracking-wide font-semibold">
            Total Pending
          </p>
          <p className="text-2xl font-bold text-slate-900 dark:text-white mb-1">
            {formatCurrency(kpis.totalPending)}
          </p>
          <p className="text-xs text-red-500 dark:text-red-400 flex items-center gap-1">
            <AlertTriangle size={12} />
            {formatCurrency(kpis.totalOverdue)} overdue
          </p>
        </div>
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-3 gap-5 mb-6">
        {/* Monthly Revenue Trend - Line Chart */}
        <div className="col-span-2 bg-white dark:bg-slate-900 rounded-2xl border border-gray-200 dark:border-slate-700 shadow-sm dark:shadow-black/30 p-6 transition-colors duration-300">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold text-slate-800 dark:text-white">
              Monthly Revenue Trend
            </h3>
            <div className="flex items-center gap-4 text-xs text-slate-500 dark:text-slate-400">
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-green-500" /> Current
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-slate-300 dark:bg-slate-600" />{" "}
                Previous
              </span>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={monthlyRevenueTrend}>
              <CartesianGrid
                strokeDasharray="3 3"
                vertical={false}
                stroke="#e2e8f0"
              />
              <XAxis
                dataKey="month"
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 11, fill: "#94a3b8" }}
              />
              <YAxis hide />
              <Tooltip
                formatter={(value) => formatCurrency(value)}
                contentStyle={{
                  borderRadius: 8,
                  fontSize: 12,
                  border: "1px solid #e2e8f0",
                }}
              />
              <Line
                type="monotone"
                dataKey="current"
                stroke="#22c55e"
                strokeWidth={2.5}
                dot={false}
                connectNulls
              />
              <Line
                type="monotone"
                dataKey="previous"
                stroke="#cbd5e1"
                strokeWidth={2}
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Invoice Status - Donut Chart */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-gray-200 dark:border-slate-700 shadow-sm dark:shadow-black/30 p-6 transition-colors duration-300">
          <h3 className="text-sm font-bold text-slate-800 dark:text-white mb-4">
            Invoice Status
          </h3>
          <div
            className="relative flex items-center justify-center"
            style={{ height: 140 }}
          >
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  dataKey="value"
                  innerRadius={45}
                  outerRadius={62}
                  paddingAngle={3}
                  stroke="none"
                >
                  {pieData.map((entry) => (
                    <Cell key={entry.name} fill={STATUS_COLORS[entry.name]} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <p className="text-xl font-bold text-slate-900 dark:text-white">
                {kpis.totalInvoices}
              </p>
              <p className="text-[10px] text-slate-400 dark:text-slate-500">
                Total
              </p>
            </div>
          </div>
          <div className="flex flex-col gap-2 mt-3">
            {invoiceStatusDistribution.map((s) => (
              <div
                key={s.status}
                className="flex items-center justify-between text-xs"
              >
                <span className="flex items-center gap-1.5 text-slate-600 dark:text-slate-300">
                  <span
                    className="w-2 h-2 rounded-full"
                    style={{ backgroundColor: STATUS_COLORS[s.status] }}
                  />
                  {s.status}
                </span>
                <span className="text-slate-400 dark:text-slate-500">
                  {s.count} ({s.percent}%)
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Revenue by Client */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-gray-200 dark:border-slate-700 shadow-sm dark:shadow-black/30 p-6 mb-6 transition-colors duration-300">
        <h3 className="text-sm font-bold text-slate-800 dark:text-white mb-5">
          Revenue by Client (Top 5)
        </h3>
        <div className="flex flex-col gap-4">
          {revenueByClient.map((client) => (
            <div key={client.name}>
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-sm font-medium text-slate-700 dark:text-slate-200">
                  {client.name}
                </span>
                <span className="text-sm font-semibold text-slate-800 dark:text-slate-100">
                  {formatCurrency(client.revenue)}
                </span>
              </div>
              <div className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-green-500 rounded-full transition-all duration-500"
                  style={{ width: `${client.percentOfMax}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Invoices */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-gray-200 dark:border-slate-700 shadow-sm dark:shadow-black/30 transition-colors duration-300">
        <div className="flex items-center justify-between px-6 pt-5 pb-4">
          <div>
            <h3 className="text-sm font-bold text-slate-800 dark:text-white">
              Recent Invoices
            </h3>
            <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">
              Overview of the latest billing cycles.
            </p>
          </div>
          <button
            onClick={() => navigate("/dashboard/invoices")}
            className="text-xs font-semibold text-green-700 dark:text-green-400 hover:text-green-500 transition-colors"
          >
            View All Invoices
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
                  Date
                </th>
                <th className="text-left text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wide px-6 py-3">
                  Amount
                </th>
                <th className="text-left text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wide px-6 py-3">
                  Status
                </th>
              </tr>
            </thead>
            <tbody>
              {recentInvoices.length === 0 ? (
                <tr>
                  <td
                    colSpan={5}
                    className="text-center text-sm text-slate-400 dark:text-slate-500 py-10"
                  >
                    No invoices yet.
                  </td>
                </tr>
              ) : (
                recentInvoices.map((inv) => (
                  <tr
                    key={inv.id}
                    className="border-b border-slate-100 dark:border-slate-800 last:border-b-0 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
                  >
                    <td className="px-6 py-3.5 text-sm font-medium text-slate-700 dark:text-slate-200">
                      {inv.invoiceNumber}
                    </td>
                    <td className="px-6 py-3.5 text-sm text-slate-600 dark:text-slate-300">
                      {inv.clientName}
                    </td>
                    <td className="px-6 py-3.5 text-sm text-slate-500 dark:text-slate-400">
                      {new Date(inv.date).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </td>
                    <td className="px-6 py-3.5 text-sm font-medium text-slate-800 dark:text-slate-100">
                      {formatCurrency(inv.amount)}
                    </td>
                    <td className="px-6 py-3.5">
                      <StatusBadge status={inv.status} />
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Floating create invoice button */}
      <button
        onClick={() => navigate("/dashboard/invoices/new")}
        className="fixed bottom-8 right-8 flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white text-sm font-semibold px-5 py-3 rounded-full shadow-lg hover:shadow-xl transition-all"
      >
        <Plus size={16} />
        Create Invoice
      </button>
    </div>
  );
};

export default DashboardOverview;
