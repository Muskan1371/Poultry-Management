



const mongoose = require("mongoose");


const VaccinationSchema = mongoose.Schema({
    batchflockid:String,
    vaccine: String,
    name: String,
    staff: String,
    date: String,
    reaction: String,
    other:String,
    email:String
});



mongoose.model("vaccination",VaccinationSchema);


module.exports = mongoose.model("vaccination");
