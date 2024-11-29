import express from "express";
import authRoutes from "./routes/auth.route.js";
import productRouter from "./routes/product.route.js";
import bookinRoute from "./routes/booking.route.js";
import galleryRoute from "./routes/gallery.route.js";
import userRoute from "./routes/user.route.js";
import videoRoute from "./routes/video.route.js";
import testimonyRoute from "./routes/testimony.route.js";
import dotenv from "dotenv";
import path from 'path';
import { connectDb } from "./lib/db.js";
import cors from 'cors';


dotenv.config();

const app = express();

app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:5173', 
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

const port = process.env.PORT || 3000;

const __dirname = path.resolve();
// Middleware and routes
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/product", productRouter);
app.use("/api/booking", bookinRoute);
app.use("/api/user", userRoute);
app.use("/api/gallery", galleryRoute);
app.use("/api/video", videoRoute);
app.use("/api/testimony", testimonyRoute);

if(process.env.NODE_ENV === 'production'){
    app.use(express.static(path.join(__dirname, "./frontend/dist")));
    app.get("*", (req, res) => {
        res.sendFile(path.resolve(__dirname, "./frontend/dist", "index.html"));
    });
}

app.listen(port, () => {
    console.log(`Server started on port ${port}`);
    connectDb();
});
