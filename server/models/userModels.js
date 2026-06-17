const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
    name:{
        type:String,
        requrie:true
    },
    email:{
        type:String,
        require:true,
        unique:true,
    },
    password:{
        type:String,
        require:true,
    }
},{timestamps:true});

const usermodel = mongoose.model('user',userSchema);

module.exports = usermodel; 
