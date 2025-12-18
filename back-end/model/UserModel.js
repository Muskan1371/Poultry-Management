const mongoose = require("mongoose");


const userSchema = mongoose.Schema({
    username:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true
    },
    usertype:{
        type:String,
        required:true,
        default:"customer"        
    },
    isActive:{
        type:Boolean,
        default:false
    },
    createdOn:{
        type:Date,
        default:Date.now()
    }
});

mongoose.model("users",userSchema);



module.exports = mongoose.model("users");