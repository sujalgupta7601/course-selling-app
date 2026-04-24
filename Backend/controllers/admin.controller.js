import { Admin } from "../models/admin.models.js";
import { User } from "../models/user.model.js";
import bcrypt from "bcryptjs"
import {z} from "zod"
import jwt from "jsonwebtoken"
import config from "../config.js";
export const adminsignUp=async (req,res)=>{
    const { firstName, LastName, email, password } = req.body;
    const adminSchema=z.object({
        firstName:z.string().min(3,{message:"firstName must be atleast 3 char long"}),
        LastName:z.string().min(3,{message:"LastName must be atleast 3 char long"}),
        email:z.string().email(),
        password:z.string().min(8,{message:"password must be atleast 8 char long"}),
      })
      const validatedData =adminSchema.safeParse(req.body);
      if(!validatedData.success){
        return res.status(400).json({error: validatedData.error.issues.map(err=>err.message)});
      }
      const hashedpassword=await bcrypt.hash(password,10); 
      try{
        const existingAdmin=await Admin.findOne({email:email});
        if(existingAdmin){
        return res.status(400).json({message:"admin already exist"});
      }
    
      const admindata={
        firstName,LastName,email,password:hashedpassword,
      }
      const newadmin=await Admin.create(admindata);
      if(newadmin){
        res.status(201).json({message:"Sign up succes",newadmin});
    
      }
      else{
        res.status(404).json({message:"error in signUp "});
      }
      }
      catch(error){
        console.log("Error in signup",error);
        res.status(400).json({message:"error in signup",error});
      }
}
export const adminlogin=async (req,res)=>{
     const {email,password}=req.body;
       const adminSchema=z.object({
         email:z.string().email(),
         password:z.string().min(8,{message:"password must be atleast 8 char long"}),
       })
       const validatedData=adminSchema.safeParse(req.body);
       if(!validatedData.success){
        return res.status(400).json({error: validatedData.error.issues.map(err=>err.message)});
       }
       try{
         const admin=await Admin.findOne({email:email});
         if(!admin){
          return res.status(404).json({message:"user does not exist"});
         }
         const ispasswordCorrect=await bcrypt.compare(password,admin.password);
         if(!ispasswordCorrect){
          return res.status(401).json({message:"password is incorrect"});
         }
          const token=jwt.sign({
             id:admin._id,
          },
          config.JWT_ADMIN_PASSWORD,
        {expiresIn:"1d"});
        const cookieOptions={
          expires:new Date(Date.now()+ 24*60*60*1000),
          httpOnly:true,// can not be accesed via js directly
          secure:process.env.NODE_ENV==="production",//true for https only
          sameSite:"Strict"  // prvent from csrf attacks
        }
    
        res.cookie("jwt",token,cookieOptions);
        return res.status(201).json({message:"login succesful",admin,token});
    
       }
       catch(error){
          console.log("error in login",error);
          res.status(500).json({errors:"Error in login"});
       }
}
export const adminlogout=async (req,res)=>{
    try{
      if(!req.cookies.jwt){
        return res.status(401).json({errors:"Kindly login first"});
      }
      res.clearCookie("jwt")
      res.status(200).json({message:"Logged out successfully"});
    }
    catch(error){
       console.log("error in login",error);
      res.status(500).json({errors:"Error in logout"});
    }
}