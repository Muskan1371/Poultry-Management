const mongoose = require('mongoose');
const db_url = process.env.DB_URL;


console.log(mongoose.connection.readyState);

let connectMongoDb = () => {
    return new Promise((resolve, reject)=>{
            mongoose.connect(db_url, {useNewUrlParser:true,useUnifiedTopology: true});

            mongoose.connection
                .once("open", () => {
                    console.log("Connected");
                    const conn_status = mongoose.connection.readyState;
                    resolve(conn_status);                    
                })
                .on("error", (error) => {
                    console.log("Error :" + error);
                    reject("Mongo Db Connection Failed");
                });    
    });    
}

module.exports.connectMongoDb = connectMongoDb;