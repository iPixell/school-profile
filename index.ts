import express from "express";
import { prisma } from "./src/config/prisma";
import authRoute from "./src/routes/auth.route.js";
import schoolProfileRoute from "./src/routes/schoolProfile.route.js";
import staffRoute from "./src/routes/staff.route.js";
import achievementRoute from "./src/routes/achievement.route.js";
import extracurricularRoute from "./src/routes/extracurricular.route.js";
import facilityRoute from "./src/routes/facility.route.js";
import spmbRoute from "./src/routes/spmb.route.js";
import contactRoute from "./src/routes/contact.route.js";

const app = express();

app.use(express.json());
app.use("/api/auth", authRoute);
app.use("/api/school-profile", schoolProfileRoute);
app.use("/api/staff", staffRoute);
app.use("/api/achievements", achievementRoute);
app.use("/api/extracurriculars", extracurricularRoute);
app.use("/api/facilities", facilityRoute);
app.use("/api/spmb", spmbRoute);
app.use("/api/contact", contactRoute);

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
