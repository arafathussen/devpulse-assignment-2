import type { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

import { config } from "../config/index.js";
import type { JwtPayload } from "../types/index.js";

const auth = (req: Request, res: Response, next: NextFunction) => {
  const token = req.headers.authorization;

  if (!token) {
    res.status(401).json({
      success: false,
      message: "Access denied. No token provided.",
      errors: "Unauthorized",
    });
    return;
  }

  try {
    const decoded = jwt.verify(token, config.jwt_secret) as JwtPayload;
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({
      success: false,
      message: "Invalid or expired token.",
      errors: "Unauthorized",
    });
  }
};

export default auth;
