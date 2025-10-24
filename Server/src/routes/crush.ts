import express from "express";
import { Router } from "express";
import type { Request, Response } from "express";
import Crush from "../models/crush.model";
import { MESSAGE_LENGTH_LIMIT } from "../config";
import authMiddleware from "../middlewares/auth";

const router: Router = express.Router();

// Create or update crush for current month
router.post("/", authMiddleware, async (req: Request, res: Response) => {
  try {
    const fromEmail = res.locals.email as string;
    const { toEmail, message } = req.body;

    if (!toEmail) {
      res.status(400).json({ message: "toEmail is required" });
      return;
    }

    if (message && message.trim().length > MESSAGE_LENGTH_LIMIT) {
      res.status(400).json({ message: "Message is too long" });
      return;
    }

    if (!message || message.trim() === "") {
      res.status(400).json({ message: "Message cannot be empty" });
      return;
    }

    // Get current month in YYYY-MM format
    const now = new Date();
    const month = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(
      2,
      "0"
    )}`;

    // Find existing crush for this month
    let crush = await Crush.findOne({ fromEmail, toEmail, month });

    if (crush) {
      // Update existing crush
      crush.toEmail = toEmail;
      crush.message = message.trim() || "";
      await crush.save();
    } else {
      // Create new crush
      crush = await Crush.create({
        fromEmail,
        toEmail,
        month,
        message: message.trim() || "",
      });
    }

    res.status(200).json({ message: "Crush saved successfully" });
  } catch (error) {
    console.error(JSON.stringify(error));
    res
      .status(500)
      .json({ message: "Internal server error", error: JSON.stringify(error) });
  }
});

// Get all crush records where user is the sender
router.get("/", authMiddleware, async (req: Request, res: Response) => {
  try {
    const userEmail = res.locals.email as string;

    // Get all crushes where user is the sender
    const crushes = await Crush.find({ fromEmail: userEmail });

    // For each crush, check if there's a mutual crush
    const results = await Promise.all(
      crushes.map(async (crush) => {
        // Find if recipient has also crushed on the user in the same month
        const mutualCrush = await Crush.findOne({
          fromEmail: crush.toEmail,
          toEmail: userEmail,
          month: crush.month,
        });

        return {
          toEmail: crush.toEmail,
          message: crush.message,
          month: crush.month,
          responseMessage: mutualCrush ? mutualCrush.message : "",
        };
      })
    );

    res.status(200).json(results);
  } catch (error) {
    console.error(JSON.stringify(error));
    res
      .status(500)
      .json({ message: "Internal server error", error: JSON.stringify(error) });
  }
});

export default router;
