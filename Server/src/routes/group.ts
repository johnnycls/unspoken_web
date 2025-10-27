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
import {
  handleError,
  validateRequiredField,
  validateStringLength,
  validateEmail,
  validateObjectId,
  sanitizeString,
  removeDuplicates,
} from "../utils/general";

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
      creatorEmail: group.creatorEmail,
    }));

    res.status(200).json(results);
  } catch (error) {
    handleError(error, res);
  }
});

// Create a new group
router.post("/", authMiddleware, async (req: Request, res: Response) => {
  try {
    const userEmail = res.locals.email as string;
    const { name, description, invitedEmails } = req.body;

    if (!validateRequiredField(name, "Group name", res)) return;

    if (!validateStringLength(name, NAME_LENGTH_LIMIT, "Group name", res))
      return;

    if (
      !validateStringLength(
        description,
        DESCRIPTION_LENGTH_LIMIT,
        "Description",
        res
      )
    )
      return;

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

    // Validate email format for all invited emails and remove duplicates
    const uniqueInvitedEmails = removeDuplicates(
      invitedEmailsArray.map((email: string) => email.toLowerCase())
    );

    for (const email of uniqueInvitedEmails) {
      if (!validateEmail(email, "Invited email", res)) return;
    }

    // Remove creator from invited emails if present
    const filteredInvitedEmails = uniqueInvitedEmails
      .filter((email: string) => email !== userEmail.toLowerCase())
      .map((email) => email.trim());

    // Creator is automatically a member
    const group = await Group.create({
      name: sanitizeString(name),
      description: sanitizeString(description || ""),
      creatorEmail: userEmail,
      memberEmails: [userEmail],
      invitedEmails: filteredInvitedEmails,
    });

    res.status(201).json({
      id: group._id,
      message: "Group created successfully",
    });
  } catch (error) {
    handleError(error, res);
  }
});

// Update a group (only creator can update)
router.patch("/", authMiddleware, async (req: Request, res: Response) => {
  try {
    const userEmail = res.locals.email as string;
    const { groupId, name, description, memberEmails, invitedEmails } =
      req.body;

    if (!validateRequiredField(groupId, "Group ID", res)) return;
    if (!validateObjectId(groupId, "Group ID", res)) return;

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
      if (!validateStringLength(name, NAME_LENGTH_LIMIT, "Group name", res))
        return;
      group.name = sanitizeString(name);
    }

    // Update description if provided
    if (description !== undefined) {
      if (
        !validateStringLength(
          description,
          DESCRIPTION_LENGTH_LIMIT,
          "Description",
          res
        )
      )
        return;
      group.description = sanitizeString(description);
    }

    // Update member emails if provided
    if (memberEmails !== undefined) {
      const memberEmailsArray = Array.isArray(memberEmails) ? memberEmails : [];

      // Validate all member emails
      const uniqueMemberEmails = removeDuplicates(
        memberEmailsArray.map((email: string) => email.toLowerCase().trim())
      );

      for (const email of uniqueMemberEmails) {
        if (!validateEmail(email, "Member email", res)) return;
      }

      // Ensure creator is always in member list
      if (!uniqueMemberEmails.includes(userEmail.toLowerCase())) {
        uniqueMemberEmails.push(userEmail.toLowerCase());
      }

      group.memberEmails = uniqueMemberEmails;
    }

    // Update invited emails if provided
    if (invitedEmails !== undefined) {
      const invitedEmailsArray = Array.isArray(invitedEmails)
        ? invitedEmails
        : [];

      // Validate all invited emails
      const uniqueInvitedEmails = removeDuplicates(
        invitedEmailsArray.map((email: string) => email.toLowerCase())
      );

      for (const email of uniqueInvitedEmails) {
        if (!validateEmail(email, "Invited email", res)) return;
      }

      // Remove emails that are already members
      const filteredInvitedEmails = uniqueInvitedEmails.filter(
        (email: string) => !group.memberEmails.includes(email)
      );

      group.invitedEmails = filteredInvitedEmails;
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
    handleError(error, res);
  }
});

// Handle group invitation (accept or decline)
router.post(
  "/invitation",
  authMiddleware,
  async (req: Request, res: Response) => {
    try {
      const userEmail = res.locals.email as string;
      const { id, isAccept } = req.body;

      if (!validateRequiredField(id, "Group ID", res)) return;
      if (!validateObjectId(id, "Group ID", res)) return;

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
      handleError(error, res);
    }
  }
);

// Leave group (for members, not creator)
router.post("/leave", authMiddleware, async (req: Request, res: Response) => {
  try {
    const userEmail = res.locals.email as string;
    const { groupId } = req.body;

    if (!validateRequiredField(groupId, "Group ID", res)) return;
    if (!validateObjectId(groupId, "Group ID", res)) return;

    const group = await Group.findById(groupId);

    if (!group) {
      res.status(404).json({ message: "Group not found" });
      return;
    }

    // Check if user is the creator
    if (group.creatorEmail === userEmail) {
      res.status(403).json({
        message:
          "Creator cannot leave the group. Please delete the group or transfer ownership first.",
      });
      return;
    }

    // Check if user is a member
    if (!group.memberEmails.includes(userEmail)) {
      res.status(403).json({
        message: "You are not a member of this group",
      });
      return;
    }

    // Remove user from memberEmails
    group.memberEmails = group.memberEmails.filter(
      (email) => email !== userEmail
    );

    await group.save();

    res.status(200).json({ message: "Successfully left the group" });
  } catch (error) {
    handleError(error, res);
  }
});

// Delete group (only creator)
router.delete("/", authMiddleware, async (req: Request, res: Response) => {
  try {
    const userEmail = res.locals.email as string;
    const { groupId } = req.body;

    if (!validateRequiredField(groupId, "Group ID", res)) return;
    if (!validateObjectId(groupId, "Group ID", res)) return;

    const group = await Group.findById(groupId);

    if (!group) {
      res.status(404).json({ message: "Group not found" });
      return;
    }

    // Check if user is the creator
    if (group.creatorEmail !== userEmail) {
      res.status(403).json({
        message: "Only the creator can delete this group",
      });
      return;
    }

    await Group.findByIdAndDelete(groupId);

    res.status(200).json({ message: "Group deleted successfully" });
  } catch (error) {
    handleError(error, res);
  }
});

export default router;
