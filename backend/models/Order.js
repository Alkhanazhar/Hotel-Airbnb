const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, required: true },
    place: { type: mongoose.Schema.Types.ObjectId, required: true, ref: "Place" },
    name: { type: String, required: true },
    numberOfGuests: { type: String, required: true },
    checkIn: { type: Date, required: true },
    checkOut: { type: Date, required: true },
    phone: { type: Number, required: true },
    price: { type: Number, required: true },
})

const Booking = mongoose.model('Booking', bookingSchema);
module.exports = Booking;