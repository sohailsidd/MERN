const mongoose = require("mongoose");

const orderScheema = new mongoose.Schema({
    shippingInfo: {
        address: {
            type: String,
            required: true
        },
        city: {
            type: String,
            required: true
        },
        state: {
            type: String,
            required: true
        },
        country: {
            type: String,
            required: true
        },
        pinCode: {
            type: Number,
            required: true
        },
        phoneNo: {
            type: Number,
            required: true
        }
    },
    orderItems: [
        {
            name: {
                type: String,
                required: true
            },
            price: {
                type: String,
                requried: true
            },
            quantity: {
                type: Number,
                requried: true
            },
            image: {
                type: String,
                requried: true
            },
            product: {
                type: mongoose.Schema.ObjectId,
                ref: "Product",
                required: true
            },
        }
    ],
    user: {
        type: mongoose.Schema.ObjectId,
        ref: "user",
        required: true
    },
    paymentInfo: {
        id: {
            type: String,
            requried: true
        },
        status: {
            type: String,
            requried: true
        },
    },
    paidAt: {
        type: Date,
        requried: true
    },
    itemPrice: {
        type: Number,
        default: 0,
        requried: true
    },
    taxPrice: {
        type: Number,
        default: 0,
        requried: true
    },
    shippingPrice: {
        type: Number,
        default: 0,
        requried: true
    },
    totalPrice: {
        type: Number,
        default: 0,
        requried: true
    },
    orderStatus: {
        type: String,
        required: true,
        default: "Processing"
    },
    delivered: {
        type: Date
    },
    createdAt: {
        type: Date, 
        default: Date.now()
    }
})

module.exports = mongoose.model("Order",orderScheema);