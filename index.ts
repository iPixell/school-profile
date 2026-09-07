import express from "express";
import { prisma } from "./src/config/prisma";
import authRoute from "./src/routes/auth.route.js";

const app = express();

app.use(express.json());
app.use("/api/auth", authRoute);

app.get("/", (req, res) => {
 res.json({
  message: "School Profile API is running",
 });
});

app.get("/test-db", async (req, res) => {
 try {
  await prisma.$queryRaw`SELECT 1`;

  res.json({
   message: "Database connected successfully",
  });
 } catch (error) {
  console.error(error);

  res.status(500).json({
   message: "Database connection failed",
  });
 }
});

app.listen(3000, () => {
 console.log("Server running on http://localhost:3000");
});
