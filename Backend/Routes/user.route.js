import express from 'express';
import { login, logout, purchasedSection, signUp } from '../controllers/user.controller.js';
import userMiddleware from '../middlewares/user.mid.js';

const router=express.Router();
router.post("/signUp",signUp);
router.post("/login",login);
router.get("/logout",logout);
router.get("/purchased",userMiddleware,purchasedSection);
export default router;