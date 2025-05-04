import dotenv from "dotenv";
import connectDB from "./db/index.js";

dotenv.config({path: './env'})                            //red devScript in package.json file


connectDB();











/*
     METHOD 1) DB IS CONNECTED IN INDEX FILE ITSELF, CAN BE DONE BUT NOT GOOD BCOZ IT POLLUTES OUR INDEX FILE A LITTLE SO WE WILL DO THE 
     ALTERNATE METHOD OF MAKING A SEPARATE FILE CONNECTING DATABASE THEN EXPORTING FROM THAT FILE AND IMPORT HERE
import express from "express";
const app = express()

( async () => {
    try {
        await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`)
        app.on("Error", (error) => {                    //database is connected but still it is showing certain error(app mei problem)
            console.log("ERROR:", error);
            throw error
        })


        app.listen(process.env.PORT, () => {
            console.log(`App is listening on port ${process.env.PORT}`);
        })


    } catch (error){
        console.error ("ERROR: ", error)
        throw error;
    }
})()
    */