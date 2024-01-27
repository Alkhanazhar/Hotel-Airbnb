const mongoose = require('mongoose');

const connectDb=()=>{
try {
    mongoose.connect(process.env.MONGO_URL).then(() => console.log("CONNECTED TO DB"))
} catch (error) {
    console.error(error.message);
    mongoose.disconnect();
}
}
module.exports = connectDb;