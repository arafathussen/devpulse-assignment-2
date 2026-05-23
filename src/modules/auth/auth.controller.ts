import type { Request, Response } from "express";
import jwt from "jsonwebtoken";

import { config } from "../../config/index.js";
import { sendResponse } from "../../utils/sendResponse.js";
import { authService } from "./auth.service.js";

const signup = async (req: Request, res: Response) => {
  try {
    const { name, email, password, role } = req.body;

    const user = await authService.createUser({ name, email, password, role });

    sendResponse(res, { message: "User registered successfully", data: user }, 201);
  } catch (error: any) {
    if (error.code === "23505") {
      sendResponse(res, { message: "Email already exists", errors: "Email must be unique" }, 400);
      return;
    }
    sendResponse(res, { message: error.message, errors: error }, 500);
  }
};

const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    const user = await authService.validateUser(email, password);

    if (!user) {
      sendResponse(res, { message: "Invalid email or password", errors: "Unauthorized" }, 401);
      return;
    }

    const token = jwt.sign(
      { id: user.id, name: user.name, role: user.role },
      config.jwt_secret,
      { expiresIn: "7d" },
    );

    sendResponse(res, {
      message: "Login successful",
      data: { token, user },
    });
  } catch (error: any) {
    sendResponse(res, { message: error.message, errors: error }, 500);
  }
};

export const authController = {
  signup,
  login,
};
