const express = require('express');
const app = express();

const userRoute = require("./routes/User");
const paymnetRouter = require("./routes/Payments");
const profileRouter = require("./routes/Profile");
const courseRouter = require("./routes/Course");
const contact = require("./routes/ContactUs");

const { connectDB } = require("./config/database");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const {cloudinaryConnect} = require("./config/cloudinary");
const fileUpload = require("express-fileupload");

require('dotenv').config();
const port = process.env.PORT || 4000;

connectDB();
app.use(express.json());
app.use(cookieParser());
app.use(cors({
  origin: process.env.FRONTEND_URL,
  credentials: true,
}));
app.use(fileUpload({
  useTempFiles: true,
  tempFileDir: "/tmp/",
}));
cloudinaryConnect();

app.use("/api/v1/auth", userRoute);
app.use("/api/v1/payment", paymnetRouter);
app.use("/api/v1/profile", profileRouter);
app.use("/api/v1/course", courseRouter);
app.use("/api/v1/contact", contact);

app.get("/", (req, res) => {
  return res.status(200).json({
    success: true,
    message: "Server is up and running",
  });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});







