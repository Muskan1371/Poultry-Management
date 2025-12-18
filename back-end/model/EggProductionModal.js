



const mongoose = require("mongoose");


const EggProductionSchema = mongoose.Schema({
    batchflockid:String,
    total: Number,
    cracked: Number,
    doubleyolk: Number,
    dirty: Number,
    other: Number,
    staff: String,
    date: String,
    email:String
});




mongoose.model("eggproduction",EggProductionSchema);


module.exports = mongoose.model("eggproduction");
