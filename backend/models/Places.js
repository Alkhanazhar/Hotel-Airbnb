const mongoose = require('mongoose');
const placesSchema = new mongoose.Schema({
    owner: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    title: String,
    address: String,
    photos: [String],
    description: String,
    perks: [String],
    extraInfo: String,
    price: Number,
    checkIn: Number,
    checkOut: Number,
    maxGuests: Number,
})

const Place = mongoose.model('Place', placesSchema)
module.exports = Place