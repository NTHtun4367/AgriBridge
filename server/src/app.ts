import express, { json } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { ENV } from "./utils/env";
import { connectDB } from "./db/dbConnect";
import farmerRoutes from "./routes/farmer";
import errorHandler from "./middlewares/errorHandler";

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

// error handler
app.use(errorHandler);

app.listen(ENV.PORT, () => {
  // database connection
  connectDB();
  console.log("Server is running at PORT =>", ENV.PORT);
});
