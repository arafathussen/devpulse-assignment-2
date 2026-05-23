import type { Response } from "express";

export function sendResponse<T>(
  res: Response,
  payload: { message?: string; data?: T; errors?: unknown },
  status = 200,
) {
  const success = status < 400;
  
  const responseData: any = {
    success,
  };

  if (payload.message !== undefined) {
    responseData.message = payload.message;
  }

  if (success) {
    responseData.data = payload.data;
  } else {
    responseData.errors = payload.errors;
  }

  res.status(status).json(responseData);
}
