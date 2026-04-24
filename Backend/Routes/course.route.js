import express from 'express';
import { buyCourse, courseDetails, createCourse, deleteCourse, getCourse, updateCourse, confirmPurchase } from '../controllers/course.controller.js';
import userMiddleware from '../middlewares/user.mid.js';
import adminMiddleware from '../middlewares/admin.mid.js';

const router=express.Router()

router.post("/create",adminMiddleware,createCourse);
router.put("/update/:courseId",adminMiddleware,updateCourse);
router.delete("/delete/:courseId",adminMiddleware,deleteCourse);
router.get("/courses",getCourse);
router.get("/course/:courseId",courseDetails);
router.post("/buy/:courseId",userMiddleware,buyCourse);
router.post("/confirm-purchase",userMiddleware,confirmPurchase);
export default router;