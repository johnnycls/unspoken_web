import express from "express";
import { Router } from "express";
import type { Request, Response } from "express";
import Letter from "../models/letter.model";
import Group from "../models/group.model";
import { LETTER_LENGTH_LIMIT } from "../config";
import authMiddleware from "../middlewares/auth";

const router: Router = express.Router();

// Get all letters where user is sender or recipient
router.get("/", authMiddleware, async (req: Request, res: Response) => {
  try {
    const userEmail = res.locals.email as string;

    // Calculate start of today (00:00:00)
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Find all letters where user is either sender or recipient
    // and letter was sent before today (yesterday or earlier)
    const letters = await Letter.find({
      $or: [{ fromEmail: userEmail }, { toEmail: userEmail }],
      timestamp: { $lt: today },
    });

    const results = letters.map((letter) => ({
      fromGroupId: letter.fromGroupId,
      toEmail: letter.toEmail,
      alias: letter.alias,
      content: letter.content,
      timestamp: letter.timestamp,
    }));

    res.status(200).json(results);
  } catch (error) {
    console.error(JSON.stringify(error));
    res
      .status(500)
      .json({ message: "Internal server error", error: JSON.stringify(error) });
  }
});

// Send a letter
router.post("/", authMiddleware, async (req: Request, res: Response) => {
  try {
    const fromEmail = res.locals.email as string;
    const { fromGroupId, toEmail, alias, content } = req.body;

    // Validate required fields
    if (!fromGroupId) {
      res.status(400).json({ message: "fromGroupId is required" });
      return;
    }

    if (!toEmail) {
      res.status(400).json({ message: "toEmail is required" });
      return;
    }

    if (!content) {
      res.status(400).json({ message: "content is required" });
      return;
    }

    // Validate content length
    if (content.trim().length > LETTER_LENGTH_LIMIT) {
      res.status(400).json({ message: "Content is too long" });
      return;
    }

    if (content.trim() === "") {
      res.status(400).json({ message: "Content cannot be empty" });
      return;
    }

    // Verify that the group exists and user is a member
    const group = await Group.findById(fromGroupId);

    if (!group) {
      res.status(404).json({ message: "Group not found" });
      return;
    }

    if (!group.memberEmails.includes(fromEmail)) {
      res.status(403).json({
        message: "You must be a member of the group to send letters",
      });
      return;
    }

    // Check if user has already sent a letter today
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const lettersToday = await Letter.countDocuments({
      fromEmail,
      timestamp: {
        $gte: today,
        $lt: tomorrow,
      },
    });

    if (lettersToday >= 1) {
      res.status(429).json({
        message: "You can only send 1 letter per day",
      });
      return;
    }

    // Create the letter
    const letter = await Letter.create({
      fromEmail,
      fromGroupId,
      toEmail,
      alias: alias || "",
      content: content.trim(),
      timestamp: new Date(),
    });

    res.status(201).json({
      message: "Letter sent successfully",
      letterId: letter._id,
    });
  } catch (error) {
    console.error(JSON.stringify(error));
    res
      .status(500)
      .json({ message: "Internal server error", error: JSON.stringify(error) });
  }
});

export default router;
