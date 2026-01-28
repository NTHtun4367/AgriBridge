// controllers/entry.controller.ts
import { Response } from "express";
import { AuthRequest } from "../../../shared/middleware/authMiddleware";
import asyncHandler from "../../../shared/utils/asyncHandler";
import { entryService } from "../services/entry";

export const getEntryStats = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const userId = req.user?._id;
    if (!userId) throw new Error("Unauthorized");

    const stats = await entryService.getStatsByCategory(userId.toString());

    res.status(200).json({
      success: true,
      data: stats,
    });
  },
);

export const createEntry = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const userId = req.user?._id;
    const newEntry = await entryService.createEntry(
      userId?.toString()!,
      req.body,
      req.file,
    );
    res.status(201).json(newEntry);
  },
);

export const getAllEntries = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const userId = req.user?._id;
    const entries = await entryService.getAllEntries(userId?.toString()!);
    res.status(200).json(entries);
  },
);

export const getEntryById = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const userId = req.user?._id;
    const { id } = req.params;
    const entry = await entryService.getEntryById(id, userId?.toString()!);
    res.status(200).json(entry);
  },
);

export const updateEntry = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const userId = req.user?._id;
    const { id } = req.params;
    const updatedEntry = await entryService.updateEntry(
      id,
      userId?.toString()!,
      req.body,
      req.file,
    );
    res.status(200).json(updatedEntry);
  },
);

export const deleteEntry = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const userId = req.user?._id;
    const { id } = req.params;
    const result = await entryService.deleteEntry(id, userId?.toString()!);
    res.status(200).json(result);
  },
);
