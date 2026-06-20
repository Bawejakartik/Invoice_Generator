const express = require("express");
const http = require("http");
require("dotenv").config();
const db = require("./config/db");
const cookieParser = require('cookie-parser');
const InvoiceRoute = require('./Routes/invoiceRoute');
const AuthRoute = require('./Routes/userRoute');
const ClientRoute = require('./Routes/clientRoutes')
PORT = process.env.PORT; 
const app = express();
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
const server = http.createServer(app);
app.use('/api/v8',AuthRoute);
app.use('/api/v10',ClientRoute);
app.use('/api/v12',InvoiceRoute);

server.listen(PORT , () => {
    db.connect();
    
    console.log("Server listen at the Port",PORT);

})



