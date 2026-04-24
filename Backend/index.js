import express from "express";

import dotenv from "dotenv";
dotenv.config();
import mongoose from "mongoose";
import courseRoute from "./Routes/course.route.js";
import userRouter from "./Routes/user.route.js";
import adminRoute from "./Routes/admin.route.js";
import orderRoute from "./Routes/order.route.js";

import fileUpload from "express-fileupload";
import { v2 as cloudinary } from "cloudinary";
import cookieParser from "cookie-parser";
import cors from "cors";

const app = express();
app.get("/", (req, res) => {
  res.send("Hello world");
});
app.use(cookieParser());
//middleware
app.use(express.json());
const port = process.env.PORT || 3000;
const DB_URI = process.env.MONGO_URI;

app.use(
  cors({
    origin: "https://course-selling-app-tdll.vercel.app/",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
app.use(
  fileUpload({
    useTempFiles: true,
    tempFileDir: "/tmp/",
  }),
);

try {
  await mongoose.connect(DB_URI);
  console.log("connected to Mongodb");
} catch (err) {
  console.log(err);
}

app.use("/api/v1/course", courseRoute);
app.use("/api/v1/user",userRouter);
app.use("/api/v1/admin",adminRoute);
app.use("/api/v1/order",orderRoute);
cloudinary.config({
  cloud_name: process.env.cloud_name,
  api_key: process.env.api_key,
  api_secret:process.env.api_secret, // Click 'View API Keys' above to copy your API secret
});

app.listen(port, () => {
  console.log(`server is running on ${port}`);
});
