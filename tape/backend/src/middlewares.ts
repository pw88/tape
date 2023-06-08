import { Request, Response, NextFunction } from "express";
import { sql } from "./db";

declare global {
  namespace Express {
    interface Request {
      user?: User;
    }
  }
}

export async function attachUser(
  req: Request,
  res: Response,
  next: NextFunction
) {
  if (!req.headers.authorization) return next();
  const [user]: [User?] = await sql`SELECT users.* FROM login_sessions 
              JOIN users ON login_sessions.user_id = users.user_id 
              WHERE session_token = ${req.headers.authorization}`;
  if (!user) return res.status(401).json({ message: "Unauthorized" });
  req.user = user;
  console.log(req.user);
  return next();
}
