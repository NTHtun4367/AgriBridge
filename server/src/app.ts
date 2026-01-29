import express, { json } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import helmet from "helmet"; // New
import hpp from "hpp"; // New
import rateLimit from "express-rate-limit"; // New
import { createServer } from "http";
import { Server } from "socket.io";

import { ENV } from "./shared/utils/env";
import { connectDB } from "./shared/db/dbConnect";
import authRoutes from "./modules/auth/routes/auth";
import adminRoutes from "./modules/admin/routes/admin";
import marketRoutes from "./modules/market/routes/market";
import farmerRoutes from "./modules/farmer/routes/farmer";
import merchantRoutes from "./modules/merchant/routes/merchant";
import entriesRoutes from "./modules/entry/routes/entry";
import preorderRoutes from "./modules/preorder/routes/preorder";
import notificationRoutes from "./modules/notification/routes/notification";
import disputeRoutes from "./modules/notification/routes/dispute";
import reportsRoutes from "./modules/entry/routes/report";
import errorHandler from "./shared/middleware/errorHandler";

const app = express();
const httpServer = createServer(app);

// --- 1. Security Headers & Protection ---
app.use(helmet()); // Protects against well-known web vulnerabilities
app.use(hpp()); // Protects against HTTP Parameter Pollution

// --- 2. CORS Configuration ---
const corsOptions = {
  origin: ENV.CLIENT_URL,
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
  allowedHeaders: ["Content-Type", "Authorization"],
};
app.use(cors(corsOptions));

// --- 3. Rate Limiting ---
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per window
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false,
  message: "Too many requests from this IP, please try again after 15 minutes",
});
// Apply to all routes, or specifically to /api/v1/auth
app.use("/api", limiter);

// --- 4. Request Parsing & Body Limits ---
app.use(json({ limit: "10kb" })); // Protection against Large Payload DoS
app.use(cookieParser());

// --- 5. Socket.io with Security ---
const io = new Server(httpServer, {
  cors: corsOptions, // Reuse the same secure CORS config
});
app.set("io", io);

// --- 6. Routes ---
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1", adminRoutes);
app.use("/api/v1/markets", marketRoutes);
app.use("/api/v1/farmers", farmerRoutes);
app.use("/api/v1/invoices", merchantRoutes);
app.use("/api/v1/entries", entriesRoutes);
app.use("/api/v1/preorder", preorderRoutes);
app.use("/api/v1/notifications", notificationRoutes);
app.use("/api/v1/disputes", disputeRoutes);
app.use("/api/v1", reportsRoutes);

// --- 7. Error Handling ---
// Must be after routes
app.use(errorHandler);

// --- 8. Server Initialization ---
httpServer.listen(ENV.PORT, () => {
  connectDB();
  console.log(`Server running at PORT => ${ENV.PORT}`);
});

export { io };
