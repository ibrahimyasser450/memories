import express from "express";
import cors from "cors";
import "dotenv/config";
import http from "http";
import helmet from "helmet";
import compression from "compression";
import cookieParser from "cookie-parser";
import connectCloudinary from "./config/cloudinary.js";
import connectDB from "./config/mongodb.js";
import postRoutes from "./routes/posts.js";
import userRoutes from "./routes/users.js";

const app = express();
const server = http.createServer(app);
const port = process.env.PORT || 3000;
connectDB();
connectCloudinary();

// midlewares
app.use(express.json({ limit: "30mb" }));
app.use(express.urlencoded({ limit: "30mb", extended: true }));
const allowedOrigins = ["http://localhost:5173", process.env.FRONTEND_URL];
app.use(cors({ origin: allowedOrigins, credentials: true }));

// set security HTTP headers
app.use(helmet());

// Compress all responses [compress all the text that we send to the client]
app.use(compression());
app.use(cookieParser());

app.use("/posts", postRoutes);
app.use("/user", userRoutes);

app.get("/test", (req, res) => {
  res.send("api working");
});

if (process.env.NODE_ENV !== "production") {
  server.listen(port, () => console.log("server started", port));
}

export default server;
