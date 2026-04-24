import { User } from "../models/user.model.js";
import bcrypt from "bcryptjs";
import { z } from "zod";
import jwt from "jsonwebtoken";
import config from "../config.js";
import { Purchase } from "../models/purchase.model.js";
import { Course } from "../models/course.model.js";
export const signUp = async (req, res) => {
  console.log("signup");
  const { firstName, LastName, email, password } = req.body;
  const userSchema = z.object({
    firstName: z
      .string()
      .min(3, { message: "firstName must be atleast 3 char long" }),
    LastName: z
      .string()
      .min(3, { message: "LastName must be atleast 3 char long" }),
    email: z.string().email(),
    password: z
      .string()
      .min(8, { message: "password must be atleast 8 char long" }),
  });
  const validatedData = userSchema.safeParse(req.body);
  if (!validatedData.success) {
    return res
      .status(400)
      .json({ error: validatedData.error.issues.map((err) => err.message) });
  }
  const hashedpassword = await bcrypt.hash(password, 10);
  try {
    const existingUser = await User.findOne({ email: email });
    if (existingUser) {
      return res.status(400).json({ error: "user already exist" });
    }

    const userdata = {
      firstName,
      LastName,
      email,
      password: hashedpassword,
    };
    const newUser = await User.create(userdata);
    if (newUser) {
      res.status(201).json({ message: "Sign up succes", newUser });
    } else {
      res.status(404).json({ error: "error in signUp " });
    }
  } catch (error) {
    console.log("Error in signup", error);
    res.status(400).json({ error: "error in signup", error });
  }
};
export const login = async (req, res) => {
  console.log("login")
  const { email, password } = req.body;
  const userSchema = z.object({
    email: z.string().email(),
    password: z
      .string()
      .min(8, { message: "password must be atleast 8 char long" }),
  });
  const validatedData = userSchema.safeParse(req.body);
  if (!validatedData.success) {
    return res
      .status(400)
      .json({ error: validatedData.error.issues.map((err) => err.message) });
  }
  try {
    const user = await User.findOne({ email: email });
    if (!user) {
      return res.status(404).json({ error: "user does not exist" });
    }
    const ispasswordCorrect = await bcrypt.compare(password, user.password);
    if (!ispasswordCorrect) {
      return res.status(403).json({ error: "password is incorrect" });
    }
    const token = jwt.sign(
      {
        id: user._id,
      },
      config.JWT_USER_PASSWORD,
      { expiresIn: "1d" },
    );
    const cookieOptions = {
      expires: new Date(Date.now() + 24 * 60*60 * 1000),
      httpOnly: true, // can not be accesed via js directly
      secure: process.env.NODE_ENV === "production", //true for https only
      sameSite: "Strict", // prvent from csrf attacks
    };

    res.cookie("jwt", token, cookieOptions);

    return res.status(201).json({ message: "login succesful", user, token });
  } catch (error) {
    console.log("error in login", error);
    res.status(500).json({ error: "Error in login" });
  }
};

export const logout = async (req, res) => {
  try {
    if (!req.cookies.jwt) {
      return res.status(401).json({ errors: "Kindly login first" });
    }
    res.clearCookie("jwt");
    res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    console.log("error in login", error);
    res.status(500).json({ errors: "Error in logout" });
  }
};

export const purchasedSection = async (req, res) => {
  const userId = req.userId;

  try {
    const purchased = await Purchase.find({ userId });

    let purchasedCoursedId = [];
    for (let i = 0; i < purchased.length; i++) {
      purchasedCoursedId.push(purchased[i].courseId);
    }

    const courseData = await Course.find({
      _id: { $in: purchasedCoursedId },
    });
    res.status(200).json({ purchased, courseData });
  } catch (error) {
    console.log("Error in purchase", error);
    return res.status(500).json({ errors: "Error in purchases" });
  }
};
