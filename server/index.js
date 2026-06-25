const express = require("express");
const http = require("http");
const session = require("express-session");
const passport = require("./config/googleConfig.js");
const DashboardRoute = require("./Routes/DashboardRoutes");

require("dotenv").config();
const db = require("./config/db");
const cookieParser = require('cookie-parser');
const InvoiceRoute = require('./Routes/invoiceRoute');
const AuthRoute = require('./Routes/userRoute');
const ClientRoute = require('./Routes/clientRoutes');
const cors = require("cors");
PORT = process.env.PORT; 
const app = express();

app.use(
  cors({
    origin: "https://invoice-generator-five-coral.vercel.app", // your Vite dev server
    credentials: true, // needed if you ever use cookies; harmless if you only use Bearer tokens
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
  })
);
app.use(passport.initialize());
app.use(passport.session());

const server = http.createServer(app);


app.use('/api/v8',AuthRoute);
app.use('/api/v10',ClientRoute);
app.use('/api/v12',InvoiceRoute);
app.use("/api/v13", DashboardRoute);

server.listen(PORT , () => {
    db.connect();
    
    console.log("Server listen at the Port",PORT);

})



