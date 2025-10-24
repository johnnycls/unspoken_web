import dotenv from "dotenv";
dotenv.config();

// Environment variables
export const PORT = process.env.PORT || 3000;
export const MONGODB_URI = process.env.MONGODB_URI;
export const STRIPE_PRIVATE_KEY = process.env.STRIPE_PRIVATE_KEY;
export const WEB_URL = process.env.WEB_URL;
export const JWT_SECRET = process.env.JWT_SECRET;
export const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;

export const NAME_LENGTH_LIMIT = 20;
export const DESCRIPTION_LENGTH_LIMIT = 300;
export const MESSAGE_LENGTH_LIMIT = 5000;
export const LETTER_LENGTH_LIMIT = 5000;
