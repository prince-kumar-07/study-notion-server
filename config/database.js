const mongoose = require("mongoose");
require("dotenv").config()

exports.connectDB = () => {
   mongoose.connect(process.env.DATABASE_ATLAS_URL)
    .then(() => console.log(`DB connection successful`))
    .catch((error) => {
        console.log(`DB connection failed`)
        console.log(error)
        process.exit(1)
    })
}