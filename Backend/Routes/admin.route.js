import express from "express";
import { adminlogin, adminlogout, adminsignUp } from "../controllers/admin.controller.js";
import adminMiddleware from "../middlewares/admin.mid.js";

const router=express.Router();

router.post("/signup",adminsignUp);
router.post("/login",adminlogin);
router.get("/logout",adminlogout);
export default router