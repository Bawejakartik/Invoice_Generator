const Card = ({ title, value }) => (
  <div className="bg-white rounded-xl shadow p-5">
    <h3 className="text-gray-500 text-sm">
      {title}
    </h3>

    <p className="text-2xl font-bold mt-2">
      {value}
    </p>
  </div>
);

export default function DashboardStats({
  stats,
}) {
  return (
    <div className="grid grid-cols-5 gap-4">
      <Card
        title="Total Invoices"
        value={stats.totalInvoice}
      />

      <Card
        title="Paid"
        value={stats.paidInvoices}
      />

      <Card
        title="Pending"
        value={stats.pendingInvoice}
      />

      <Card
        title="Draft"
        value={stats.draftInvoice}
      />

      <Card
        title="Revenue"
        value={`₹${stats.totalRevenue}`}
      />
    </div>
  );
}