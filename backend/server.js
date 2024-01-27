const express = require('express');
const app = express();
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require("dotenv")
const path = require('path');
const authRoute = require("./routes/auth");
const bookingsRoute = require("./routes/bookings");
const placeRoute = require("./routes/places");
const connectDb = require('./db');
const imageDownloader = require("image-downloader")
const multer = require("multer");
const fs = require('fs');


app.use(express.json());
app.use(express.urlencoded({ extended: true }));
require('dotenv').config()
var cookieParser = require('cookie-parser');

app.use(cookieParser())
app.use("/uploads", express.static(__dirname + "/uploads"));
app.use(cors({
    origin: "https://localhost:5173", credentials: true
}));

//db
connectDb()
//routes



app.post("/upload-by-link", async (req, res) => {
    try {
        const { link } = req.body
        const newName = "photo" + Date.now() + ".jpg"
        await imageDownloader.image({
            url: link,
            dest: __dirname + '/uploads/' + newName
        })
        res.json(newName)
    } catch (error) {
        console.log(error.message)
    }
})
const photoMiddleware = multer({ dest: 'uploads/' })
app.post("/uploads", photoMiddleware.array("photos", 100), async (req, res) => {
    const uploadFiles = []
    for (let i = 0; i < req.files.length; i++) {
        const { path, originalname } = req.files[i]
        const part = originalname.split(".")
        const extension = part[part.length - 1]
        const newPath = path + "." + extension
        fs.renameSync(path, newPath)
        uploadFiles.push(newPath.replace("uploads\\", ""))
    }
    res.json(uploadFiles)
})

app.use(authRoute)
app.use(bookingsRoute)
app.use(placeRoute)

const PORT = process.env.PORT || 8080
app.listen(PORT, () => {
    console.log(`listening on port ${PORT}`)
})