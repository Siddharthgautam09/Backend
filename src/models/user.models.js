import mongoose ,{Schema} from "mongoose";
import jwt from "jsonwebtoken";   
import bcrypt from "bcryptjs";

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
    fullName:{
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

userSchema.methods.getAccessToken = function(){ // short duration expiry 
    return jwt.sign(
        {
            _id: this._id,
            username: this.username,
            email: this.email,
            fullName: this.fullName
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY || "1d"
        }
    );
}
userSchema.methods.getRefreshToken = function(){ // long duration expiry
   return jwt.sign(
        {
            _id: this._id,
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn: process.env.REFRESH_TOKEN_EXPIRY || "7d"
        }
    );
}

export const User = mongoose.model("User",userSchema)