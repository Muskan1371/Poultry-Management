const router = require("express").Router();
const product = require("../model/ProductModal");
const { check, validationResult } = require("express-validator");
const bodyParser = require("body-parser");
const bcrypt = require("bcryptjs");
const stripe = require("stripe")(process.env.SECRET_KEY);


//middleware setup
router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: true }));


router.all("/", (request, response) => {
    response.setHeader('Content-Type', 'application/json');
    response.end(JSON.stringify({ "status": "Product Controller Working.." }, null, 3));
});


router.get("/getall",

    async (req, res) => {
        try {

            const product_list = await product.find();

            // Return the properties in the response
            return res.status(200).json(product_list);
        } catch (error) {
            console.error('Error in fetching properties:', error);
            // Handle exception or error
            return res.status(500).json({ message: 'Internal server error' });
        }
    })



router.get("/byemail", async (req, res) => {
    try {
        const email = req.body.email;

        // Query the database to find orders with the specified email
        const products = await product.find({ email: email });

        // Check if orders were found
        if (products.length > 0) {
            res.status(200).json(products);
        } else {
            res.status(404).json({ success: false, message: "No products found for the specified email." });
        }
    } catch (error) {
        // Handle errors
        console.error("Error retrieving orders:", error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
});

router.post("/create",


    async (request, response) => {
        console.log(JSON.stringify(request.body, null, 3))

        response.setHeader("content-type", "application/json");

        const error = validationResult(request);

        if (!error.isEmpty()) {
            response.status(422).send(JSON.stringify({ status: false, message: "form validation error", error: error.array() }, null, 3));
        }
        else {

            const { title, description, specification, material, cost, email } = request.body;




            product.create({ title: request.body.title, image: request.body.image, description: request.body.description, specification: request.body.specification, material: request.body.material, cost: request.body.cost, email: request.body.email })
                .then((result) => {


                    response.status(200).send(JSON.stringify({ status: true, message: "Insert Successfull", result: result }, null, 3));


                })
                .catch((error) => {
                    response.status(500).send(JSON.stringify({ status: false, message: "Insert Failed", error: error }, null, 3));
                })


        }
    }
);

router.post("/payment", async (req, res) => {



    const session = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        line_items: [{
            price_data: {
                currency: 'inr',
                product_data: {
                    name: 'Any Mock Product',
                },
                unit_amount: 2000,
            },
            quantity: 1,
        }],
        mode: "payment",
        success_url: "http://localhost:3000/success",
        cancel_url: "http://localhost:3000/cancel",
    })

    res.json({ id: session.id });

})




// router.get("/findone", (request, response) => {
//     user.findOne({ email: request.query.email }, (error, result) => {
//         if (error) {
//             response.status(404).end(JSON.stringify({ status: false, message: "Failed to read database records", errors: error }, null, 3));
//         }
//         else {
//             response.end(JSON.stringify({ status: true, message: "Read Successfull", result: result }, null, 3));
//         }
//     });
// });


// router.put("/update", (request, response) => {

//     if (request.query.email) {
//         user.updateOne(
//             { email: request.body.email }, { username: request.body.username },
//             (error, result) => {
//                 if (error) {
//                     response.status(500).end(JSON.stringify({ status: false, message: "Failed to Update database records", errors: error }, null, 3));
//                 }
//                 else {
//                     response.end(JSON.stringify({ status: true, message: "Update Successfull" }, null, 3));
//                 }
//             });
//     }
//     else {
//         response.status(400).end(JSON.stringify({ status: false, message: "Email Id not provided", errors: error }, null, 3));
//     }
// });

// router.delete("/delete", (request, response) => {

//     if (request.query.email) {
//         user.remove(
//             { email: request.body.email },
//             (error, result) => {
//                 if (error) {
//                     response.status(500).end(JSON.stringify({ status: false, message: "Failed to Delete database records", errors: error }, null, 3));
//                 }
//                 else {
//                     response.end(JSON.stringify({ status: true, message: "Delete Successfull" }, null, 3));
//                 }
//             });
//     }
//     else {
//         response.status(400).end(JSON.stringify({ status: false, message: "Email Id not provided", errors: error }, null, 3));
//     }
// });

module.exports = router;