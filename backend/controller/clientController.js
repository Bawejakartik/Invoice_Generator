const express = require('express');

const Client = require('../models/clientModels')

exports.createClient = async(req,res) =>{
try{
    
     const {userId,name,companyName,email,phone,gstNumber,address} = req.body ; 

     if( !name || !companyName || !email || !gstNumber || !address ) {
        return res.status(400).json({
            success:false,
            message:"All fields are mandatory"
        })
     }

     const client = await Client.create({
        userId:req.id,
        name,
        companyName,
        email, 
        phone,
        gstNumber,
        address
     })

     res.status(200).json({
        message:"Client is created",
        client , 
        success:true ,
     })
}
catch(err){
    console.log(err);
    return res.status(500).json({
        message:"Server Side Error",
        success:false
    })
}
}


exports.getAllClient = async(req,res) =>{

    try{
        const clients = await Client.find({userId:req.id}).sort({createdAt:-1})
        return res.status(200).json({
            success:true,
            message:'All client for the user ',
            count:clients.length ,
            clients

        })
    }
    catch(err){
        console.log(err);
        return res.status(500).json({
            success:false,
            message:"server side error"
        })

    }
}

exports.getSingleClient = async(req,res)=>{
try{
     
    const client = await Client.findOne({
        _id:req.params.id,
        userId:req.id, 
    })

    if(!client){
        return res.status({
            success:false,
            message:"Client Not Found "
        })
    }
    return res.status(200).json({
        success:true,
        client
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


exports.updateClient = async(req,res) =>{
    try{
        const UpdateClient = await Client.findOneAndUpdate({
         _id:req.params.id, 
         userId:req.id,
        },
        req.body,
        {
            new:true,
           runValidators: true

        },
    )
        if(!UpdateClient){
            return res.status(400),json({
                success:false,
                message:"Client Not Found"
            })
        }
        return res.status(200).json({
            success:true,
            message:"Client Updated Successfully",
            client:UpdateClient
        })
    }
    catch(err){
        console.log(err);
        return res.status(500).json({
            success:false,
            message:"Server Side Error "
        })
    }
}

exports.deleteClient = async(req,res) =>{
    try{
        const deleteClient  = await  Client.findOneAndDelete({
            _id:req.params.id, 
            userId:req.id
        }) 

        if(!deleteClient) {
            return res.status(400).json({
                success:false, 
                message:"User Not Found"
            })
        }

        return res.status(200).json({
            success:true,
            message:"Delete the client successfully",
            client:deleteClient, 
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