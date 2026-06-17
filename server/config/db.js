require("dotenv").config();

const mongoose = require("mongoose");
const MONGODB_URL=process.env.MONGODB_URL; 
exports.connect = () =>{
     
    mongoose.connect(MONGODB_URL)
    .then(() => {
        console.log("Database Connected Successfully");
    })
    .catch((err) =>{
        console.log(err);
        console.log("Database is not connected")
    })
}