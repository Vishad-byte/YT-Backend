import { log } from "console";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import jwt from "jsonwebtoken";
import { response } from "express";

const generateAccessAndRefreshToken = async(userId) => {
    try {
        const user = await User.findById(userId)
        const accessToken = await user.generateAccessToken()
        const refreshToken = await user.generateRefreshToken()          //access token given to the user and refresh token is saved in  database so that there is no need for the user to login again and again

        user.refreshToken = refreshToken                                //saved in DB
        await user.save({ validateBeforeSave: false })                  //to save only this parameter in the model and not validate other required parameters of the model like password
        return { accessToken, refreshToken }

    } catch (error) {
        throw new ApiError (500, "Something went wrong while generating refresh and access token")
    }
}

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
    if( !username && !email ){
        throw new ApiError(400, "either of username or email is required")
    }

    const user = await User.findOne({
        $or: [{ username }, { email }]            // can be logged in by using either of them
    })

    if(!user){
        throw new ApiError(404, "User does not exist")
    }

    const isPasswordValid = await user.isPasswordCorrect(password)

    if(!isPasswordValid){
        throw new ApiError(401, "Invalid user credentials")
    }
    const {accessToken, refreshToken}= await generateAccessAndRefreshToken(user._id)

    const loggedInUser = await User.findById(user._id).select("-password -refreshToken")

    const options = {
        httpOnly: true,
        secure: true                        // can be changed only through the server
    }

    return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
        new ApiResponse(
            200,
            {
                user: loggedInUser, accessToken, refreshToken
            },
            "User logged in successfully"
        )
    )
})

const logoutUser = asyncHandler(async(req, res) => {
    await User.findByIdAndUpdate(
        req.user._id,                                       //got req.user from auth middleware
        {
            $set: {
                refreshToken: undefined                     //removing refresh token from the user for logout
            }
        },
        {
            new: true                 //show true value
        }
    )

    const options = {
        httpOnly: true,
        secure: true                        // can be changed only through the server
    }
    return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new ApiResponse(200, {}, "User logged out"))
    
})

const refreshAccessToken = asyncHandler(async(req, res) => {
    const incomingRefreshToken = req.cookies.refreshToken || req.body.refreshToken

    if(!incomingRefreshToken){
        throw new ApiError(401, "Unauthorized request")
    }

    try {
        const decodedToken = jwt.verify(incomingRefreshToken, process.env.REFRESH_TOKEN_SECRET)
    
        const user = await User.findById(decodedToken?._id)
    
        if(!user){
            throw new ApiError(401, "Invalid refresh token")
        }
    
        IdleDeadline(incomingRefreshToken !== user?.refreshToken){
            throw new ApiError(401, "Refresh token is expired or used")
        }
    
        const options = {
            httpOnly: true,
            secure: true
        }
    
        const {accessToken, newRefreshToken} = await generateAccessAndRefreshToken(user._id)
    
        return res
        .status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", newRefreshToken, options)
        .json(
            new ApiResponse(
                200, 
                {
                    accessToken, refreshToken: newRefreshToken
                },
                "Access token refreshed successfully"
            )
        )
    } catch (error) {
        throw new ApiError(401, error?.message || "Invalid refresh token")
    }
})

const changeCurrentPassword = asyncHandler(async(req, res) => {
    const {oldPassword, newPassword} = req.body

    const user = await User.findById(req.user?._id)

    const isPasswordCorrect = await user.isPasswordCorrect(oldPassword)

    if(!isPasswordCorrect){
        throw new ApiError(400, "Invalid old password")

        user.password = new.password
        await user.save({validateBeforeSave: false})

        return res
        .status(200)
        .json(new ApiResponse(200, {}, "Password changed successfully"))
    }
})

export {
    registerUser,
    loginUser,
    logoutUser,
    refreshAccessToken
    
}