import express from "express";
import { Router } from "express";
import type { Request, Response } from "express";
import Crush from "../models/crush.model";
import { MESSAGE_LENGTH_LIMIT } from "../config";
import authMiddleware from "../middlewares/auth";
import { getCurrentMonth } from "../utils/time";

const router: Router = express.Router();

// Create or update crush for current month
router.post("/", authMiddleware, async (req: Request, res: Response) => {
  try {
    const fromEmail = res.locals.email as string;
    const { toEmail, message } = req.body;

    // Check if current day is within submission period (1-14)
    const now = new Date();
    const dayOfMonth = now.getDate();

    if (dayOfMonth > 14) {
      res.status(403).json({
        message:
          "Crush submissions are only allowed from day 1-14 of each month",
      });
      return;
    }

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
    const month = getCurrentMonth(now);

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

    // Check current day to determine what data to show
    const now = new Date();
    const dayOfMonth = now.getDate();
    const canViewResponses = dayOfMonth > 14; // Days 15-31 can view responses
    const currentMonth = getCurrentMonth(now);

    // Get crushes where user is the sender for current month only
    const crushes = await Crush.find({
      fromEmail: userEmail,
      month: currentMonth,
    });

    // For days 1-14, return data without checking for mutual crushes
    if (!canViewResponses) {
      const results = crushes.map((crush) => ({
        toEmail: crush.toEmail,
        message: crush.message,
        month: crush.month,
        responseMessage: "",
      }));
      res.status(200).json(results);
      return;
    }

    // For days 15-31, check for mutual crushes
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

// Delete crush record for current month
router.delete("/", authMiddleware, async (req: Request, res: Response) => {
  try {
    const fromEmail = res.locals.email as string;

    // Check if current day is within submission period (1-14)
    const now = new Date();
    const dayOfMonth = now.getDate();

    if (dayOfMonth > 14) {
      res.status(403).json({
        message: "Crush can only be deleted from day 1-14 of each month",
      });
      return;
    }

    // Get current month in YYYY-MM format
    const month = getCurrentMonth(now);

    // Find existing crush for this month
    const crush = await Crush.findOne({ fromEmail, month });

    if (!crush) {
      res
        .status(404)
        .json({ message: "No crush record found for current month" });
      return;
    }

    // Delete the crush
    await Crush.deleteOne({ fromEmail, month });

    res.status(200).json({ message: "Crush deleted successfully" });
  } catch (error) {
    console.error(JSON.stringify(error));
    res
      .status(500)
      .json({ message: "Internal server error", error: JSON.stringify(error) });
  }
});

export default router;
