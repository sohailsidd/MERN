const mongoose = require("mongoose");

const connect = () => {
    mongoose.connect(process.env.DB_URL)
    .then((data) => {
        console.log(`MongoDB connected to the server : ${ data.connection.host }`);
    })
    .catch((error) => {
        console.log(error);
    })
}

module.exports = connect;