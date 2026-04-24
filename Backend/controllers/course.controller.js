import { Course } from "../models/course.model.js";
import { v2 as cloudinary } from "cloudinary";
import { Purchase } from "../models/purchase.model.js";
import jwt from "jsonwebtoken";
import config from "../config.js";
export const createCourse = async (req, res) => {
  const adminId = req.adminId;
  const { title, description, price } = req.body;

  try {
    if (!title || !description || !price) {
      return res.status(400).json({ errors: "All fields are required" });
    }
    const { image } = req.files;
    if (!req.files || Object.keys(req.files).length === 0) {
      return res.status(400).json({ errors: "No file uploaded" });
    }
    const allowedFormat = ["image/png", "image/jpeg"];
    if (!allowedFormat.includes(image.mimetype)) {
      return res
        .status(400)
        .json({ errors: "Invalid file format.Only png and jpg are allowed " });
    }

    const cloud_response = await cloudinary.uploader.upload(image.tempFilePath);
    if (!cloud_response || cloud_response.error) {
      return res
        .status(400)
        .json({ errors: "Error uploading file to cloudinary" });
    }
    const courseData = {
      title,
      description,
      price,
      image: {
        public_id: cloud_response.public_id,
        url: cloud_response.url,
      },
      creatorId: adminId,
    };
    const course = await Course.create(courseData);
    res.json({
      message: "course created successfully",
      course,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Error creating course" });
  }
};

export const updateCourse = async (req, res) => {
  const adminId = req.adminId;
  const courseId = req.params.courseId.trim();

  const { title, description, price } = req.body;
  
  // Check if a new file is uploaded
  let imageData = null;
  if (req.files && req.files.image) {
    const { image } = req.files;
    const allowedFormat = ["image/png", "image/jpeg"];
    if (!allowedFormat.includes(image.mimetype)) {
      return res
        .status(400)
        .json({ errors: "Invalid file format. Only png and jpg are allowed" });
    }

    const cloud_response = await cloudinary.uploader.upload(image.tempFilePath);
    if (!cloud_response || cloud_response.error) {
      return res
        .status(400)
        .json({ errors: "Error uploading file to cloudinary" });
    }

    imageData = {
      public_id: cloud_response.public_id,
      url: cloud_response.url,
    };
  }

  try {
    const updateData = {
      title,
      description,
      price,
    };

    // Only update image if new imageData exists
    if (imageData) {
      updateData.image = {
        public_id: imageData.public_id,
        url: imageData.url,
      };
    }

    const course = await Course.findOneAndUpdate(
      {
        _id: courseId,
        creatorId: adminId,
      },
      updateData,
      { new: true },
    );

    if (!course) {
      return res.status(404).json({ error: "Course not found or unauthorized" });
    }

    res.status(201).json({ message: "course updated successfully", course });
  } catch (error) {
    console.log("error in course updating", error);
    res.status(500).json({ error: "Error in course updating" });
  }
};

export const deleteCourse = async (req, res) => {
  const adminId = req.adminId;
  const courseId = req.params.courseId.trim();
  try {
    const courseSearch = await Course.findById(courseId);
    if (!courseSearch) {
      return res.status(404).json({ message: "course not found" });
    }
    const course = await Course.findOneAndDelete({
      _id: courseId,
      creatorId: adminId,
    });
    if (!course) {
      return res.status(404).json({ error: "Course not found" });
    } else {
      res.status(200).json({ message: "deleted succesfully" });
    }
  } catch (error) {
    console.log(error);
    res.status(404).json({ message: "error in deleting" });
  }
};

export const getCourse = async (req, res) => {
  try {
    // Check if admin token is provided
    const authHeader = req.headers.authorization;
    let courses;

    if (authHeader && authHeader.startsWith("Bearer ")) {
      // If admin token provided, filter courses by admin
      const token = authHeader.split(" ")[1];
      try {
        const decoded = jwt.verify(token, config.JWT_ADMIN_PASSWORD);
        const adminId = decoded.id;
        courses = await Course.find({ creatorId: adminId });
      } catch (error) {
        // Invalid admin token, return all courses
        courses = await Course.find({});
      }
    } else {
      // No admin token, return all courses (for public access)
      courses = await Course.find({});
    }

    res.status(201).json({ courses });
  } catch (error) {
    res.status(500).json({ errors: "Error in getting courses" });
    console.log("error to get courses");
  }
};

export const courseDetails = async (req, res) => {
  const courseId = req.params.courseId.trim();
  console.log(courseId);
  try {
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ error: "Course not found" });
    } else {
      return res.status(200).json({ course });
    }
  } catch (error) {
    console.log("error in fetching", error);
    return res.status(500).json({ errors: "Error in fetching" });
  }
};

import Stripe from "stripe";

const stripe = new Stripe(config.STRIPE_SECRET_KEY);
console.log("stripe key", config.STRIPE_SECRET_KEY);

export const buyCourse = async (req, res) => {
  const { userId } = req;
  const courseId = req.params.courseId.trim();
  try {
    const course = await Course.findById(courseId);

    if (!course) {
      return res.status(404).json({ error: "Course  not found" });
    }
    const existingPurchase = await Purchase.findOne({ userId, courseId });

    if (existingPurchase) {
      return res.status(400).json({ error: "Course  are aleardy purchased" });
    }
    //stripe integration can be done here for payment processing
    const paymentIntent = await stripe.paymentIntents.create({
      amount:course.price * 100,
      currency: "usd",
      payment_method_types: ["card"]
    });

    res
      .status(201)
      .json({
        message: "course purchased successfully",
        course,
        clientSecret: paymentIntent.client_secret,
      });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "error in buy course" });
  }
};

export const confirmPurchase = async (req, res) => {
  const userId = req.userId; // Get from middleware
  const { courseId, paymentId, amount, status } = req.body;
  
  console.log("Confirm purchase request - userId:", userId, "body:", req.body);
  
  try {
    if (!userId) {
      return res.status(400).json({ error: "User ID not found - please login again" });
    }
    if (!courseId) {
      return res.status(400).json({ error: "Course ID is required" });
    }
    if (!paymentId) {
      return res.status(400).json({ error: "Payment ID is required" });
    }
    if (status !== "succeeded") {
      return res.status(400).json({ error: "Payment was not successful" });
    }

    // Check if purchase already exists
    const existingPurchase = await Purchase.findOne({ userId, courseId });
    if (existingPurchase) {
      return res.status(400).json({ error: "Course already purchased" });
    }

    // Create the purchase record
    const purchase = await Purchase.create({
      userId,
      courseId,
    });

    res.status(201).json({
      message: "Purchase confirmed successfully",
      purchase,
    });
  } catch (error) {
    console.log("Error in confirm purchase:", error);
    res.status(500).json({ error: "Error confirming purchase", details: error.message });
  }
};
