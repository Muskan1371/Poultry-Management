

const mongoose = require("mongoose");


const ProductSchema = mongoose.Schema({
    image:String,
    title: String,
    description: String,
    specification: [{
      id: Number,
      value: String
    }],
    material: [{
      id: Number,
      value: String
    }],
    cost: Number,
    email: String
});


mongoose.model("products",ProductSchema);


module.exports = mongoose.model("products");
