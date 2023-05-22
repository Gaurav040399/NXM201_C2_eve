const express = require("express");
const { connection } = require("./database/db");
require("dotenv").config();


const app = express();
app.use(express.json());


app.use("/user",userRoute);
app.use("/product",productRoute);


app.listen(process.env.PORT || 3000, async()=>{
    console.log(`Server is running on port ${process.env.PORT}`)
    try {
        await connection 
        console.log("Connected to DB")
    } catch (err) {
        console.log(err.message)
        console.log("Cannot conneted to DB")
    }
})