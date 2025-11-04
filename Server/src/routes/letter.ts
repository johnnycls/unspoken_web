import express from "express";
import { Router } from "express";
import type { Request, Response } from "express";
import Letter from "../models/letter.model";
import Group from "../models/group.model";
import { LETTER_LENGTH_LIMIT } from "../config";
import authMiddleware from "../middlewares/auth";
import {
  handleError,
  validateRequiredField,
  validateStringLength,
  validateNonEmptyString,
  validateEmail,
  validateObjectId,
  sanitizeString,
} from "../utils/general";

const router: Router = express.Router();

// Get all letters where user is sender or recipient
router.get("/", authMiddleware, async (req: Request, res: Response) => {
  try {
    const userEmail = res.locals.email as string;

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const halfwayToday = new Date();
    halfwayToday.setHours(12, 0, 0, 0);

    // Find all letters where user is either sender or recipient
    const letters = await Letter.find({
      $or: [
        { fromEmail: userEmail },
        {
          toEmail: userEmail,
          timestamp: { $lt: new Date() > halfwayToday ? halfwayToday : today },
        },
      ],
    }).sort({ timestamp: -1 });

    const results = letters.map((letter) => ({
      id: letter._id,
      fromGroupId: letter.fromGroupId,
      toEmail: letter.toEmail,
      alias: letter.alias,
      content: letter.content,
      replyContent: letter.replyContent,
      replyTimestamp: letter.replyTimestamp,
      timestamp: letter.timestamp,
    }));

    res.status(200).json(results);
  } catch (error) {
    handleError(error, res);
  }
});

// Send a letter
router.post("/", authMiddleware, async (req: Request, res: Response) => {
  try {
    const fromEmail = res.locals.email as string;
    const { fromGroupId, toEmail, alias, content } = req.body;

    // Validate required fields
    if (!validateRequiredField(fromGroupId, "fromGroupId", res)) return;
    if (!validateObjectId(fromGroupId, "fromGroupId", res)) return;
    if (!validateRequiredField(toEmail, "toEmail", res)) return;
    if (!validateEmail(toEmail, "toEmail", res)) return;
    if (!validateRequiredField(content, "content", res)) return;
    if (fromEmail.toLowerCase() === toEmail.toLowerCase()) {
      res.status(400).json({ message: "You cannot send a letter to yourself" });
      return;
    }

    // Validate content length
    if (!validateStringLength(content, LETTER_LENGTH_LIMIT, "Content", res))
      return;

    if (!validateNonEmptyString(content, "Content", res)) return;

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

    if (lettersToday >= 2) {
      res.status(429).json({
        message: "You can only send 2 letters per day",
      });
      return;
    }

    // Create the letter
    const letter = await Letter.create({
      fromEmail,
      fromGroupId,
      toEmail: toEmail.toLowerCase(),
      alias: sanitizeString(alias || ""),
      content: sanitizeString(content),
      timestamp: new Date(),
    });

    res.status(201).json({
      message: "Letter sent successfully",
      id: letter._id,
    });
  } catch (error) {
    handleError(error, res);
  }
});

// Reply to a letter
router.post(
  "/:id/reply",
  authMiddleware,
  async (req: Request, res: Response) => {
    try {
      const userEmail = res.locals.email as string;
      const { id } = req.params;
      const { content } = req.body;

      // Validate letter ID
      if (!validateObjectId(id, "Letter ID", res)) return;

      // Validate required fields
      if (!validateRequiredField(content, "content", res)) return;

      // Validate content length
      if (!validateStringLength(content, LETTER_LENGTH_LIMIT, "Content", res))
        return;

      if (!validateNonEmptyString(content, "Content", res)) return;

      // Find the letter
      const letter = await Letter.findById(id);

      if (!letter) {
        res.status(404).json({ message: "Letter not found" });
        return;
      }

      // Check if user is the recipient
      if (letter.toEmail.toLowerCase() !== userEmail.toLowerCase()) {
        res.status(403).json({
          message: "You can only reply to letters sent to you",
        });
        return;
      }

      // Check if reply already exists
      if (letter.replyContent && letter.replyContent.trim() !== "") {
        res.status(400).json({
          message: "This letter has already been replied to",
        });
        return;
      }

      // Update the letter with reply
      letter.replyContent = sanitizeString(content);
      letter.replyTimestamp = new Date();
      await letter.save();

      res.status(200).json({
        message: "Reply sent successfully",
        letterId: letter._id,
      });
    } catch (error) {
      handleError(error, res);
    }
  }
);

export default router;
