const express = require("express");
const route = express.Router();
const{ create_Invoice, getSingleInvoice, getAllInvoices, updateInvoice, DeleteInvoice, updateStatus, downloadInvoice, sendInvoice, dashboardStats } = require('../controller/invoiceController');
const isAuthenticated = require("../middleware/authMiddleware");


route.post("/invoice",isAuthenticated,create_Invoice);
route.get("/getInvoices",isAuthenticated,getAllInvoices)
route.get('/getInvoice/:id',isAuthenticated,getSingleInvoice);
route.put("/update/:id",isAuthenticated,updateInvoice);
route.delete('/delete/:id',isAuthenticated,DeleteInvoice);
route.put('/status/:id',isAuthenticated,updateStatus);
route.get('/invoice/:id/download',isAuthenticated,downloadInvoice);
route.post("/invoice/:id/sendEmail",isAuthenticated,sendInvoice);
route.get("/dashboard/stats",isAuthenticated,dashboardStats);

module.exports = route; 