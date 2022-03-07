const Product = require("../models/productModel");
const ErrorHandler = require("../utils/errorHandle");
const catchAsyncError = require("../middleware/catchAsyncError");
const ApiFeatures = require("../utils/apiFeatures");
const cloudneary = require('cloudinary');

exports.getAllProducts = catchAsyncError(async (req, res, next) => {
    const resultPerPage = 8;
    const productCount = await Product.countDocuments();
    let apiFeatures = new ApiFeatures(Product.find(),req.query).search().filter();
    let products = await apiFeatures.query
    let filterProductCount = products.length;
    apiFeatures = new ApiFeatures(Product.find(),req.query).search().filter().pagination(resultPerPage);
    products = await apiFeatures.query;
    
    res.status(200).json({ 
        success: true,
        products,
        NoOFProducts : productCount,
        resultPerPage,
        filterProductCount,
    });
})

// Admin -- Create Product
exports.createProduct = catchAsyncError(async (req, res, next) => {
        let images = [];

        if (typeof req.body.images === "string") {
        images.push(req.body.images);
        } else {
        images = req.body.images;
        }
    
        const imagesLinks = [];
        for (let i = 0; i < images.length; i++) {
        const result = await cloudneary.v2.uploader.upload(images[i], {
            folder: "products",
        });
    
        imagesLinks.push({
            public_id: result.public_id,
            url: result.secure_url,
        });
        }

    req.body.images = imagesLinks;
    req.body.user = req.user.id;
    
    const product = await Product.create(req.body);

    if(product !== null){
        res.status(201).json({
            success: true,
            product
        })
    }
})

// Admin -- GetAll Product
exports.getAllAdminProducts = catchAsyncError(async (req, res, next) => {
    const products = await Product.find();

    if(products !== null){
        res.status(201).json({
            success: true,
            products
        })
    }
})


// Admin -- Update Product
exports.updateProduct = catchAsyncError(async (req, res, next) => {
    let product = await Product.findById(req.params.id);

    if(!product){
        return next(new ErrorHandler("Product Not Found", 404));
    }

        // Images Start Here
    let images = [];

    if (typeof req.body.images === "string") {
        images.push(req.body.images);
    } else {
        images = req.body.images;
    }

    if (images !== undefined) {
        // Deleting Images From Cloudinary
        for (let i = 0; i < product.images.length; i++) {
        await cloudneary.v2.uploader.destroy(product.images[i].public_id);
        }

        const imagesLinks = [];

        for (let i = 0; i < images.length; i++) {
        const result = await cloudneary.v2.uploader.upload(images[i], {
            folder: "products",
        });

        imagesLinks.push({
            public_id: result.public_id,
            url: result.secure_url,
        });
        req.body.images = imagesLinks;

        }}


    product = await Product.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
        useFindAndModify: false
    })

    res.status(200).json({
        success: true,
        product
    })
})

exports.deletProduct = catchAsyncError(async (req, res, next) => {
    const product = await Product.findById(req.params.id);

    for (let i = 0; i < product.images.length; i++) {
        await cloudneary.v2.uploader.destroy(product.images[i].public_id);
    }

    if(!product){
        return next(new ErrorHandler("Product Not Found", 500));
    }

    await product.remove();

    res.status(200).json({
        success: true,
        isDeleted: true,
        message: "Product Deleted Successfully"
    })
})


//  Get Single Product
exports.getProduct = catchAsyncError(async (req, res, next) => {
    
    const product = await Product.findById(req.params.id);

    if(!product){
        return next(new ErrorHandler("Product Not Found", 404));
    }

    res.status(200).json({
        success: true,
        product
    })

})

module.exports.createProductReview = catchAsyncError( async (req, res, next) => {
    const {productId, comment, rating} = req.body;
    const review = {
        user: req.user.id,
        name: req.user.name,
        rating: Number(rating),
        comment,
    }

    const product = await Product.findById(productId);
    const isReviewd = await product.reviews.find(rev => rev.user.toString() === req.user.id);

    if(isReviewd){
        product.reviews.forEach(rev => {
            if(product.reviews.find(rev => rev.user.toString() === req.user.id)) {
                rev.rating = rating;
                rev.comment = comment;
            }
        })
    }
    else {
        product.reviews.push(review);
        product.numberOfReviews = Object.keys(product.reviews).length;
    }

    let avg = 0;
    
    product.reviews.forEach(rev => {
        avg+=rev.rating;
    })
    
    product.ratings = avg / Object.keys(product.reviews).length; 
    await product.save({validateBeforeSave: false});

    res.status(200).json({
        success: true
    });
});

module.exports.getAllReviews = catchAsyncError(async(req, res, next) => {
    const product = await Product.findById(req.query.id);

    if(!product){
        return next(new ErrorHandler("Product Not Found", 404));
    }

    res.status(200).json({
        success: true,
        reviews: product.reviews
    })
});

module.exports.deleteReview = catchAsyncError( async(req, res, next) => {
    const product = await Product.findById(req.query.productId);

    if(!product){
        return next(new ErrorHandler("Product Not Found", 404));
    }

    const reviews = product.reviews.filter((rev) => rev._id.toString() !== req.query.id.toString());

    let avg = 0;
    
    reviews.forEach(rev => {
        avg+=rev.rating;
    })
    let ratings = 0;

    if (reviews.length === 0) {
        ratings = 0;
    } else {
        ratings = avg / Object.keys(reviews).length;
    }

    const numberOfReviews = Object.keys(reviews).length;
    
    const result = await Product.findByIdAndUpdate(req.query.productId, 
        {reviews, ratings, numberOfReviews}, 
        {new: true, runValidatorys: true, useFindAndModify: false});

    res.status(200).json({
        success: true,
        reviews: result.reviews
    })
});