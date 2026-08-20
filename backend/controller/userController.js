const express = require("express");
const bcrypt = require("bcrypt");
const User = require('../models/userModels');
const jwt = require("jsonwebtoken");

exports.signup = async(req,res) =>{

    try{
         const {name,email,password} = req.body;

     if(!name || !email || !password) {
        return res.status(402).json({
            success:false,
            message:"All the Fields are required"
        })
     }
     const existingUser =await  User.findOne({email});
     if(existingUser){
        return res.status(402).json({
            success:false,
            message:"User Already exists",
        })

     }
     const hashedPassword = await bcrypt.hash(password,10);

     const user = await User.create({
        name , 
        email  , 
        password:hashedPassword
     })

       return  res.status(200).json({
        success:true,
        message:"User Created Successfully",
        user, 
        
     })
    }
    catch(err){
        console.log(err);
        return res.status(500).json({
            message:"Server side error",
            success:false
        })
    }
      
}

exports.login = async(req,res) =>{

    try{
        const {email,password} = req.body;

    if(!email || !password) {
        return res.status(401).json({
            success:false,
            message:"All the Fields are required"
        })
    }
    let user  = await User.findOne({email});

    if(!user.password) {
        return res.status(400).json({
            success:false,
            message:"This account uses Google login . Please continue with google  "
        })
    }
    if(!user){
        return res.status(401).json({
            success:false, 
            message:"User not Signed up firstly Signup "
        })
    }

        const payload = {
            id:user._id, 
        }
        if(await bcrypt.compare(password,user.password)){
              const accessToken = jwt.sign(payload,process.env.SECRET_KEY,{expiresIn:'7d'})

            

            const option = {
                expiresIn:new Date(Date.now()+2*24*60*60*1000),
                httpOnly:true,
              }
           res.cookie("token",accessToken,{
         httpOnly: true,
  sameSite: 'none',
  secure: true,
           })

          
              res.status(200).json({
                success:true,
                message:"User Logged in successfully "
              })
        }
        else{
            return res.status(400).json({
                success:false,
                message:"User Password not Matched"
            })
        }
    }
    
    catch(err){
        console.log(err);
        return res.status(500).json({
            success:false, 
            message:"Server Side error"
        })
    }
}

exports.logout= (req,res) =>{
    try{
const option = {
        expiresIn:0    }

        return res.status(200).cookie('token','',option).json({
            success:true, 
            message:"User Logout successfully",
        })
    }
    catch(err){
        console.log(err);
        return res.status(500).json({
            success:false,
            message:"Server Side Error",
        })
    }
}