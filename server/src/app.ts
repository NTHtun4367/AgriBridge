import express, { json } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { ENV } from "./shared/utils/env";
import { connectDB } from "./shared/db/dbConnect"
import farmerRoutes from "./modules/auth/routes/farmer";
import merchantRoutes from "./modules/auth/routes/merchant";
import adminRoutes from "./modules/admin/routes/admin";
import errorHandler from "./shared/middleware/errorHandler";

const app = express();

app.use(
  cors({
    origin: ENV.CLIENT_URL,
    credentials: true,
  })
);
app.use(json());
app.use(cookieParser());

// routes
app.use("/api/v1", farmerRoutes);
app.use("/api/v1", merchantRoutes);
app.use("/api/v1", adminRoutes);

// error handler
app.use(errorHandler);

app.listen(ENV.PORT, () => {
  // database connection
  connectDB();
  console.log("Server is running at PORT =>", ENV.PORT);
});
