const express = require('express');
const route = express.Router();
const { signup, login,logout } = require('../controller/userController');
const isAuthenticated = require('../middleware/authMiddleware');
const { forgetPassword, verifyOtp, resetPassword } = require('../controller/forgetPasswordController');
route.post('/forgetPassword',forgetPassword);
route.post('/verify_otp',verifyOtp)
route.post('/setNewPassword',resetPassword);

route.post('/signup',signup);
route.post('/login',login);
route.post('/logout',logout); 
route.get('/test',isAuthenticated,(req,res) =>{
    res.status(200).json({
        success:true, 
        message:"middleware working",
        user :req.user
    })
})
module.exports = route; 

