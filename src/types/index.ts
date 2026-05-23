export interface JwtPayload {
  id: number;
  name: string;
  role: string;
}

declare module "express" {
  interface Request {
    user?: JwtPayload;
  }
}
