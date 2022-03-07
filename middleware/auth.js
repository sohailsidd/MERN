const jwt = require("jsonwebtoken");
const ErrorHandler = require("../utils/errorHandle");
const catchAsyncError = require("./catchAsyncError");
const User = require("../models/userModel");

module.exports.isAuthenticatedUser = catchAsyncError(async (req, res, next) => {
    const {token} = req.cookies;

    if(!token){
        return next(new ErrorHandler("Please Login to access the page", 401));
    }

    const decoded = jwt.verify(token, process.env.SEC_KEY);
    req.user = await User.findById(decoded.id);
    
    next();
});

module.exports.authorizeRole = (...roles) => {
    return (req, res, next) => {
        if(!roles.includes(req.user.role)){
            return next(new ErrorHandler(`Role: ${req.user.role} is not denied to access the resource`, 403));
        }

        next();
    }
}