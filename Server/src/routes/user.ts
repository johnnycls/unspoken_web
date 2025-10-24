import express from "express";
import { Router } from "express";
import type { Request, Response } from "express";
import User from "../models/user.model";
import { OAuth2Client } from "google-auth-library";
import jwt from "jsonwebtoken";
import { GOOGLE_CLIENT_ID, JWT_SECRET, NAME_LENGTH_LIMIT } from "../config";
import authMiddleware from "../middlewares/auth";

const router: Router = express.Router();

const client = new OAuth2Client(GOOGLE_CLIENT_ID);

async function verifyGoogleToken(token: string) {
  try {
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: GOOGLE_CLIENT_ID,
    });
    return { payload: ticket.getPayload() };
  } catch (error) {
    console.log(JSON.stringify(error));
    return { error: "Invalid user detected. Please try again" };
  }
}

// register/login;
router.post("/login", async (req: Request, res: Response) => {
  try {
    const { credential } = req?.body?.credentials;
    if (credential) {
      const verificationResponse = await verifyGoogleToken(credential);

      if (verificationResponse.error) {
        res.status(400).json({
          message: verificationResponse.error,
        });
        return;
      }

      const email = verificationResponse?.payload?.email;
      let user = await User.findOne({ email });

      if (!user) {
        await User.create({ email });
      }

      if (JWT_SECRET) {
        const token = jwt.sign({ email }, JWT_SECRET, {
          expiresIn: "30d",
        });
        res.status(200).json({ token });
      } else {
        res.status(500).json("No JWT Secret");
      }
    }
  } catch (error) {
    console.log(JSON.stringify(error));
    res
      .status(500)
      .json({ message: "Internal server error", error: JSON.stringify(error) });
  }
});

// Get user profile
router.get("/", authMiddleware, async (req: Request, res: Response) => {
  try {
    const email = res.locals.email as string;
    const user = await User.findOne({ email });

    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    res.status(200).json({
      email: user.email,
      name: user.name || "",
      lang: user.lang || "",
    });
  } catch (error) {
    console.error(JSON.stringify(error));
    res
      .status(500)
      .json({ message: "Internal server error", error: JSON.stringify(error) });
  }
});

// Update user profile
router.patch("/", authMiddleware, async (req: Request, res: Response) => {
  try {
    const email = res.locals.email as string;
    const { name, lang } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    // Update basic profile fields
    if (name !== undefined && name.length <= NAME_LENGTH_LIMIT)
      user.name = name;
    if (lang !== undefined) user.lang = lang;

    await user.save();

    res.status(200).json({ message: "Profile updated" });
  } catch (error) {
    console.error(JSON.stringify(error));
    res.status(500).json({
      message: "Internal server error",
      error: JSON.stringify(error),
    });
  }
});

export default router;
