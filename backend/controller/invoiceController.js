const express = require('express');
const Client = require("../models/clientModels");
const InvoiceModel = require('../models/InvoicesModels');
const pdfDocument  = require("pdfkit");
const { sendInvoiceEmail } = require("../config/emailConfig");
const generateInvoicePDF = require('../utils/generateInvoicePdf');


const transporter = require('../config/transporter');

exports.create_Invoice = async(req,res) =>{

    try{
       const {clientId,dueDate,items,taxPercentage,discount,notes} = req.body; 

    if(!clientId || !dueDate || !items || items.length == 0 ){
        return res.status(400).json({
            success:false, 
            message:"Please provide all the required field"
        })
    }
      const  client = await Client.findById(clientId);

      if(!client){
        return res.status(400).json({
            success:false,
            Message:"Client Not Found"
        })
      }
      const latestInvoice = await InvoiceModel.findOne().sort({createdAt:-1});
      let invoiceNumber; 
      console.log(latestInvoice)
      if(!latestInvoice){
        invoiceNumber= `INV-${new Date().getFullYear()}-001`;
        
      }
      else{
        const lastNumber = parseInt(
            latestInvoice.invoiceNumber.split("-")[2]

        )
         invoiceNumber = `INV-${new Date().getFullYear()}-${String(lastNumber + 1).padStart(3, '0')}`;
      }

      let subTotal =0 ; 

      const updatedItems = items.map(item =>{
         const amount = item.quantity*item.unitPrice;
         subTotal += amount; 

         return {
            ...item,amount
         }
      })

     const taxAmount = (subTotal * (taxPercentage || 0 )/100);

     const totalAmount = subTotal +taxAmount - (discount || 0 );

     const invoice = await InvoiceModel.create({
        userId:req.id, 
        clientId, 
        invoiceNumber, 
        IssueDate:Date.now(),
        dueDate, 
        items:updatedItems, 
        subTotal, 
        taxPercentage,
        discount, 
        totalAmount, 
        notes
     })

     return res.status(200).json({
        success:true,
        message:"Invoice created Successfully", 
        invoice ,
     })
}
    catch(err){
        console.log(err);
        return res.status(500).json({
            success:false,
            message:"Server Side Error"
        })
    }
}

exports.getAllInvoices = async(req,res) => {
   try{
        const invoices = await InvoiceModel.find({userId:req.id}).populate("clientId").sort({createdAt:-1});

        return res.status(201).json({
            success:true, 
            message:"All the generated Invoice",
            invoices
        })
   }catch(err){
    console.log(err);
    return res.status(500).json({
        success:false, 
        message:"Server Side Error"
    })
   }
}

exports.getSingleInvoice = async (req,res) =>{

  try{
       const invoice = await InvoiceModel.findOne({
         _id:req.params.id, 
         userId:req.id
     })

     if(!invoice){
        return res.status(400).json({
            success:false,
            message:"Invalid Invoice Id  "
        })
     }
     return res.status(200).json({
        success:true, 
        message:"Invoice Fetched Successfully",
        invoice
     })
  

  }
  catch(err){
    console.log(err);
    return res.status(500).json({
        success:false , 
        message:"Server Side Error"
    })
  }
     
}

exports.updateInvoice = async (req,res) =>{
       try{
        const invoice = await InvoiceModel.findOne({
            _id:req.params.id, 
            userId:req.id
        })

        if(!invoice){
            return res.status(400).json({
                success:false,
                message:"Invalid Invoice ID"
            })
        }

        const updateInvoice = await InvoiceModel.findByIdAndUpdate(
            req.params.id , 
            req.body,
            {new:true}
        )
return res.status(200).json({
    success:true, 
    message:"Invoice updated Successfully",
    updateInvoice
})
        }
       catch(err){
        console.log(err);
        return res.status(500).json({
            success:false,
            message:"Server Side Error"
        })
       }
}

exports.DeleteInvoice = async(req,res) =>{
     
    try{
       
        const invoice = await InvoiceModel.findOne({
            _id:req.params.id, 
            userId:req.id
        })
        if(!invoice) {
            return res.status(400).json({
                success:false, 
                message:"Invoice Not Found",
            })
        }

        await invoice.deleteOne();
        return res.status(200).json({
            success:true,
            message:"Invoice Deleted Successfully",
            
        })
    }
    catch(err){
        console.log(err);
        return res.status(500).json({
            success:false,
            message:"Server Side Error"
        })
    }
}


exports.updateStatus = async(req,res) =>{
    try{
         const {status} = req.body; 

         const invoice = await InvoiceModel.findOneAndUpdate({
            _id:req.params.id,
            userId:req.id,
         },{status} ,{new:true})

         return res.status(200).json({
            success:true, 
            message:"Status Updates Successfully",
            invoice
         })
      
         }
          catch(err){
        console.log(err);
        return res.status(500).json({
            success:false,
            message:"Server Side Error"
        })
    }
}



exports.downloadInvoice = async (req, res) => {
    try {

        const invoice = await InvoiceModel.findOne({
            _id: req.params.id,
            userId: req.id
        }).populate("clientId");

        if (!invoice) {
            return res.status(404).json({
                success: false,
                message: "Invoice not found"
            });
        }

        const doc = new pdfDocument({
            size: "A4",
            margin: 50
        });

        res.setHeader(
            "Content-Type",
            "application/pdf"
        );

        res.setHeader(
            "Content-Disposition",
            `attachment; filename=${invoice.invoiceNumber}.pdf`
        );

        doc.pipe(res);

        // HEADER
        doc
            .fontSize(28)
            .text("INVOICE", 50, 45, { align: "right" });

        doc
            .fontSize(14)
            .text("Invoice Generator", 50, 50);

        doc
            .fontSize(10)
            .text("Baweja Town ", 50, 70);

        // Invoice Info
        doc.moveDown(3);

        doc.fontSize(12);

        doc.text(
            `Invoice Number: ${invoice.invoiceNumber}`
        );

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

        // Client Details
        doc.moveDown();

        doc
            .fontSize(16)
            .text("Bill To");

        doc
            .fontSize(12)
            .text(invoice.clientId.companyName);

        doc.text(invoice.clientId.name);

        doc.text(invoice.clientId.email);

        doc.text(invoice.clientId.address);

        // Table Header
        doc.moveDown(2);

        const tableTop = doc.y;

        doc
            .font("Helvetica-Bold")
            .text("Description", 50, tableTop);

        doc.text("Qty", 300, tableTop);

        doc.text("Price", 370, tableTop);

        doc.text("Amount", 470, tableTop);

        doc.moveTo(50, tableTop + 20)
            .lineTo(550, tableTop + 20)
            .stroke();

        let y = tableTop + 35;

        invoice.items.forEach(item => {

            doc.font("Helvetica");

            doc.text(item.description, 50, y);

            doc.text(item.quantity, 300, y);

            doc.text(`₹${item.unitPrice}`, 370, y);

            doc.text(`₹${item.amount}`, 470, y);

            y += 30;
        });

        // Totals
        y += 30;

        doc.moveTo(300, y)
            .lineTo(550, y)
            .stroke();

        y += 20;

        doc.text(`Subtotal: ₹${invoice.subTotal}`, 350, y);

        y += 20;

        doc.text(
            `Tax (${invoice.taxPercentage}%): ₹${
                (invoice.subTotal *
                    invoice.taxPercentage) /
                100
            }`,
            350,
            y
        );

        y += 20;

        doc.text(
            `Discount: ₹${invoice.discount}`,
            350,
            y
        );

        y += 20;

        doc.font("Helvetica-Bold")
            .fontSize(14)
            .text(
                `Total: ₹${invoice.totalAmount}`,
                350,
                y
            );

        // Notes
        y += 60;

        doc.fontSize(12)
            .font("Helvetica")
            .text("Notes", 50, y);

        doc.text(invoice.notes || "-", 50, y + 20);

        // Footer
        doc.moveDown(5);

        doc.fontSize(10)
            .fillColor("gray")
            .text(
                "Thank you for your business!",
                50,
                760,
                {
                    align: "center"
                }
            );

        doc.end();

    } catch (error) {

        console.log(error);

        return res.status(500).json({
            success: false,
            message: "Server Error"
        });
    }
};


exports.sendInvoice = async(req,res) =>{
    try{
     const invoice = await InvoiceModel.findOne({
        _id:req.params.id,
        userId:req.id,
     }).populate("clientId");
      
     if(!invoice){
        return res.status(400).json({
            success:false,
            message:"Invalid Invoice Id"
        })
     }
    
      const pdfBuffer = await generateInvoicePDF(invoice);

     await sendInvoiceEmail({
        to:invoice.clientId.email, 
        clientName:invoice.clientId.name, 
        invoiceNumber:invoice.invoiceNumber,
        totalAmount:invoice.totalAmount, 
        pdfBuffer
     })

     return res.status(200).json({
        success:true, 
        message:"Invoice Sent Successfully"
     })

    }
    catch(err){
        console.log(err);
        return res.status(400).json({
            success:false,
            message:"Server Side Error"
        })
    }
}


exports.dashboardStats = async(req,res) =>{
    try{ 
        const totalInvoice = await InvoiceModel.countDocuments({
            userId:req.id
        })

        const paidInvoices = await InvoiceModel.countDocuments({
            userId:req.id,
            status:"Paid"
        })

        const pendingInvoice = await InvoiceModel.countDocuments({
            userId:req.id, 
            status:"Pending",
        })
        const draftInvoice = await InvoiceModel.countDocuments({
            userId:req.id, 
            status:"Draft"
        })
       const invoices = await InvoiceModel.find({
        userId:req.id
       })
        const totalRevenue = await invoices.reduce((acc,invoice) => acc+invoice.totalAmount,0 )

        return res.status(200).json({
            success:true,

            stats:{
                totalInvoice,
                paidInvoices,
                pendingInvoice, 
                draftInvoice, 
                totalRevenue
            }
        }); 


    }catch(err){
        console.log(err);
        return res.status(500).json({
            success:false,
            message:"Server Side Error"
        })
    }
}