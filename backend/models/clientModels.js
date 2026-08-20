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
   companyName: {
          type:String,
          required:true,
          trim:true
     },
    email:{
        type:String,
        required:true,
        unique:true, 
    },
    phone:{
        type:String, 
        required:true, 
        unique:true, 
        trim:true, 
    },
    gstNumber:{
        type:String,
        required:true, 
        unique:true, 
    },
    address:{
        type:String, 
        required:true, 
        
    }
    
},{timestamps:true})

const clientModel = mongoose.model('client',clientSchema);

module.exports = clientModel; 
