import bcrypt from "bcrypt";

import { pool } from "../../db/index.js";

const SALT_ROUNDS = 10;

const createUser = async (payload: {
  name: string;
  email: string;
  password: string;
  role: string;
}) => {
  const hashedPassword = await bcrypt.hash(payload.password, SALT_ROUNDS);

  const result = await pool.query(
    `INSERT INTO users (name, email, password, role)
     VALUES ($1, $2, $3, $4)
     RETURNING id, name, email, role, created_at, updated_at`,
    [payload.name, payload.email, hashedPassword, payload.role || "contributor"],
  );

  return result.rows[0];
};

const getUserByEmail = async (email: string) => {
  const result = await pool.query(
    `SELECT * FROM users WHERE email = $1`,
    [email],
  );

  return result.rows[0] || null;
};

const validateUser = async (email: string, password: string) => {
  const user = await getUserByEmail(email);

  if (!user) return null;

  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) return null;

  const { password: _, ...userWithoutPassword } = user;

  return userWithoutPassword;
};

export const authService = {
  createUser,
  getUserByEmail,
  validateUser,
};
