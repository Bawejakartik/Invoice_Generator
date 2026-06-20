const PDFDocument = require("pdfkit");

const generateInvoicePDF = (invoice) => {

    return new Promise((resolve, reject) => {

        const doc = new PDFDocument({
            size: "A4",
            margin: 50
        });

        const chunks = [];

        doc.on("data", chunk => {
            chunks.push(chunk);
        });

        doc.on("end", () => {
            const pdfBuffer = Buffer.concat(chunks);
            resolve(pdfBuffer);
        });

        doc.on("error", reject);

        // HEADER
        doc.fontSize(28)
            .text("INVOICE", 50, 45, {
                align: "right"
            });

        doc.fontSize(14)
            .text("Invoice Generator", 50, 50);

        doc.fontSize(10)
            .text("Baweja Town", 50, 70);

        doc.moveDown(3);

        doc.fontSize(12);

        doc.text(`Invoice Number: ${invoice.invoiceNumber}`);

        doc.text(
            `Issue Date: ${new Date(
                invoice.issueDate
            ).toLocaleDateString()}`
        );

        doc.text(
            `Due Date: ${new Date(
                invoice.dueDate
            ).toLocaleDateString()}`
        );

        doc.moveDown();

        doc.fontSize(16).text("Bill To");

        doc.fontSize(12)
            .text(invoice.clientId.companyName);

        doc.text(invoice.clientId.name);

        doc.text(invoice.clientId.email);

        doc.text(invoice.clientId.address);

        doc.moveDown(2);

        invoice.items.forEach(item => {

            doc.text(
                `${item.description} | Qty: ${item.quantity} | Price: ₹${item.unitPrice} | Amount: ₹${item.amount}`
            );
        });

        doc.moveDown();

        doc.text(`Subtotal: ₹${invoice.subTotal}`);

        doc.text(`Tax: ${invoice.taxPercentage}%`);

        doc.text(`Discount: ₹${invoice.discount}`);

        doc.fontSize(14)
            .text(`Total: ₹${invoice.totalAmount}`);

        doc.moveDown();

        doc.text(
            `Notes: ${invoice.notes || "-"}`
        );

        doc.end();
    });
};

module.exports = generateInvoicePDF;