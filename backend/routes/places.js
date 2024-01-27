
const express = require('express');
const Place = require('../models/Places');
const router = express.Router();
const JWT = require("jsonwebtoken")
const dotenv = require("dotenv")
require('dotenv').config()


router.post("/places", async (req, res) => {
    try {
        const { title, address, photos, description, perks, extraInfo, checkIn, checkOut, maxGuests, price } = req.body
        const { token } = req.cookies
        const decodeUser = JWT.verify(token, process.env.JWT_SECRET)
        const place = await Place.create({
            owner: decodeUser.id, title, address, photos, description, perks,
            extraInfo, checkIn, checkOut, price, maxGuests
        })
        res.json({ success: true, place })
    } catch (error) {
        console.error(error.message)
    }

})
router.get("/places", async (req, res) => {
    try {
        const { token } = req.cookies
        const decodeUser = JWT.verify(token, process.env.JWT_SECRET)
        const { id } = decodeUser
        const data = await Place.find({ owner: id })
        res.json(data)
    } catch (error) {
        console.error(error.message)
    }
})

router.get("/places/:id", async (req, res) => {
    try {
        const { id } = req.params
        const data = await Place.findById(id)
        res.json(data)
    } catch (error) {
        console.error(error.message)
    }
})

router.put("/edit-places/:id", async (req, res) => {
    try {
        console.log("put");
        const { id } = req.params
        const places = await Place.findById(id)
        const { token } = req.cookies
        const decodeUser = JWT.verify(token, process.env.JWT_SECRET)
        if (places.owner.toString() === decodeUser.id) {
            const data = await Place.findByIdAndUpdate(id, { ...req.body })
            res.json(data)
        }
        res.json({ success: false })
    } catch (error) {
        console.log(error.message)
    }
})
router.get("/all-places", async (req, res) => {
    res.json(await Place.find())
})

router.get("/all-places/:id", async (req, res) => {
    try {

        const { id } = req.params
        const data = await Place.findById(id).populate("owner")
        res.json(data)
    } catch (error) {
        console.log(error.message)
    }
})
module.exports = router