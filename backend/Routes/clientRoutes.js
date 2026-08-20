const express = require("express");
const route = express.Router();
const { createClient, getAllClient, getSingleClient, updateClient, deleteClient } = require('../controller/clientController');
const isAuthenticated = require("../middleware/authMiddleware");
route.post('/client',isAuthenticated,createClient);
route.get('/getAllClient',isAuthenticated,getAllClient);
route.get('/:id',isAuthenticated,getSingleClient);
route.post('/updatedClient/:id',isAuthenticated,updateClient);
route.delete('/delete/:id',isAuthenticated,deleteClient);

module.exports = route; 
