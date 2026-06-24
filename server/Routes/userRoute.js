const express = require('express');
const passport = require("passport");

const jwt  = require("jsonwebtoken"); 

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
        user :req.id, 

    })
})

route.get(
  "/auth/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
  })
);

route.get(
  "/auth/google/callback",

  passport.authenticate("google", {
    failureRedirect: "/login",
  }),
  async(req, res) =>{
     const token = jwt.sign({
      id:req.user._id, 

     },
    process.env.SECRET_KEY,{expiresIn:'7d'})
  

  res.cookie("token",token,
    {httpOnly:true, 
    sameSite:'lax',
    secure:false,

  })
   res.redirect("http://localhost:5173/dashboard")
}
)



module.exports = route; 

