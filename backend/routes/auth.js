const express = require("express")
const User = require("../models/User")
const router = express.Router()
const bcrypt = require("bcryptjs")
const JWT = require("jsonwebtoken")

const salt = bcrypt.genSaltSync(10)
router.post("/register", async (req, res) => {
    try {
        const { name, email, password } = req.body
        if (!email) return res.send("Please enter your email")
        if (!password) return res.send("Please enter your password")
        if (!name) return res.send("Please enter your name")
        const user = await User.create({ name, email, password: bcrypt.hashSync(password, salt) })
        res.send(user)
    } catch (error) {
        console.log(error.message)
    }
    bcrypt
})
router.post("/login", async (req, res) => {
    const { email, password } = req.body
    const user = await User.findOne({ email })
    if (!user) return res.json({ success: false })
    if (user) {
        const comparePassword = bcrypt.compareSync(password, user.password)
        if (comparePassword) {
            const token = JWT.sign({ email: user.email, id: user._id, name: user.name }, process.env.JWT_SECRET, { expiresIn: "7days" })
            res.cookie("token", token).json({ "success": true, user: user, token })
        }
        else {
            res.status(403).send({ "success": false, message: "Invalid password" })
        }
    }
})

router.get('/profile', async (req, res) => {
    const { token } = req.cookies
    if (token) {
        const tokenVerify = JWT.verify(token, process.env.JWT_SECRET)
        const { name, email, _id } = await User.findById(tokenVerify.id)
        res.json({ name, email, _id })
    }
    else {
        res.json(null)
    }
})
router.post("/logout", async (req, res) => {
    res.cookie("token", "").json(true)
})

module.exports = router