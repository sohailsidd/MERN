const mongoose = require("mongoose");

const productScheema = new mongoose.Schema({
    name:{
        type: String,
        required:[true, "Please Enter Product Name"],
        trim: true
    },
    discription: {
        type: String,
        required:[true, "Please Enter Product Discription"]
    },
    price: {
        type: Number,
        required:[true, "Please Enter Product Price"],
        maxLength:[8, "Price can not be exceed from 8 character"]
    },
    ratings: {
        type: Number,
        default: 0
    },
    images: [
        {
            public_id: {
                type: String,
                required: [true, "Please Enter Public Id"]
            },
            url: {
                type: String,
                required: [true, "Please Enter Product Url"]
            }
        }
    ],
    category: {
        type: String,
        required: [true, "Please Enter Product Catagory"]
    },
    stock: {
        type: Number,
        maxLength: [4, "Stock can not be exceed from 4 characters"],
        default: 0
    },
    numberOfReviews: {
        type: Number,
        default: 0
    },
    reviews: [
        {
            user : {
                type: mongoose.Schema.ObjectId,
                ref: "user",
                required: true
            },
            name: {
                type: String,
                required:[true, "Please Enter Name"],
            },
            rating: {
                type: Number,
                required: [true, "Please Enter Rating"],
            },
            comment: {
                type: String,
                required: [true, "Please Add Comment"],
            }
        }
    ],
    user : {
        type: mongoose.Schema.ObjectId,
        ref: "user",
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model("Product", productScheema);