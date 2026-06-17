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
    items:[],
    total:{
        type:String, 
        required:true, 

    },
    status:{
        type:String,
           enum:['Draft',"Sent","Paid","Pending",'Overdue','Cancelled'],
           default:'Draft'
    }
    
})

const InvoiceModel = mongoose.model('Invoice',InvoiceSchema);

module.exports = InvoiceModel; 
