import express from "express";
import authRoutes from "./src/routes/auth.route.js";
import productRouter from "./src/routes/product.route.js";
import bookinRoute from "./src/routes/booking.route.js";
import galleryRoute from "./src/routes/gallery.route.js";
import userRoute from "./src/routes/user.route.js";
import videoRoute from "./src/routes/video.route.js";
import testimonyRoute from "./src/routes/testimony.route.js";
import dotenv from "dotenv";
import path from 'path';
import { connectDb } from "./src/lib/db.js";
import cors from 'cors';

dotenv.config();

const app = express();

// Set CORS based on the environment
const allowedOrigins = process.env.NODE_ENV === 'production'
    ? [process.env.FRONTEND_URL] // Production frontend URL
    : ['http://localhost:5173']; // Development frontend URL

app.use(cors({
    origin: allowedOrigins,
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

// Serve static files in production
// Uncomment the following code if you're serving static assets
// if (process.env.NODE_ENV === 'production') {
//     app.use(express.static(path.join(__dirname, "./frontend/dist")));
//     app.get("*", (req, res) => {
//         res.sendFile(path.resolve(__dirname, "./frontend/dist", "index.html"));
//     });
// }

app.listen(port, () => {
    console.log(`Server started on port ${port}, ${process.env.FRONTEND_URL}`);
    connectDb();
});
