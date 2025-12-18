const express = require("express");
require("dotenv").config();
const database = require("./config/database"); 
const userController = require("./controller/UserController");
const productController = require("./controller/ProductController");
const orderController = require("./controller/OrderController");
const batchFlockController = require("./controller/BatchFlockController");
const eggProductionController = require("./controller/EggProductionController");
const vaccinationController = require("./controller/VaccinationController");
const breedController = require("./controller/BreedController");


const cors = require("cors")

const app=express();
const port=process.env.PORT;

let middleware = (request, response, next)=>{
    database.connectMongoDb().then((arg)=>{
        console.log('Connection Status : ' + arg);
    }).catch((error)=>{
        console.log(error);
    });      
    
    next();
}

app.use(middleware);
app.use(cors());

app.use("/api/user",userController);
app.use("/api/product", productController)
app.use("/api/orders", orderController);
app.use("/api/batchflock", batchFlockController);
app.use("/api/eggproduction", eggProductionController);
app.use("/api/vaccination", vaccinationController);
app.use("/api/breed",breedController);

app.all("/",function(request, response){
    response.setHeader('Content-Type', 'application/json');
    response.end(JSON.stringify({"status":"Poultry Farm Project Welcomes You."},null,3));      
});


app.listen(port, ()=>{console.log(`Server running on port number ${port}`)});

/*
    Connection Status
    0   -   disconnected
    1   -   connected
    2   -   connecting
    3   -   disconnecting
*/

