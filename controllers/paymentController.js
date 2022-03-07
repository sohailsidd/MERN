const catchAsyncError = require("../middleware/catchAsyncError");
const stripe = require("stripe")('sk_test_51KPoqNSGICNEvqQsoBJCd6SadoMgZ276l1HIVE7HWoPnOAcMP58dbnalB5WLEtfScEqTUnllW2g1UZGzhuijUJmw00StGrQVVR');

exports.processPayment = catchAsyncError(async (req, res, next) => {
    const myPayment = await stripe.paymentIntents.create({
        amount: req.body.amount,
        currency: "inr",
        metadata: {
            company: "SohailProduction",
        },
    });

    res.status(200).json({
        success: true,
        client_secret: myPayment.client_secret
    });
});

exports.sendStripeApikey = catchAsyncError(async(req, res, next) => {
    res.status(200).json({
        stripeApiKey: process.env.STRIPE_API_KEY
    });
});