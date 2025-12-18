const router = require("express").Router();
const Order = require("../model/OrderModal");
const { check, validationResult } = require("express-validator");
const bodyParser = require("body-parser");
const bcrypt = require("bcryptjs");
const stripe = require("stripe")(process.env.SECRET_KEY);


//middleware setup
router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: true }));


router.all("/", (request, response) => {
    response.setHeader('Content-Type', 'application/json');
    response.end(JSON.stringify({ "status": "order Controller Working.." }, null, 3));
});


router.get("/getall",

    async (req, res) => {
        try {

            const orders_list = await Order.find().populate('products');

            // Return the properties in the response
            return res.status(200).json(orders_list);
        } catch (error) {
            console.error('Error in fetching orders:', error);
            // Handle exception or error
            return res.status(500).json({ message: 'Internal server error' });
        }
    })

router.post("/byemail", async (req, res) => {
    try {

        const email = req.body.email;

        // Query the database to find orders with the specified email
        const orders = await Order.find({ email: email }).populate('products');

        // Check if orders were found
        if (orders.length > 0) {
            res.status(200).json(orders);
        } else {
            res.status(404).json({ success: false, message: "No orders found for the specified email." });
        }
    } catch (error) {
        // Handle errors
        console.error("Error retrieving orders:", error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
});

router.post("/createMany",
    async (request, response) => {
        try {
            const orders = request.body;

            // Process each order and save it to the database
            for (const orderData of orders) {
                const order = new Order(orderData);
                await order.save();
            }

            response.status(201).json({ message: "Orders created successfully" });
        } catch (error) {
            console.error(error);
            response.status(500).json({ message: "Internal Server Error" });
        }
    }
);


router.post("/create", async (req, res) => {
    try {
        // Extract order data from request body
        const { email, orderdate, total, products } = req.body;

        // Create a new order instance
        const newOrder = new Order({
            emailid,
            orderdate,
            total,
            products
        });

        // Save the order to the database
        await newOrder.save();

        // Respond with success message
        res.status(201).json({ message: "Order created successfully", order: newOrder });
    } catch (error) {
        console.error("Error in creating order:", error);
        // Handle error and respond with error message
        res.status(500).json({ message: "Internal Server Error" });
    }
});


router.delete("/delete/:id", async (request, response) => {
    console.log("body = ");
    console.log(request.params);

    try {
        let rec = await Order.findOne({ _id: request.params.id });
        if (!rec) {
            res.json("Store not found");
        }

        await Order.deleteOne({ _id: rec._id });

        response.json({ message: `deleted` });
    } catch (err) {
        response.status(400).json({ error: err });
    }
});


module.exports = router;