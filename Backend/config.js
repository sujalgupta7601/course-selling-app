import dotenv from "dotenv"
dotenv.config();


export default {
    JWT_USER_PASSWORD:process.env.JWT_USER_PASSWORD,
    JWT_ADMIN_PASSWORD:process.env.JWT_ADMIN_PASSWORD,
    STRIPE_SECRET_KEY:process.env.stripe_secret_key
}