import express, { Request, Response } from "express";
import connectDB from "./config/db";
import authRoutes from "./routes/authRoutes";
import dotenv from "dotenv";
import cors from "cors";
dotenv.config();
const app = express();

app.use(express.json());
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);
connectDB();

app.use("/api/auth", authRoutes);

app.use((err: Error, req: Request, res: Response) => {
  console.error(err.stack);
  res.status(500).json({
    message: "Something went wrong!",
    error: process.env.NODE_ENV === "development" ? err.message : undefined,
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
