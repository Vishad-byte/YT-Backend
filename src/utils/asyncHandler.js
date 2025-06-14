//              MIDDLEWARE WRAPPER FUNCTION

const asyncHandler = (requestHandler) => {
     return (req, res, next) => {
        Promise.resolve(requestHandler(req, res, next)).catch((err) => next(err))
    }
}

export {asyncHandler}

// const asyncHandler = () => {}
// const asyncHandler = (func) => {}
// const   = (func) => {() => {}}
// const asyncHandler = (func) => async() => {}

//CREATING A WRAPPER FUNCTION WHICH CAN BE USED ANYWHERE AND MAKE OUR WORK EASIER
                          
//T R Y   C A T C H   M E T H O D
// const asyncHandler = (fn) => async(req, res, next) => {
//     try {
//         fn(req, res, next)
//     } catch (error) {
//         res.status(err.code || 500).json({
//             success: false,
//             message: err.message
//         })
//     }
// }