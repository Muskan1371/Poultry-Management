



const mongoose = require("mongoose");


const BatchFlockSchema = mongoose.Schema({
    breedtype:String,
    total: Number,
    date: String,
    expired: String,
    laying: String,
    batchno: Number,
    email:String
});


mongoose.model("batchflocks",BatchFlockSchema);


module.exports = mongoose.model("batchflocks");
