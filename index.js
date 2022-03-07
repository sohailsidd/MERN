const express =  require("express");
const productRouter = require("./routes/productRoute");
const userRouter = require("./routes/userRoute");
const orderRouter = require("./routes/orderRoute");
const connectDB = require("./db/connection");
const middleWareError = require("./middleware/error");
const cookieParser = require("cookie-parser");
const cloudneary = require('cloudinary');
const bodyParser = require("body-parser");
const fileUpload = require("express-fileupload");
const paymentRoute = require("./routes/paymentRoute");
const path = require("path");
const aap = express();
// Handling uncought Error
process.on("uncaughtException", (error) => {
    console.log(`Error : ${ error }`);
    console.log("Shuttering down due to Uncaught Error");

    process.exit(1);
    
})

if (process.env.NODE_ENV !== "PRODUCTION") {
    const dotenv = require("dotenv");
    dotenv.config({path:"./config/config.env"});
}



const port = process.env.PORT || 4000;
connectDB();
cloudneary.config({
    cloud_name: process.env.COUDENARY_NAME,
    api_key: process.env.COUDENARY_API_KEY,
    api_secret: process.env.COUDENARY_API_SECRATE,
});

aap.use(express.json());
aap.use(bodyParser.urlencoded({extended : true}));
aap.use(cookieParser());
aap.use("/api", productRouter);
aap.use("/api", userRouter);
aap.use("/api", orderRouter);
aap.use("/api", paymentRoute);
aap.use(express.static(path.join(__dirname, "client/build")));

aap.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "client/build/index.html"));
});
aap.use(middleWareError);

const server = aap.listen(port,() => {
    console.log(`Server is listning at http://localhost:${ port }`);
})

// Handling unhandled Rejection
process.on("unhandledRejection", (error) => {
    console.log(`Error : ${ error }`);
    console.log("Shuttering down due to unhandled promise rejection");

    server.close(()=> {
        process.exit(1);
    })
})