import { useEffect, useState } from "react";
import axios from "axios";
import InvoiceTable from "../../components/InvoiceTable";

export default function Invoices() {
  const [invoices, setInvoices] =
    useState([]);

  useEffect(() => {
    getInvoices();
  }, []);

  const getInvoices = async () => {
    try {
      const { data } = await axios.get(
        "/api/v8/invoice",
        {
          withCredentials: true,
        }
      );

      setInvoices(data.invoices);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">
        Invoices
      </h1>

      <InvoiceTable
        invoices={invoices}
      />
    </div>
  );
} 