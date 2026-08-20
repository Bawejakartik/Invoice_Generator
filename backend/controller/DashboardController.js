// controller/dashboardController.js

const Invoice = require("../models/InvoicesModels");

exports.getDashboardSummary = async (req, res) => {
  try {
    const userId = req.id;

    const now = new Date();
    const startOfThisMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const endOfLastMonth = new Date(
      now.getFullYear(),
      now.getMonth(),
      0,
      23,
      59,
      59,
    );

    // FIXED: populate clientId so we can read client.name later,
    // and use the REAL field names from the schema: totalAmount,
    // issueDate (not amount/date, which don't exist on this model).
    const allInvoices = await Invoice.find({ userId }).populate(
      "clientId",
      "name",
    );

    // ---- KPI Cards ----
    const totalInvoices = allInvoices.length;

    const totalRevenue = allInvoices.reduce(
      (sum, inv) => sum + (inv.totalAmount || 0),
      0,
    );

    // NOTE: your schema's status enum includes "Draft" in addition to
    // Paid/Pending/Overdue. Draft invoices are excluded from the
    // Paid/Pending/Overdue buckets below but ARE included in
    // totalInvoices and totalRevenue. Adjust this if you want Drafts
    // excluded from revenue too.
    const paidInvoices = allInvoices.filter((inv) => inv.status === "Paid");
    const pendingInvoices = allInvoices.filter(
      (inv) => inv.status === "Pending",
    );
    const overdueInvoices = allInvoices.filter(
      (inv) => inv.status === "Overdue",
    );
    const draftInvoices = allInvoices.filter((inv) => inv.status === "Draft");

    const totalPaid = paidInvoices.reduce(
      (sum, inv) => sum + (inv.totalAmount || 0),
      0,
    );
    const totalPending = pendingInvoices.reduce(
      (sum, inv) => sum + (inv.totalAmount || 0),
      0,
    );
    const totalOverdue = overdueInvoices.reduce(
      (sum, inv) => sum + (inv.totalAmount || 0),
      0,
    );

    // Invoices created this month vs last month — using issueDate
    const invoicesThisMonth = allInvoices.filter(
      (inv) => new Date(inv.issueDate) >= startOfThisMonth,
    ).length;
    const invoicesLastMonth = allInvoices.filter(
      (inv) =>
        new Date(inv.issueDate) >= startOfLastMonth &&
        new Date(inv.issueDate) <= endOfLastMonth,
    ).length;
    const invoiceDeltaFromLastMonth = invoicesThisMonth - invoicesLastMonth;

    // Revenue this month vs last month — using issueDate + totalAmount
    const revenueThisMonth = allInvoices
      .filter((inv) => new Date(inv.issueDate) >= startOfThisMonth)
      .reduce((sum, inv) => sum + (inv.totalAmount || 0), 0);
    const revenueLastMonth = allInvoices
      .filter(
        (inv) =>
          new Date(inv.issueDate) >= startOfLastMonth &&
          new Date(inv.issueDate) <= endOfLastMonth,
      )
      .reduce((sum, inv) => sum + (inv.totalAmount || 0), 0);

    const revenueGrowthPercent =
      revenueLastMonth > 0
        ? ((revenueThisMonth - revenueLastMonth) / revenueLastMonth) * 100
        : revenueThisMonth > 0
          ? 100
          : 0;

    // Avg payout days — your schema has no separate "paidDate" field,
    // so this can't be computed yet. Returns null until you add one
    // (e.g. set paidDate when status flips to "Paid").
    const avgPayoutDays = null;

    // ---- Monthly Revenue Trend ----
    const monthLabels = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];
    const currentYear = now.getFullYear();
    const previousYear = currentYear - 1;

    const buildMonthlySeries = (year) => {
      const series = new Array(12).fill(0);
      allInvoices.forEach((inv) => {
        const d = new Date(inv.issueDate);
        if (d.getFullYear() === year) {
          series[d.getMonth()] += inv.totalAmount || 0;
        }
      });
      return series;
    };

    const currentYearSeries = buildMonthlySeries(currentYear);
    const previousYearSeries = buildMonthlySeries(previousYear);

    const monthlyRevenueTrend = monthLabels.map((label, i) => ({
      month: label,
      current: i <= now.getMonth() ? currentYearSeries[i] : null,
      previous: previousYearSeries[i],
    }));

    // ---- Invoice Status Distribution ----
    // Including Draft as a 4th slice since your schema supports it.
    // Remove this block if you only want Paid/Pending/Overdue shown.
    const invoiceStatusDistribution = [
      {
        status: "Paid",
        count: paidInvoices.length,
        percent:
          totalInvoices > 0
            ? Math.round((paidInvoices.length / totalInvoices) * 100)
            : 0,
      },
      {
        status: "Pending",
        count: pendingInvoices.length,
        percent:
          totalInvoices > 0
            ? Math.round((pendingInvoices.length / totalInvoices) * 100)
            : 0,
      },
      {
        status: "Overdue",
        count: overdueInvoices.length,
        percent:
          totalInvoices > 0
            ? Math.round((overdueInvoices.length / totalInvoices) * 100)
            : 0,
      },
    ];

    // ---- Revenue by Client (Top 5) ----
    const revenueByClientMap = {};
    allInvoices.forEach((inv) => {
      const clientName = inv.clientId?.name || "Unknown Client";
      revenueByClientMap[clientName] =
        (revenueByClientMap[clientName] || 0) + (inv.totalAmount || 0);
    });

    const revenueByClient = Object.entries(revenueByClientMap)
      .map(([name, revenue]) => ({ name, revenue }))
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 5);

    const maxClientRevenue =
      revenueByClient.length > 0 ? revenueByClient[0].revenue : 1;
    const revenueByClientWithPercent = revenueByClient.map((c) => ({
      ...c,
      percentOfMax: Math.round((c.revenue / maxClientRevenue) * 100),
    }));

    // ---- Recent Invoices (latest 5, by issueDate) ----
    const recentInvoices = [...allInvoices]
      .sort((a, b) => new Date(b.issueDate) - new Date(a.issueDate))
      .slice(0, 5)
      .map((inv) => ({
        id: inv._id,
        invoiceNumber: inv.invoiceNumber,
        clientName: inv.clientId?.name || "Unknown Client",
        date: inv.issueDate,
        amount: inv.totalAmount,
        status: inv.status,
      }));

    return res.status(200).json({
      success: true,
      message: "Dashboard summary fetched successfully",
      data: {
        kpis: {
          totalInvoices,
          invoiceDeltaFromLastMonth,
          totalRevenue,
          revenueGrowthPercent: Math.round(revenueGrowthPercent * 10) / 10,
          totalPaid,
          paidPercentOfRevenue:
            totalRevenue > 0 ? Math.round((totalPaid / totalRevenue) * 100) : 0,
          avgPayoutDays,
          totalPending,
          pendingPercentOfRevenue:
            totalRevenue > 0
              ? Math.round((totalPending / totalRevenue) * 100)
              : 0,
          totalOverdue,
        },
        monthlyRevenueTrend,
        invoiceStatusDistribution,
        revenueByClient: revenueByClientWithPercent,
        recentInvoices,
      },
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      success: false,
      message: "Server side error while fetching dashboard summary",
    });
  }
};
