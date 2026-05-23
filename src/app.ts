import cors from "cors";
import express, { type Application, type Request, type Response } from "express";

import globalErrorHandler from "./middleware/globalErrorHandler.js";
import authRoute from "./modules/auth/auth.route.js";
import issueRoute from "./modules/issues/issue.route.js";

const app: Application = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req: Request, res: Response) => {
  res.status(200).json({
    message: "DevPulse API is running!",
    author: "DevPulse",
  });
});

app.use("/api/auth", authRoute);
app.use("/api/issues", issueRoute);

app.use(globalErrorHandler);

app.use((req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
  });
});

export default app;
