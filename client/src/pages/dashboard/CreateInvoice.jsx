import { useState } from "react";

export default function CreateInvoice() {
  const [form, setForm] = useState({
    clientId: "",
    dueDate: "",
    taxPercentage: 18,
    discount: 0,
    notes: "",
    items: [
      {
        description: "",
        quantity: 1,
        unitPrice: 0,
      },
    ],
  });

  return (
    <div className="grid grid-cols-3 gap-6 p-6">
      <div className="col-span-2 bg-white p-6 rounded-xl">

        <h2 className="text-2xl font-bold mb-4">
          Create Invoice
        </h2>

        {/* Form Fields */}

      </div>

      <div className="bg-white rounded-xl p-6">
        Invoice Preview
      </div>
    </div>
  );
}