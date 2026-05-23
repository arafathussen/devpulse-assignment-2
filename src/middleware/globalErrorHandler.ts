import type { NextFunction, Request, Response } from "express";

const globalErrorHandler = (
  error: any,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const statusCode = error.statusCode || error.status || 500;

  let errorDetails = "Error details";
  if (error instanceof Error) {
    errorDetails = error.name;
  } else if (typeof error === "string") {
    errorDetails = error;
  } else if (error && error.type) {
    errorDetails = error.type;
  }

  res.status(statusCode).json({
    success: false,
    message: error.message || "Internal server error",
    errors: errorDetails,
  });
};

export default globalErrorHandler;
