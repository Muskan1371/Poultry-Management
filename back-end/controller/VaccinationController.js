const router = require("express").Router();
const Vaccination = require("../model/VaccinationModal");
const { check, validationResult } = require("express-validator");
const bodyParser = require("body-parser");
const bcrypt = require("bcryptjs");
const stripe = require("stripe")(process.env.SECRET_KEY);


//middleware setup
router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: true }));


router.all("/", (request, response) => {
    response.setHeader('Content-Type', 'application/json');
    response.end(JSON.stringify({ "status": "vaccination Controller Working.." }, null, 3));
});


router.get("/getall",

    async (req, res) => {
        try {

            const vaccination = await Vaccination.find();

            // Return the properties in the response
            return res.status(200).json(vaccination);
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
        const vaccination_list = await Vaccination.find({ email: email });

        // Check if orders were found
        if (vaccination_list.length > 0) {
            res.status(200).json(vaccination_list);
        } else {
            res.status(404).json({ success: false, message: "No Vaccination Records found for the specified email." });
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
            const vaccination = request.body;

            // Process each order and save it to the database
            for (const item of vaccination) {
                const bf = new Vaccination(item);
                await bf.save();
            }

            response.status(201).json({ message: " Vaccination created successfully" });
        } catch (error) {
            console.error(error);
            response.status(500).json({ message: "Internal Server Error" });
        }
    }
);


router.post("/create", async (req, res) => {
    try {
        // Extract order data from request body
        const { batchflockid, vaccine, name, staff, date, reaction, other, email } = req.body;

        // Create a new order instance
        const v = new Vaccination({
            batchflockid, vaccine, name, staff, date, reaction, other, email
        });

        // Save the order to the database
        await v.save();

        // Respond with success message
        res.status(201).json({ message: "Vaccination created successfully", Vaccination: v });
    } catch (error) {
        console.error("Error in creating Vaccination:", error);
        // Handle error and respond with error message
        res.status(500).json({ message: "Internal Server Error" });
    }
});


router.delete("/delete", async (request, response) => {

    try {
        let rec = await Vaccination.findOne({ _id: request.body.id });
        if (!rec) {
            res.json("record not found");
        }

        await Vaccination.deleteOne({ _id: rec._id });

        response.json({ message: `deleted` });
    } catch (err) {
        response.status(400).json({ error: err });
    }
});


module.exports = router;