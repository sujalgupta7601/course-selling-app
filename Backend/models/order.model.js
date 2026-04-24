import mongoose from "mongoose";
const orderSchema = new mongoose.Schema({
    email: String,
    userid: String,
    courseid: String,
    paymentid: String,
    amount: Number,
    status: String
})

export const Order = mongoose.model("Order",orderSchema)