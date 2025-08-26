import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.models.js";
import uploadOnCloudinary from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const generateAccessandRefreshTokens=async(userId)=>{
  try {
    const user=await User.findById(userId)
    const accessToken =user.getAccessToken();
    const refreshToken = user.getRefreshToken();

    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });

    return{refreshToken,accessToken}


  } catch (error) {
    throw new ApiError(500, "Something went wrong while generating fresh and acceess token");
  }
}

const registerUser = asyncHandler(async (req, res) => {
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

  const { fullName, email, username, password } = req.body;
  console.log(email);

  // if(fullName==""){
  //     throw new ApiError(400, "Full Name is required");
  // }

  if (
    [fullName, email, username, password].some((field) => {
      field?.trim() === "";
    })
  ) {
    throw new ApiError(400, "All fields are required");
  }

  const existedUser = await User.findOne({
    $or: [{ username: username || null }, { email: email || null }],
  });

  if (existedUser) {
    throw new ApiError(409, "User already exists.");
  }

  const avatarLocalPath = req.files?.avatar[0]?.path;

  // const coverImageLocalPath = req.files?.coverImage[0]?.path;

  let coverImageLocalPath
  if(req.files && Array.isArray(req.files.coverImage) && req.files.coverImage.length > 0) {
    coverImageLocalPath = req.files.coverImage[0].path
  }
  

  if (!avatarLocalPath) {
    throw new ApiError(400, "Avatar is required");
  }

  const avatar = await uploadOnCloudinary(avatarLocalPath);
  const coverImage = await uploadOnCloudinary(coverImageLocalPath);

  if (!avatar) {
    throw new ApiError(400, "Avatar is required");
  }

  const user = await User.create({
    fullName,
    avatar: avatar.url,
    coverImage: coverImage?.url || "",
    email,
    password,
    username: username.toLowerCase(),
  });

  const createdUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );

  if (!createdUser) {
    throw new ApiError(501, "Something went wrong while registering the user");
  }

  return res
    .status(201)
    .json(new ApiResponse(200, createdUser, "User registered successfully"));
});

const loginUser= asyncHandler(async (req, res) => {
  // req.body ->data 
  //{email or username given}
  // find the user
  // password should be given
  // check the password
  // access and refresh tokens should be generated and given to the user
  // send them via cocokies
  // send response that login
  const{email,username,password}= req.body

  if(!(username || email)){
    throw new ApiError(400, "Username or Email is required");
  }

  const user = await User.findOne({
    $or:[{email},{username}]
  })

  if(!user){
    throw new ApiError(404, "User does not exist");
  }

  const isPasswordValid=await user.isPasswordCorrect(password)

  if (!isPasswordValid) {
    throw new ApiError(401, "Invalid User Credentials");
  }

  const {accessToken,refreshToken}=await generateAccessandRefreshTokens(user._id);

  const loggedInUser= await User.findById(user._id).select("-password -refreshToken");

  const options={
    httpOnly:true,
    secure:true,
  }

  return res
  .status(200)
  .cookie("accessToken", accessToken
    ,options)
  .cookie("refreshToken", refreshToken
    ,options)
  .json(
    new ApiResponse(200,{
      user: loggedInUser,accessToken,
      refreshToken
    },
    "User logged in successfully"
  )
  );


});

const logoutUser = asyncHandler(async (req,res)=>{
  // remove cookies
  // reset refresh token
  User.findByIdAndUpdate(req.user._id,
    {
      $set:{
        refreshToken:undefined
      }
    },
    {
      new: true
    }
    
    );
    
    const options={
    httpOnly:true,
    secure:true,
  }

  return res.status(200).
  clearCookie("accessToken",options).
  clearCookie("refreshToken",options).
  json(new ApiResponse(200,{},"User logged out successfully"));

})

export { registerUser , loginUser ,logoutUser};
