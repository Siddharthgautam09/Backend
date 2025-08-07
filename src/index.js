//require('dotenv').config({path: './env'})
import dotenv from "dotenv"
import connectDB from "./db/index.js"
import mongoose from "mongoose"

dotenv.config({
    path:'./.env'
})

import express from "express"

const app=express()

// Middleware
app.use(express.json({limit: "16kb"}))
app.use(express.urlencoded({extended: true, limit: "16kb"}))
app.use(express.static("public"))

// Routes import
import userRouter from './routes/user.routes.js'

// Routes declaration
app.use("/api/v1/users", userRouter)

// ;(async () => {
//     try {
//         await mongoose.connect(`${process.env.MONGODB_URI}`)
//         app.on("error",(error)=>{
//             console.log("ERROR:",error);
//             throw(error)
//         })

//         app.listen(process.env.PORT,()=>{
//             console.log(`App is Listening on Port ${process.env.PORT}`);
            
//         })
//     } catch (error) {
//         console.error("ERROR",error)
//         throw error;
//     }
// } )()

// ....................2nd approach................
connectDB()
.then(()=>{
    
    app.on("error",(error) =>{
        console.log("ERROR!!!", error)
        throw(error)
    })
    app.listen(process.env.PORT || 8000, ()=>{
        console.log(`Server is running on Port: ${process.env.PORT}`)
    } )
})
.catch((error)=>{
    console.log("MONGODB connection failed !", error);
})
                                