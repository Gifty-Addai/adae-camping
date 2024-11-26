import express from "express";
import authRoutes from "./routes/auth.route.js";
import productRouter from "./routes/product.route.js";
import bookinRoute from "./routes/booking.route.js";
import galleryRoute from "./routes/gallery.route.js";
import userRoute from "./routes/user.route.js";
import videoRoute from "./routes/video.route.js";
import testimonyRoute from "./routes/testimony.route.js";
import dotenv from "dotenv";
import { connectDb } from "./lib/db.js";

dotenv.config();

const app = express();

// Middleware and routes
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/product", productRouter);
app.use("/api/booking", bookinRoute);
app.use("/api/user", userRoute);
app.use("/api/gallery", galleryRoute);
app.use("/api/video", videoRoute);
app.use("/api/testimony", testimonyRoute);

// Connect to the database
connectDb();

// Export the app to work with Vercel's serverless functions
export default app;
