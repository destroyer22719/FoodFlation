import dotenv from "dotenv";
dotenv.config();

export const API_URL = process.env.API_URL ? process.env.API_URL : "http://localhost:4000";
export const SENTRY_DSN = process.env.SENTRY_DSN ? process.env.SENTRY_DSN : "";