
import { Order } from "../models/order.model.js";
import { Purchase } from "../models/purchase.model.js";
export const orderData = async (req, res) => {
    const order=req.body;

    try {
        const orderInfo = await Order.create(order);
        console.log(orderInfo);
        const userId= orderInfo?.userid;
        const courseId=orderInfo?.courseid;
        res.status(201).json({message:"order placed successfully",orderInfo})
        if(orderInfo){
            await Purchase.create({
                userId,
                courseId
            })
        }
    } catch (error) {
        console.log("Errors in order data:", error);
        res.status(500).json({error:"Error in order data"})
    }

};