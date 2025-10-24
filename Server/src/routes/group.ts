import express from "express";
import { Router } from "express";
import type { Request, Response } from "express";
import Group from "../models/group.model";
import {
  NAME_LENGTH_LIMIT,
  DESCRIPTION_LENGTH_LIMIT,
  MAX_GROUPS_PER_USER,
  MAX_TOTAL_MEMBERS,
} from "../config";
import authMiddleware from "../middlewares/auth";

const router: Router = express.Router();

// Get all groups where user is member or invited
router.get("/", authMiddleware, async (req: Request, res: Response) => {
  try {
    const userEmail = res.locals.email as string;

    // Find all groups where user is in memberEmails or invitedEmails
    const groups = await Group.find({
      $or: [{ memberEmails: userEmail }, { invitedEmails: userEmail }],
    });

    const results = groups.map((group) => ({
      id: group._id,
      name: group.name,
      description: group.description,
      memberEmails: group.memberEmails,
      invitedEmails: group.invitedEmails,
    }));

    res.status(200).json(results);
  } catch (error) {
    console.error(JSON.stringify(error));
    res
      .status(500)
      .json({ message: "Internal server error", error: JSON.stringify(error) });
  }
});

// Create a new group
router.post("/", authMiddleware, async (req: Request, res: Response) => {
  try {
    const userEmail = res.locals.email as string;
    const { name, description, invitedEmails } = req.body;

    if (!name) {
      res.status(400).json({ message: "Group name is required" });
      return;
    }

    if (name.length > NAME_LENGTH_LIMIT) {
      res.status(400).json({ message: "Group name is too long" });
      return;
    }

    if (description && description.length > DESCRIPTION_LENGTH_LIMIT) {
      res.status(400).json({ message: "Description is too long" });
      return;
    }

    // Check if user has already created 10 groups
    const userGroupCount = await Group.countDocuments({
      creatorEmail: userEmail,
    });

    if (userGroupCount >= MAX_GROUPS_PER_USER) {
      res.status(400).json({
        message: `You can only create up to ${MAX_GROUPS_PER_USER} groups`,
      });
      return;
    }

    // Validate invited emails
    const invitedEmailsArray = Array.isArray(invitedEmails)
      ? invitedEmails
      : [];

    if (invitedEmailsArray.length > MAX_TOTAL_MEMBERS - 1) {
      res.status(400).json({
        message: `You can only invite up to ${MAX_TOTAL_MEMBERS - 1} members`,
      });
      return;
    }

    // Creator is automatically a member
    const group = await Group.create({
      name,
      description: description || "",
      creatorEmail: userEmail,
      memberEmails: [userEmail],
      invitedEmails: invitedEmailsArray,
    });

    res.status(201).json({
      id: group._id,
      message: "Group created successfully",
    });
  } catch (error) {
    console.error(JSON.stringify(error));
    res
      .status(500)
      .json({ message: "Internal server error", error: JSON.stringify(error) });
  }
});

// Update a group (only creator can update)
router.patch(
  "/:groupId",
  authMiddleware,
  async (req: Request, res: Response) => {
    try {
      const userEmail = res.locals.email as string;
      const { groupId } = req.params;
      const { name, description, memberEmails, invitedEmails } = req.body;

      const group = await Group.findById(groupId);

      if (!group) {
        res.status(404).json({ message: "Group not found" });
        return;
      }

      // Only creator can update the group
      if (group.creatorEmail !== userEmail) {
        res.status(403).json({
          message: "Only the group creator can update this group",
        });
        return;
      }

      // Update name if provided
      if (name !== undefined) {
        if (name.length > NAME_LENGTH_LIMIT) {
          res.status(400).json({ message: "Group name is too long" });
          return;
        }
        group.name = name;
      }

      // Update description if provided
      if (description !== undefined) {
        if (description.length > DESCRIPTION_LENGTH_LIMIT) {
          res.status(400).json({ message: "Description is too long" });
          return;
        }
        group.description = description;
      }

      // Update member emails if provided
      if (memberEmails !== undefined) {
        const memberEmailsArray = Array.isArray(memberEmails)
          ? memberEmails
          : [];
        group.memberEmails = memberEmailsArray;
      }

      // Update invited emails if provided
      if (invitedEmails !== undefined) {
        const invitedEmailsArray = Array.isArray(invitedEmails)
          ? invitedEmails
          : [];
        group.invitedEmails = invitedEmailsArray;
      }

      const totalCount = group.memberEmails.length + group.invitedEmails.length;
      if (totalCount > MAX_TOTAL_MEMBERS) {
        res.status(400).json({
          message: `Total members and invited members cannot exceed ${MAX_TOTAL_MEMBERS}`,
        });
        return;
      }

      await group.save();

      res.status(200).json({ message: "Group updated successfully" });
    } catch (error) {
      console.error(JSON.stringify(error));
      res.status(500).json({
        message: "Internal server error",
        error: JSON.stringify(error),
      });
    }
  }
);

// Handle group invitation (accept or decline)
router.post(
  "/invitation",
  authMiddleware,
  async (req: Request, res: Response) => {
    try {
      const userEmail = res.locals.email as string;
      const { id, isAccept } = req.body;

      if (!id) {
        res.status(400).json({ message: "Group ID is required" });
        return;
      }

      if (isAccept === undefined) {
        res.status(400).json({ message: "isAccept is required" });
        return;
      }

      const group = await Group.findById(id);

      if (!group) {
        res.status(404).json({ message: "Group not found" });
        return;
      }

      // Check if user is actually invited
      if (!group.invitedEmails.includes(userEmail)) {
        res.status(403).json({
          message: "You are not invited to this group",
        });
        return;
      }

      if (isAccept) {
        // Accept invitation: move from invitedEmails to memberEmails
        group.invitedEmails = group.invitedEmails.filter(
          (email) => email !== userEmail
        );

        if (!group.memberEmails.includes(userEmail)) {
          group.memberEmails.push(userEmail);
        }

        await group.save();
        res.status(200).json({ message: "Invitation accepted" });
      } else {
        // Decline invitation: remove from invitedEmails
        group.invitedEmails = group.invitedEmails.filter(
          (email) => email !== userEmail
        );

        await group.save();
        res.status(200).json({ message: "Invitation declined" });
      }
    } catch (error) {
      console.error(JSON.stringify(error));
      res.status(500).json({
        message: "Internal server error",
        error: JSON.stringify(error),
      });
    }
  }
);

export default router;
