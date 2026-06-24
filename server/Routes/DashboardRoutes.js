// Routes/dashboardRoutes.js

const express = require("express");
const route = express.Router();
const { getDashboardSummary } = require("../controller/dashboardController");
const isAuthenticated = require("../middleware/authMiddleware");

route.get("/dashboard-summary", isAuthenticated, getDashboardSummary);

module.exports = route;
