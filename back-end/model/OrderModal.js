const mongoose = require("mongoose");

const OrderSchema = mongoose.Schema({
    email: String,
    orderdate: String,
    total: Number,
    products: [{ type: mongoose.Schema.Types.ObjectId, ref: 'products' }]
});

module.exports = mongoose.model("orders", OrderSchema);