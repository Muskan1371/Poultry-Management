const router = require("express").Router();
const user = require("../model/UserModel");
const { check, validationResult } = require("express-validator");
const bodyParser = require("body-parser");
const bcrypt = require("bcryptjs");

//middleware setup
router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: true }));


router.all("/", (request, response) => {
    response.setHeader('Content-Type', 'application/json');
    response.end(JSON.stringify({ "status": "User Controller Working.." }, null, 3));
});


router.post("/create",
    [
        check("username").not().isEmpty().trim().escape(),
        check("password").not().isEmpty().trim().escape(),
        check("email").isEmail().normalizeEmail()
    ],

    async (request, response) => {
        console.log(JSON.stringify(request.body, null, 3))

        response.setHeader("content-type", "application/json");

        const error = validationResult(request);

        if (!error.isEmpty()) {
            response.status(422).send(JSON.stringify({ status: false, message: "form validation error", error: error.array() }, null, 3));
        }
        else {

            const { username, email, password } = request.body;

            const existingUser = await user.findOne({ email: email });

            console.log(existingUser);

            if (existingUser) {
                return response.status(400).json({ message: "User already exist" });
            }

            user.create({ username: request.body.username, email: request.body.email, password: request.body.password })
                .then((result) => {


                    response.status(200).send(JSON.stringify({ status: true, message: "Insert Successfull", result: result }, null, 3));


                })
                .catch((error) => {
                    response.status(500).send(JSON.stringify({ status: false, message: "Insert Failed", error: error }, null, 3));
                })


        }
    }
);

router.get("/getall",

    async (req, res) => {
        try {

            const users_list = await user.find();

            // Return the properties in the response
            return res.status(200).json(users_list);
        } catch (error) {
            console.error('Error in fetching users:', error);
            // Handle exception or error
            return res.status(500).json({ message: 'Internal server error' });
        }
    })

router.post("/auth", async (request, response) => {
    const { email, password } = request.body;

    const userLogin = await user.findOne({ email, password });
    console.log(userLogin);

    if (userLogin) {

        response.status(200).send(JSON.stringify({ status: true, "message": "Successsfull", isLoggedIn: true, result: userLogin }, null, 3))
    }
    else {
        response.status(401).send(JSON.stringify({ status: false, isLoggedIn: false, result: null, "message": "Invalid Username or Password" }));
    }


});

router.get("/findone", (request, response) => {
    user.findOne({ email: request.query.email }, (error, result) => {
        if (error) {
            response.status(404).end(JSON.stringify({ status: false, message: "Failed to read database records", errors: error }, null, 3));
        }
        else {
            response.end(JSON.stringify({ status: true, message: "Read Successfull", result: result }, null, 3));
        }
    });
});


router.put("/update", (request, response) => {

    if (request.query.email) {
        user.updateOne(
            { email: request.body.email }, { username: request.body.username },
            (error, result) => {
                if (error) {
                    response.status(500).end(JSON.stringify({ status: false, message: "Failed to Update database records", errors: error }, null, 3));
                }
                else {
                    response.end(JSON.stringify({ status: true, message: "Update Successfull" }, null, 3));
                }
            });
    }
    else {
        response.status(400).end(JSON.stringify({ status: false, message: "Email Id not provided", errors: error }, null, 3));
    }
});

router.delete("/delete", (request, response) => {

    if (request.query.email) {
        user.remove(
            { email: request.body.email },
            (error, result) => {
                if (error) {
                    response.status(500).end(JSON.stringify({ status: false, message: "Failed to Delete database records", errors: error }, null, 3));
                }
                else {
                    response.end(JSON.stringify({ status: true, message: "Delete Successfull" }, null, 3));
                }
            });
    }
    else {
        response.status(400).end(JSON.stringify({ status: false, message: "Email Id not provided", errors: error }, null, 3));
    }
});

module.exports = router;