const mongoose = require('mongoose');

const InvoiceSchema = mongoose.Schema({
      
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'user',
        required:true, 
    },
    clientId:{
        type: mongoose.Schema.Types.ObjectId ,
        ref:'client',
        required:true, 

    }, 
    invoiceNumber:{
        type:String,
        required:true, 
        unique:true, 
    },
    issueDate:{
        type:Date, 
        required:true, 
        default:Date.now, 
    },
      dueDate:{
         type:Date, 
         required:true
      },

    items:[{
        description:{
            type:String,
            requried:true, 

        },
        quantity :{
            type:Number, 
            required:true, 

        },
        unitPrice:{
            type:Number, 
            required:true, 

        },
        amount:{
            type:Number, 
            required:true, 

        }
    }],
    subTotal:{
        type:String, 
        required:true, 
    },
    taxPercentage:{
        type:Number,
        default:0,
    },
    discount:{
        type:Number, 
        required:true,
    },
totalAmount:{
    type:Number, 
    required:true, 


},
    status:{
        type:String,
           enum:['Draft',"Paid","Pending",'Overdue'],
           default:'Draft'
    },
    notes:{
        type:String, 
        
    }
    
})

const InvoiceModel = mongoose.model('Invoice',InvoiceSchema);

module.exports = InvoiceModel; 
