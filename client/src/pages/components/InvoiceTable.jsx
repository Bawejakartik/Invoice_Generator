import StatusBadge from "./StatusBadge";

export default function InvoiceTable({
  invoices,
}) {
  return (
    <div className="bg-white rounded-xl shadow">
      <table className="w-full">
        <thead>
          <tr className="border-b">
            <th>Invoice</th>
            <th>Client</th>
            <th>Amount</th>
            <th>Status</th>
          </tr>
        </thead>

        <tbody>
          {invoices.map((invoice) => (
            <tr
              key={invoice._id}
              className="border-b"
            >
              <td>
                {invoice.invoiceNumber}
              </td>

              <td>
                {
                  invoice.clientId
                    ?.companyName
                }
              </td>

              <td>
                ₹
                {invoice.totalAmount}
              </td>

              <td>
                <StatusBadge
                  status={
                    invoice.status
                  }
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}