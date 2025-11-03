import express from "express";
import { Router } from "express";
import type { Request, Response } from "express";
import Crush from "../models/crush.model";
import { MESSAGE_LENGTH_LIMIT } from "../config";
import authMiddleware from "../middlewares/auth";
import { getCurrentMonth } from "../utils/time";
import {
  handleError,
  validateRequiredField,
  validateStringLength,
  validateNonEmptyString,
  validateEmail,
  sanitizeString,
} from "../utils/general";

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

    if (!validateRequiredField(toEmail, "toEmail", res)) return;
    if (!validateEmail(toEmail, "toEmail", res)) return;

    // Prevent self-crush
    if (fromEmail.toLowerCase() === toEmail.toLowerCase()) {
      res.status(400).json({
        message: "You cannot create a crush on yourself",
      });
      return;
    }

    if (!validateStringLength(message, MESSAGE_LENGTH_LIMIT, "Message", res))
      return;

    if (!validateNonEmptyString(message, "Message", res)) return;

    // Get current month in YYYY-MM format
    const month = getCurrentMonth(now);

    // Find existing crush for this month
    let crush = await Crush.findOne({ fromEmail, month });

    if (crush) {
      // Update existing crush
      crush.toEmail = toEmail.toLowerCase();
      crush.message = sanitizeString(message);
      await crush.save();
    } else {
      // Create new crush
      crush = await Crush.create({
        fromEmail,
        toEmail: toEmail.toLowerCase(),
        month,
        message: sanitizeString(message),
      });
    }

    res.status(200).json({ message: "Crush saved successfully" });
  } catch (error) {
    handleError(error, res);
  }
});

// Get the crush record where user is the sender for the current month
router.get("/", authMiddleware, async (req: Request, res: Response) => {
  try {
    const userEmail = res.locals.email as string;

    // Check current day to determine what data to show
    const now = new Date();
    const dayOfMonth = now.getDate();
    const canViewResponses = dayOfMonth > 14; // Days 15-31 can view responses
    const currentMonth = getCurrentMonth(now);

    // Get crushes where user is the sender for current month only
    const crush = await Crush.findOne({
      fromEmail: userEmail,
      month: currentMonth,
    });

    if (!crush) {
      res.status(200).json(null);
      return;
    }

    // For days 1-14, return data without checking for mutual crushes
    if (!canViewResponses) {
      res.status(200).json({
        toEmail: crush.toEmail,
        message: crush.message,
        month: crush.month,
        responseMessage: "",
      });
      return;
    }

    // For days 15-31, check for mutual crushes
    const mutualCrush = await Crush.findOne({
      fromEmail: crush.toEmail,
      toEmail: userEmail,
      month: crush.month,
    });

    res.status(200).json({
      toEmail: crush.toEmail,
      message: crush.message,
      month: crush.month,
      responseMessage: mutualCrush ? mutualCrush.message : "",
    });
  } catch (error) {
    handleError(error, res);
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
    handleError(error, res);
  }
});

export default router;
