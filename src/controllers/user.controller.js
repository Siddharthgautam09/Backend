import {asyncHandler} from '../utils/asyncHandler.js';


const registerUser = asyncHandler( async (req , res) => {
    // get user details from frontend
    // name, email, password , avatar, coverimage
    // validate the data - NOT empty, valid email, password length
    // CHECK if user already exists  - USERNAME, EMAIL
    // check for images
    // check for avatar
    // upload them to cloudinary
    // create user object - create entry in database
    // remove password and refresh token field from response
    // check for user creation success
    // return response to frontend

    const {fullName,email,username,password}= req.body 
    console.log(email)

})

export {
    registerUser,
};