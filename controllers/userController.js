const User = require("../models/userModel");
const ErrorHandler = require("../utils/errorHandle");
const catchAsyncError = require("../middleware/catchAsyncError");
const jwtToken = require("../utils/jwtToken");
const sendEmail = require("../utils/sendEmail");
const crypto = require("crypto");
const cloudneary = require('cloudinary');

module.exports.createUser = catchAsyncError(async(req, res, next) => {
    let user;
    if(req.body.avatar[0] === "d") {
        const myCloud = await cloudneary.v2.uploader.upload(req.body.avatar,{
            folder: "avtares",
            width: 150,
            crop: "scale",
        });
        const {name, email, password} = req.body;
        try {
            
        user = await User.create({
            name,
            email,
            password,
            avatar: {
                public_id: myCloud.public_id,
                url: myCloud.secure_url,
            }
        })
        } catch (err) {
            if(err.code === 11000) {
                return next(new ErrorHandler("This email is already existd",500));
            }
        }
    }else {
        const {name, email, password} = req.body;

        try {
            user = await User.create({
                name,
                email,
                password,
                avatar: {
                    public_id: "avtares/download_zw4onz",
                    url: "https://res.cloudinary.com/ecommercewebsite/image/upload/v1644270595/avtares/download_zw4onz.jpg",
                }
            }) 
        } catch (err) {
            if(err.code === 11000) {
                return next(new ErrorHandler("This email is already existd",500));
            }
            
        }   
    }
    
    jwtToken(user, 200, res);
});

module.exports.loginUser = catchAsyncError(async (req, res, next) => {
    
    const {email, password} = req.body;

    if(!email || !password){
        return next(new ErrorHandler("Enter email and password", 400));
    }

    const user = await User.findOne({email}).select("+password");
    
    if(!user){
        return next(new ErrorHandler("Invalid email or Password", 401));
    }

    const matchPassword = await user.isPasswordMatch(password);
    

    if(!matchPassword){
        return next(new ErrorHandler("Invalid email or Password", 401));
    }

    jwtToken(user, 200, res);
});

module.exports.logout = catchAsyncError(async(req, res, next) => {
    res.cookie("token", null, {
        expires: new Date(Date.now()),
        httpOnly: true
    });

    res.status(200).json({
        success: true,
        message: "Logged Out"
    });
});

module.exports.forgotPassword = catchAsyncError( async (req, res, next) => {
    const user = await User.findOne({ email: req.body.email });

    if(!user){
        return next(new ErrorHandler("User Not Found",404));
    }

    const resetToken = user.getResetPasswordToken();
    await user.save({ validateBeforeSave: false });
    // ${ req.protocol }://${ req.get("host") }
    const resetPassword = `${req.protocol}://${req.get("host")}/password/reset/${ resetToken }`;
    const message = `Your Password reset Token is :-  \n\n  ${ resetPassword } \n\n If you have not requested this email then, simply ignore it`;

    try {
        await sendEmail({
            email: user.email,
            subject: "Ecommerce password reset",
            message: message
        });
        
        res.status(200).json({
            success: true,
            message: `Email is sent to the ${ user.email } Succfully`
        });

    } catch (error) {
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;
        
        await user.save({ validateBeforeSave: false });

        return next(new ErrorHandler(error.message, 500));
    }
});

module.exports.resetPassword = catchAsyncError( async (req, res, next) => {
    const resetPasswordToken = crypto.createHash("sha256").update(req.params.token).digest("hex");
    const user = await User.findOne({
        resetPasswordToken,
        resetPasswordExpire: { $gt: Date.now() },
    });

    if(!user){
        return next(new ErrorHandler("Reset password token is invalid or has been expired",400));
    }
    
    if(req.body.password !== req.body.confirmPassword){
        return next(new ErrorHandler("Password and conform password does not match",400));
    }

    user.password = req.body.password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save({ validateBeforeSave: false });

    jwtToken(user, 200, res);
});

module.exports.getUserDetails = catchAsyncError( async (req, res, next) => {
    const user = await User.findById(req.user.id);

    res.status(200).json({
        success: true,
        user,
    });
});

module.exports.updatePassword = catchAsyncError( async (req, res, next) => {
    console.log(req.body); 
    const user = await User.findById(req.user._id).select("+password");
    const isPasswordMatch = await user.isPasswordMatch(req.body.oldPassword);
    
    if(!isPasswordMatch) {    
        return next(new ErrorHandler("Old Password is Incorrect ", 500));
    }

    if(req.body.newPassword !== req.body.confirmPassword){
        return next(new ErrorHandler("Password does not Match",500));
    }

    if(req.body.newPassword === req.body.oldPassword){
        return next(new ErrorHandler("Old Password and new Password are same",500));
    }

    user.password = req.body.newPassword;
    await user.save();

    jwtToken(user, 200, res);
});

module.exports.updateProfile = catchAsyncError( async (req, res, next) => {
    
    const newUserData = {
        name: req.body.name,
        email: req.body.email
    }

    if (req.body.avatar !== "") {
        const user = await User.findById(req.user._id);
        const imageId = user.avatar.public_id;
        
        await cloudneary.v2.uploader.destroy(imageId);
        
        const myCloud = await cloudneary.v2.uploader.upload(req.body.avatar, {
            folder: "avatars",
            width: 150,
            crop: "scale",
        });

        newUserData.avatar = {
            public_id: myCloud.public_id,
            url: myCloud.secure_url,
        };
    }

    const validation = {
        new: true,
        runValidators: true,
        useFindAndModify: false
    }

    const user = await User.findByIdAndUpdate(req.user.id, newUserData, validation);

    res.status(200).json({
        success: true,
        user,
    });
});

// For Admin
module.exports.getAllUsers = catchAsyncError( async (req, res, next) => {
    const users = await User.find();

    res.status(200).json({
        success: true,
        users,
    });
});

// For Admin
module.exports.getSingleUser = catchAsyncError( async (req, res, next) => {
    const user = await User.findById(req.params.id);

    if(!user){
        return next(new ErrorHandler(`User Not found by ${ req.params.id } id`));
    }

    res.status(200).json({
        success: true,
        user,
    });
});

// For Admin
module.exports.updateRole = catchAsyncError( async (req, res, next) => {
    const newUserData = {
        name: req.body.name,
        email: req.body.email,
        role: req.body.role
    }

    let user = User.findById(req.params.id);
    if(!user){
        return new ErrorHandler("User not found ", 404);
    }

    const validation = {
        new: true,
        runValidators: true,
        useFindAndModify: false
    }

    user = await User.findByIdAndUpdate(req.params.id, newUserData, validation);

    res.status(200).json({
        success: true,
        user,
    });
});

// For Admin
module.exports.deleteUser = catchAsyncError( async (req, res, next) => {

    const user = await User.findById(req.params.id);

    if(!user){
        console.log("not found");
        return next(new ErrorHandler("User Not Found",404));
    }

    
    const imageId = user.avatar.public_id;

    await cloudneary.v2.uploader.destroy(imageId);

    await user.remove();

    res.status(200).json({
        success: true,
        message: "User Deleted Successfully"
    });
});