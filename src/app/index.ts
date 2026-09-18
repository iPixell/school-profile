import express from "express";
import cors from "cors";
import pinoHttp from "pino-http";
import helmet from "helmet";

import { logger } from "../utils/logger.js";
import { errorHandler } from "../middlewares/error.middleware.js";
import { prisma } from "../config/prisma.js";

import authRoute from "../routes/auth.route.js";
import schoolProfileRoute from "../routes/schoolProfile.route.js";
import staffRoute from "../routes/staff.route.js";
import principalHistoryRoute from "../routes/principalHistory.route.js";
import achievementRoute from "../routes/achievement.route.js";
import extracurricularRoute from "../routes/extracurricular.route.js";
import extracurricularMediaRoute from "../routes/extracurricularMedia.route.js";
import facilityRoute from "../routes/facility.route.js";
import spmbRoute from "../routes/spmb.route.js";
import contactRoute from "../routes/contact.route.js";
import socialMediaRoute from "../routes/socialMedia.route.js";

const app = express();
const PORT = Number(process.env.PORT) || 3000;

// Register Middleware
app.use(express.json());
const frontendUrl = process.env.FRONTEND_URL;

if (!frontendUrl) {
 throw new Error("FRONTEND_URL belum dikonfigurasi");
}

app.use(
 cors({
  origin: frontendUrl,
 }),
);
app.use(helmet());
app.use(pinoHttp({ logger }));

// Routes
app.use("/api/auth", authRoute);
app.use("/api/school-profile", schoolProfileRoute);
app.use("/api/staff", staffRoute);
app.use("/api/principal-histories", principalHistoryRoute);
app.use("/api/achievements", achievementRoute);
app.use("/api/extracurriculars", extracurricularRoute);
app.use("/api/extracurriculars", extracurricularMediaRoute);
app.use("/api/facilities", facilityRoute);
app.use("/api/spmb", spmbRoute);
app.use("/api/contacts", contactRoute);
app.use("/api/social-medias", socialMediaRoute);

// Root
app.get("/", (_req, res) => {
 res.json({
  message: "School Profile API is running",
 });
});

// Test database
app.get("/test-db", async (_req, res) => {
 try {
  await prisma.$queryRaw`SELECT 1`;

  res.json({
   message: "Database connected successfully",
  });
 } catch (error) {
  logger.error(error);

  res.status(500).json({
   message: "Database connection failed",
  });
 }
});

// Handle invalid JSON
app.use(
 (
  error: unknown,
  _req: express.Request,
  res: express.Response,
  next: express.NextFunction,
 ): void => {
  if (
   error instanceof SyntaxError &&
   "status" in error &&
   error.status === 400 &&
   "body" in error
  ) {
   logger.warn(
    {
     event: "JSON_PARSE_ERROR",
     error: error.message,
    },
    "Menerima format JSON yang tidak valid",
   );

   res.status(400).json({
    success: false,
    message: "Format data JSON tidak valid.",
   });

   return;
  }

  next(error);
 },
);

// Error Handler
app.use(errorHandler);

// Start Server
const server = app.listen(PORT, () => {
 const address = server.address();
 const actualPort = typeof address === "string" ? address : address?.port;

 logger.info(
  {
   event: "SERVER_START",
   port: actualPort,
  },
  `Server berjalan di http://localhost:${actualPort}`,
 );
});

// Handle port conflict
server.on("error", (error: NodeJS.ErrnoException) => {
 if (error.code === "EADDRINUSE") {
  logger.fatal(
   {
    event: "PORT_CLASH",
    port: PORT,
   },
   `Port ${PORT} sudah digunakan aplikasi lain`,
  );

  process.exit(1);
 }
});

export default app;
