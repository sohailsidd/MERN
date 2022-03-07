const Order = require("../models/orderModel");
const Product = require("../models/productModel");
const ErrorHandler = require("../utils/errorHandle");
const catchAsyncError = require("../middleware/catchAsyncError");

module.exports.newOrder = catchAsyncError(async(req, res, next) => {
    const {shippingInfo, orderItems, paymentInfo, itemPrice, taxPrice, shippingPrice, totalPrice} = req.body;
    console.log(shippingInfo, orderItems, paymentInfo, itemPrice, taxPrice, shippingPrice, totalPrice);
    const order = await Order.create({
        shippingInfo, orderItems, paymentInfo, itemPrice, taxPrice, shippingPrice, totalPrice, paidAt: Date.now(), user: req.user.id
    })

    res.status(200).json({
        success: true,
        order
    })
});

module.exports.getSingleOrder = catchAsyncError(async(req, res, next) => {
    const order = await Order.findById(req.params.id).populate("user", "name  email");

    if(!order) {
        return next(new ErrorHandler("Product Not Found by this id", 404));
    }

    res.status(200).json({
        success: true,
        order
    });
});

module.exports.myOrders = catchAsyncError(async(req, res, next) => {
    const orders = await Order.find({user:req.user.id});

    res.status(200).json({
        success: true,
        orders
    });
});

//For Admin
module.exports.getAllOrders = catchAsyncError(async(req, res, next) => {
    const orders = await Order.find();

    let totalAmount = 0;

    orders.forEach(order => {
        totalAmount += order.totalPrice;
    });

    res.status(200).json({
        success: true,
        totalAmount,
        orders
    });
});

//For Admin
module.exports.updateOrderStatus = catchAsyncError(async(req, res, next) => {
    const order = await Order.findById(req.params.id);

    if(!order) {
        return next(new ErrorHandler("Product Not Found by this id", 404));
    }

    if(order.orderStatus === "Delivered") {
        return next(new ErrorHandler("You have already delivered the order",404));
    }

    if(req.body.status === "Shipped") {
        order.orderItems.forEach(async(order) => {
            await updateStock(order.product, order.quantity);
        })
    }

    order.orderStatus = req.body.orderStatus;

    if(req.body.orderStatus === "Delivered") {
        order.delivered = Date.now();
    }

    await order.save({validateBeforeSave: false});
    
    res.status(200).json({
        success: true,
        order
    });
});

async function updateStock(id, quantity) {
    const product = await Product.findById(id);

    if(!product) {
        return next(new ErrorHandler("Product not found", 404));
    }

    product.stock-=quantity;

    console.log(await product.save({validateBeforeSave: false}));
}

//For Admin
module.exports.deleteOrder = catchAsyncError(async(req, res, next) => {
    const order = await Order.findById(req.params.id);

    if(!order) {
        return next(new ErrorHandler("Product Not Found by this id", 404));
    }

    await order.remove();
    
    res.status(200).json({
        success: true
    });
});