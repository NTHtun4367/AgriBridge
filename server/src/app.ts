import express, { json } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { ENV } from "./shared/utils/env";
import { connectDB } from "./shared/db/dbConnect";
import farmerRoutes from "./modules/auth/routes/farmer";
import merchantRoutes from "./modules/auth/routes/merchant";
import adminRoutes from "./modules/admin/routes/admin";
import marketPriceRoutes from "./modules/market/routes/marketPrice";
import cropRoutes from "./modules/market/routes/crop";
import marketRoutes from "./modules/market/routes/market";
import errorHandler from "./shared/middleware/errorHandler";
import { createServer } from "http";
import { Server } from "socket.io";

const app = express();

// 1. Create the HTTP server using the Express app
const httpServer = createServer(app);

// 2. Initialize Socket.io with the HTTP server
const io = new Server(httpServer, {
  cors: {
    origin: ENV.CLIENT_URL,
    credentials: true,
  },
});
app.set("io", io);

app.use(
  cors({
    origin: ENV.CLIENT_URL,
    credentials: true,
  })
);
app.use(json());
app.use(cookieParser());

// Socket.io Connection Logic
// io.on("connection", (socket) => {
//   console.log("A user connected:", socket.id);

//   socket.on("disconnect", () => {
//     console.log("User disconnected");
//   });
// });

// Routes
app.use("/api/v1", farmerRoutes);
app.use("/api/v1", merchantRoutes);
app.use("/api/v1", adminRoutes);
app.use("/api/v1/market-prices", marketPriceRoutes);
app.use("/api/v1/crops", cropRoutes);
app.use("/api/v1/markets", marketRoutes);

// Error handler
app.use(errorHandler);

// 3. IMPORTANT: Listen via httpServer, NOT app.listen
httpServer.listen(ENV.PORT, () => {
  connectDB();
  console.log(`Server is running at PORT => ${ENV.PORT}`);
});

// Export io if you need to use it in other controllers
export { io };
