import express, { json } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { ENV } from "./utils/env";
import { connectDB } from "./db/dbConnect";

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

app.listen(ENV.PORT, () => {
  // database connection
  connectDB();
  console.log("Server is running at PORT =>", ENV.PORT);
});
