const express = require('express');
const User = require('../models/userModels');
const mongoose = require("mongoose");
const jwt = require('jsonwebtoken');
const bcrypt = require("bcrypt");
require('dotenv').config();
const {sendEmail} = require('../config/emailConfig');


exports.forgetPassword = async(req,res)=>{
     
    try{
         const {email}= req.body; 
      
         const user = await User.findOne({email});
      
         if(!user){
            return res.status(402).json({
                success:false, 
                message:"User mail is not registered "
            })
         }

    const otp = Math.floor(100000+Math.random()*900000).toString();
        const token = await jwt.sign({email,otp},process.env.SECRET_KEY,{expiresIn:'10m'});


        res.cookie('resetToken',token,{
            httpOnly:true,
            maxAge:15*60*1000
        })

        await sendEmail({to:email,subject:"password reset otp",otp})
        return res.status(200).json({
            success:true,
            message:"OTP is send to the registered Email ",
            token
        })
        }
    catch(err){
        console.log(err);
        return res.status(500).json({
            success:false,
            message:"Server side error"
        })

    }
}

exports.verifyOtp = async(req,res) =>{

    try{
        const {otp} = req.body; 
            
        if(!otp){
            return res.status(401).json({
                success:false,
                message:"Please enter the otp "
            })
        }
        const token = req.cookies.resetToken || req.header.authorization?.split(" ")[1]; 
    
        const decoded = jwt.verify(token,process.env.SECRET_KEY);
        if(decoded.otp != otp ){
            return res.status(402).json({
                success:false,
                message:"Invalid OTP"
            })
        }

        const resetToken = jwt.sign({email:decoded.email},process.env.SECRET_KEY,{expiresIn:'10m'})

        res.cookie('resetToken',resetToken,{httpOnly:true,
            maxAge:10*60*1000
        })

        return res.status(200).json({
            success:true,
            message:"Correct OTP"
        })

    }
    catch(err){
        console.log(err);
        return res.status(500).json({
            success:false, 
            message:"Server side error"
        })
    }
}

exports.resetPassword = async(req,res) =>{
    try{
        const {newpassword} = req.body; 
        const token = req.cookies.resetToken || req.header.authorization?.split(" ")[1];

        if(!token){
            return res.status(401).json({
                success:false, 
                message:"Unauthorized"
            })
        }

        const decoded = jwt.verify(token,process.env.SECRET_KEY);
        const user = await User.findOne({email:decoded.email});
        if(!user){
            return res.status(401).json({
                success:false,
                message:"User not found"
            })
        }
        const hashedPassword = await bcrypt.hash(newpassword,10);
        user.password = hashedPassword; 
        await user.save(); 

    res.clearCookie("resetToken");
    return res.status(200).json({
        success:true,
        message:"Password reset successfully"
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