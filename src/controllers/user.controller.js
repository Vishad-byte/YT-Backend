import { log } from "console";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const registerUser = asyncHandler( async (req, res) => {
    // Get user details from the frontend
    // validation - not empty
    // check if the user already exists - using username or email
    // check for images, check for avatar
    // upload images and avatar on cloudinary
    // create user object, create entry in db (MONGO DB USED SO NOSQL DATA WILL BE SENT WHICH IS MOSTLY IN THE FORM OF OBJECTS)
    // remove password and refresh token field from the response
    // check whether user is created or not
    // return the response

    const {username, fullName, email, password} = req.body;
    console.log("email:" , email);
    
    if (
        [username, fullName, email, password].some((field) => field?.trim() === "") 
    ) 
        {
            throw new ApiError(400, "All fields are required")
        }

    const existedUser = User.findOne({
        $or: [{ username }, { email }]          // can be used to check existence of either of the fields using OR
    })
    if(existedUser){
        throw new ApiError(409, "User with this username or email already exists")   //409 - error showed when the resource already exists ( Conflict )
    }
    
    const avatarLocalPath = req.files?.avatar[0]?.path;
    const coverImageLocalPath = req.files?.coverImage[0]?.path;

    if(!avatarLocalPath){
        throw new ApiError(400, "Avatar file is necessary")
    }

    const avatar = await uploadOnCloudinary(avatarLocalPath);
    const coverImage = await uploadOnCloudinary(coverImageLocalPath);

    if(!avatar){
        throw new ApiError(400, "Avatar file is necessary")
    }

    const user = await User.create({
        fullName,
        email,
        password,
        username : username.toLowerCase(),
        avatar: avatar.url,                 // we only want avatar url from cloudinary
        coverImage: coverImage?.url  || ""         // not checked the conditions earlier therefore checking here    
    })

    const createdUser = await User.findById(user._id).select("-password -refreshToken");    // to find user object and remove password and refresh token field 

    if(!createdUser){
        throw new ApiError (500, "Something went wrong while registering a user")
    }

    return res.status(201).json(
        new ApiResponse(200, createdUser, "User registered successfully")
    )
    
 })


export {registerUser}