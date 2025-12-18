



const mongoose = require("mongoose");


const BreedSchema = mongoose.Schema({
    title:String,
    email:String
});


mongoose.model("breeds",BreedSchema);


module.exports = mongoose.model("breeds");
