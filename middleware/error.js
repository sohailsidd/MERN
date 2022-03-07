const ErrorHandler = require("../utils/errorHandle");

module.exports = (err, req, res, next) => {
    err.statusCode = err.statusCode || 500;
    err.message =  err.message || "Internal Server Error";

    //Mongodb Id error
    if(err.name === "CastError"){
        const message = `Resource not found. Invalid ${ err.path }`;
        err = new ErrorHandler(message, 400);
    }

    //Mongoose  duplicate key error
    if(err.code === 11000){
        const message = `Duplicate ${ Object.keys(err.keyValue) } Entered`;
        err = new ErrorHandler(message, 400);
    }

    //Wrong JWT error
    if(err.name === "JsonWebTokenError"){
        const message = "Json web token is invalid: Try again";
        err = new ErrorHandler(message, 400);
    }

    //Jwt Expire Error
    if(err.name === "TokenExpireError"){
        const message = "Json web token is Expire: Try again";
        err = new ErrorHandler(message, 400);
    }

    res.status(err.statusCode).json({
        success: false,
        message: err.message
    })
}