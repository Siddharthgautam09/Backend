import mongoose ,{Schema} from "mongoose";
import jwt from "jsonwebtoken";   
import bcrypt from "bcryptjs";
import { use } from "react";

const userSchema = new Schema({
    username:{
        type:String,
        required:true,
        unique:true,
        lowercase:true,
        trim:true,
        index:true
    },
    email:{
        type:String,
        required:true,
        unique:true,
        lowercase:true,
        trim:true,
    },
    fullname:{
        type:String,
        required:true,
        unique:true,
        trim:true,
        index:true
    },
    avatar:{
        type:String, // cloudinary url
        required:true,
    },
    coverimage:{
        type:String, // cloudinary url
    },
    watchHistory:[{
        type: Schema.Types.ObjectId,
        ref:"Video"
    }],
    password:{
        type: String,
        required: [true, "Password is required"],
    },
    refreshToken:{
        type: String
    }
},
{
    timestamps : true
});

// complex alogorithm is used to generate token so async function is used

userSchema.pre("save", async function(next){
    if (!this.isModified("password")) return next();
    // hashing the password
    // bcryptjs is used to hash the password
    this.password = await bcrypt.hash(this.password, 10);
    next()
})

userSchema.methods.isPasswordCorrect = async function(password){
    return await bcrypt.compare(password, this.password);
}



export const User = mongoose.model("User",userSchema)