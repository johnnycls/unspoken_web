import dotenv from "dotenv";
dotenv.config();

// Environment variables
export const PORT = process.env.PORT || 3000;
export const MONGODB_URI = process.env.MONGODB_URI;
export const WEB_URL = process.env.WEB_URL;
export const JWT_SECRET = process.env.JWT_SECRET;
export const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;

export const NAME_LENGTH_LIMIT = 20;
export const DESCRIPTION_LENGTH_LIMIT = 300;
export const MESSAGE_LENGTH_LIMIT = 25000;
export const LETTER_LENGTH_LIMIT = 25000;
export const MAX_GROUPS_PER_USER = 10;
export const MAX_TOTAL_MEMBERS = 250;
