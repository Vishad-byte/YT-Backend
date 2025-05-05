import dotenv from "dotenv";
import connectDB from "./db/index.js";
import app from "./app.js";
dotenv.config({path: './env'})                            //read devScript in package.json file



connectDB()                                                 //will return a promise
.then( () => {
    app.listen(process.env.PORT || 8000, () => {
        console.log(`Server is running on port ${process.env.PORT}`)});
        app.on("Error", (err) => {
            console.error("Express application error:", err)
        })
})
.catch( (err) => {
    console.error("MOngo db connection failed", err);
})











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