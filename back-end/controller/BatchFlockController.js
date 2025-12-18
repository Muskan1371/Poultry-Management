const router = require("express").Router();
const BatchFlock = require("../model/BatchFlockModal");
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

            const batch_flocks = await BatchFlock.find();

            // Return the properties in the response
            return res.status(200).json(batch_flocks);
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
        const batchflock_list = await BatchFlock.find({ email: email });

        // Check if orders were found
        if (batchflock_list.length > 0) {
            res.status(200).json(batchflock_list);
        } else {
            res.status(404).json({ success: false, message: "No Batch Flock records found for the specified email." });
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
            const batch_flocks = request.body;

            // Process each order and save it to the database
            for (const item of batch_flocks) {
                const bf = new BatchFlock(item);
                await bf.save();
            }

            response.status(201).json({ message: " Batch Flock created successfully" });
        } catch (error) {
            console.error(error);
            response.status(500).json({ message: "Internal Server Error" });
        }
    }
);


router.post("/create", async (req, res) => {
    try {
        // Extract order data from request body
        const { breedtype, total, date, expired, laying, batchno, email } = req.body;

        // Create a new order instance
        const bf = new BatchFlock({
            breedtype, total, date, expired, laying, batchno, email
        });

        // Save the order to the database
        await bf.save();

        // Respond with success message
        res.status(201).json({ message: "Batch Flock created successfully", batchFlock: bf });
    } catch (error) {
        console.error("Error in creating Batch Flock:", error);
        // Handle error and respond with error message
        res.status(500).json({ message: "Internal Server Error" });
    }
});

router.delete("/delete/:id", async (request, response) => {

    try {
        let rec = await BatchFlock.findOne({ _id: request.params.id });
        if (!rec) {
            response.json("Store not found");
        }
   
        await BatchFlock.deleteOne({ _id: rec._id });
    
        response.json({ message: `deleted` });
      } catch (err) {
        response.status(400).json({ error: err });
      }
});



module.exports = router;