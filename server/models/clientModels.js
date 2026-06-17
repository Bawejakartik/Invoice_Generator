const mongoose = require("mongoose");
const clientSchema = mongoose.Schema({
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'user',
        required:true, 

    }, 
    name:{
        type:String, 
      required:true, 
    },
    email:{
        type:String,
        required:true,
        unique:true, 
    },
    phone:{
        type:Number, 
        required:true, 
        unique:true, 
    },
    gstNumber:{
        type:String,
        requied:true, 
        unique:true, 
    },
    address:{
        type:String, 
        required:true, 
        
    }
    
},{timeStamps:true})

const clientModel = mongoose.model('client',clientSchema);

module.exports = clientModel; 
