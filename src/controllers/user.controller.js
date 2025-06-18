import { log } from "console";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const registerUser = asyncHandler( async (req , res) => {
    /* 
    1.Take inputs from user
    2.Check all fields not empty
    3.Check if user already exists
    4.File upload
    5.Create user in db
    6.Remove password and refresh token from response
    7.Check if user successfully created or not
    */

    const {fullName , username , email , password } = req.body
    // console.log("email : " , email);
    if(
        [fullName , username , email , password].some((field) => field?.trim() === "")
    ){
        throw new ApiError(400 , "All fields should be non empty")
    }

    const existedUser = await User.findOne({
        $or : [ {username} , {email} ] 
    })
    if(existedUser){
        throw new ApiError(409 , "User with the same username or email already exists")
    }

    const avatarLocalPath = req.files?.avatar[0]?.path
    let coverImageLocalPath;
    if(req.files && Array.isArray(req.files.coverImage) && req.files.coverImage.length > 0){
        coverImageLocalPath = req.files.coverImage[0].path                       // checks for the presence for cover image
    }

    if(!avatarLocalPath){
        throw new ApiError(400 , "Avatar file is compulsary")
    }
    
    const avatar = await uploadOnCloudinary(avatarLocalPath)
    let coverImage = ""
    if(coverImageLocalPath)
    coverImage = await uploadOnCloudinary(coverImageLocalPath)

    if(!avatar){
        throw new ApiError(400 , "Avatar file not uploaded properly")
    }

    const user = await User.create({
        fullName ,
        avatar : avatar.url ,
        coverImage : coverImage?.url || "",
        email,
        password,
        username : username.toLowerCase()
    })

    const createdUser = await User.findById(user._id).select(
        "-password -refreshToken"
    )
    if(!createdUser) {
        throw new ApiError(500 , "Internal Server Error :: Could not register user")
    }
    
    return res.status(201).json(
        new ApiResponse(201 , createdUser , "User registered Successfully")
    )

} )

const loginUser = asyncHandler(async (req, res) => {
    /*
    1. get login details from the user (req body)
    2. check if the details entered match the user data in the DB which was earlier registered(username or email)
    3. find the user
    4. if user present then password check
    5. generate access and refresh token
    6. send them in cookies
    */

    const {email, username, password} = req.body
    if( !username || !email ){
        throw new ApiError(400, "either of username or email is required")
    }

    await User.findOne({
        $or: [{ username }, { email }]            // can be logged in by using either of them
    })
})


export {
    registerUser,
    loginUser
}