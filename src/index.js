//require('dotenv').config({path: './env'})
import dotenv from "dotenv"
import connectDB from "./db/index.js"
dotenv.config({
    path:'/.env'
})

// import express from "express"

// const app=express()

// ;(async () => {
//     try {
//         await mongoose.connect(`${process.env.MONGODB_URI}`)
//         app.on("error",(error)=>{
//             console.log("ERROR:",error);
//             throw(error)
//         })

//         app.listen(pprocess.env.PORT,()=>{
//             console.log(`App is Listening on Port ${process.env.PORT}`);
            
//         })
//     } catch (error) {
//         console.error("ERROR",error)
//         throw err
//     }
// } )()

{/*....................2 nd approach................ */}
connectDB();

                                