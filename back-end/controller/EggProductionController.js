const router = require("express").Router();
const EggProduction = require("../model/EggProductionModal");
const { check, validationResult } = require("express-validator");
const bodyParser = require("body-parser");
const bcrypt = require("bcryptjs");
const stripe = require("stripe")(process.env.SECRET_KEY);


//middleware setup
router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: true }));


router.all("/", (request, response) => {
    response.setHeader('Content-Type', 'application/json');
    response.end(JSON.stringify({ "status": "egg production Controller Working.." }, null, 3));
});


router.get("/getall",

    async (req, res) => {
        try {

            const egg_production = await EggProduction.find();

            // Return the properties in the response
            return res.status(200).json(egg_production);
        } catch (error) {
            console.error('Error in fetching orders:', error);
            // Handle exception or error
            return res.status(500).json({ message: 'Internal server error' });
        }
    })


router.get("/byemail", async (req, res) => {
    try {
        const email = req.body.email;

        // Query the database to find orders with the specified email
        const egg_list = await EggProduction.find({ email: email });

        // Check if orders were found
        if (egg_list.length > 0) {
            res.status(200).json(egg_list);
        } else {
            res.status(404).json({ success: false, message: "No Egg Production records found for the specified email." });
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
            const egg_production = request.body;

            // Process each order and save it to the database
            for (const item of egg_production) {
                const egg = new EggProduction(item);
                await egg.save();
            }

            response.status(201).json({ message: " Egg Production created successfully" });
        } catch (error) {
            console.error(error);
            response.status(500).json({ message: "Internal Server Error" });
        }
    }
);


router.post("/create", async (req, res) => {
    try {
        // Extract order data from request body
        const { batchflockid, total, cracked, doubleyolk, dirty, other, staff, date, email } = req.body;

        // Create a new order instance
        const egg = new EggProduction({
            batchflockid, total, cracked, doubleyolk, dirty, other, staff, date, email
        });

        // Save the order to the database
        await egg.save();

        // Respond with success message
        res.status(201).json({ message: "Egg Production created successfully", EggProduction: egg });
    } catch (error) {
        console.error("Error in creating Egg Production:", error);
        // Handle error and respond with error message
        res.status(500).json({ message: "Internal Server Error" });
    }
});


router.delete("/delete/:id", async (request, response) => {

    try {
        let rec = await EggProduction.findOne({ _id: request.params.id });
        if (!rec) {
            response.json("record not found");
        }

        await EggProduction.deleteOne({ _id: rec._id });

        response.json({ message: `deleted` });
    } catch (err) {
        response.status(400).json({ error: err });
    }
});


module.exports = router;