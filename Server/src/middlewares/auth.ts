import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../config";

async function authMiddleware(req: Request, res: Response, next: NextFunction) {
  const token = req.headers.authorization;

  if (!token) {
    res.status(401).json({ msg: "No token, authorization denied" });
    return;
  }
  if (!JWT_SECRET) {
    res.status(500).json({ msg: "No JWT Secret" });
    return;
  }

  // Verify token
  try {
    jwt.verify(token, JWT_SECRET, (error, decoded) => {
      if (error) {
        res.status(401).json({ msg: "Token is not valid" });
        return;
      } else {
        if (typeof decoded === "string" || !decoded?.email) {
          res.status(401).json({ msg: "Token is not valid" });
          return;
        }
        res.locals.email = decoded.email;
        next();
      }
    });
  } catch (err) {
    console.error("Error verifying token:", JSON.stringify(err));
    res.status(500).json({ msg: "Server Error", error: JSON.stringify(err) });
  }
}

export default authMiddleware;
