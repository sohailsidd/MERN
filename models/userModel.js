const mongoose = require("mongoose");
const validator = require("validator");
const bcript = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");

const userScheema = new mongoose.Schema({
    name : {
        type : String,
        required : [true, "Please Enter Name"],
        maxLength : [30, "Name can not be exceed from 30 characters"],
        minLength: [4 , "Name can not be less then 4 characters"]
    },
    email : {
        type: String,
        required : [true, "Please Enter Email"],
        unique: true,
        validate: [validator.isEmail, "Plese  Enter a valid Email"]
    },
    password : {
        type : String,
        required : [true, "Please Enter Password"],
        minLength: [8, "Password should be grater then 8 characters"]
    },
    avatar: {
        public_id: {
            type: String,
            required: [true, "Please Enter Public Id"]
        },
        url: {
            type: String,
            required: [true, "Please Enter Product Url"]
        }
    },
    role: {
        type: String,
        default: "user"
    },
    createdAt: {
        type: Date,
        default: Date.now()
    },
    resetPasswordToken: {
        type: String
    },
    resetPasswordExpire:{
        type: Date
    } 
});

userScheema.pre("save", async function(next) {
    if(!this.isModified("password")){
        next();
    }

    this.password = await bcript.hash(this.password, 10);
});

userScheema.methods.getToken = function () {
    return jwt.sign({id: this._id}, process.env.SEC_KEY, {
        expiresIn: process.env.SEC_EXPIRE
    });
}

userScheema.methods.isPasswordMatch = async function(enterdPassword) {
    return await bcript.compare(enterdPassword, this.password);
}

userScheema.methods.getResetPasswordToken = function () {
    const resetToken = crypto.randomBytes(20).toString("hex");

    this.resetPasswordToken = crypto.createHash("sha256").update(resetToken).digest("hex");
    this.resetPasswordExpire = Date.now() + 15 * 60 * 1000;

    return resetToken;
}

module.exports = mongoose.model("user", userScheema);