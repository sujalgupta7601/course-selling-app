import dotenv from "dotenv";
dotenv.config();
import jwt from "jsonwebtoken"

function userMiddleware(req,res,next){
    const authHeader = req.headers.authorization;
    console.log("middle")
    if(!authHeader || !authHeader.startsWith("Bearer ")){
        return res.status(401).json({errors:"No token provided"});
    }

    const token=authHeader.split(" ")[1];
    try{
        const decoded=jwt.verify(token, process.env.JWT_USER_PASSWORD);
        req.userId=decoded.id;
        next();
    }
    catch(error){
        console.log("Invalid token or expried token",error);
    }
}

export default userMiddleware;