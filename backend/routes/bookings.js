const express = require('express');
const router = express.Router();
const JWT = require("jsonwebtoken")
const dotenv = require("dotenv")
require('dotenv').config()
const Booking=require("./../models/Order")


router.post("/bookings", async (req, res) => {
    try {
        const { token } = req.cookies
        const decodeUser = JWT.verify(token, process.env.JWT_SECRET)
        const { numberOfGuests, checkIn, checkOut, price, phone, name, place } = req.body
        const data = await Booking.create({
            numberOfGuests, checkIn, checkOut, price, phone, name, place, user: decodeUser._id
        })
        console.log(data)
        res.json(data)
    } catch (error) {
        console.error(error.message)
    }

})

router.get("/bookings", async (req, res) => {
    try {
        const { token } = req.cookies
        const decodeUser = JWT.verify(token, process.env.JWT_SECRET)
        res.json(await Booking.find({ user: decodeUser.id }).populate("place"))
    } catch (error) {
        console.error(error.message)
    }

})
module.exports = router