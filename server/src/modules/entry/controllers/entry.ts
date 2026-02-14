import { Response } from "express";
import { AuthRequest } from "../../../shared/middleware/authMiddleware";
import asyncHandler from "../../../shared/utils/asyncHandler";
import { entryService } from "../services/entry";

export const getEntryStats = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const userId = req.user?._id;
    const { season } = req.query as { season?: string };

    const stats = await entryService.getFinancialOverview(
      userId!.toString(),
      season,
    );

    res.status(200).json({ success: true, data: stats });
  },
);

export const createEntry = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const userId = req.user?._id;
    const newEntry = await entryService.createEntry(
      userId!.toString(),
      req.body,
      req.file,
    );
    res.status(201).json(newEntry);
  },
);

export const getAllEntries = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const userId = req.user?._id;

    const entries = await entryService.getAllEntries(userId!.toString());

    res.status(200).json(entries);
  },
);

export const getEntryById = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const userId = req.user?._id;

    const entry = await entryService.getEntryById(
      req.params.id,
      userId!.toString(),
    );

    res.status(200).json(entry);
  },
);

export const updateEntry = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const userId = req.user?._id;
    const updated = await entryService.updateEntry(
      req.params.id,
      userId!.toString(),
      req.body,
      req.file,
    );
    res.status(200).json(updated);
  },
);

export const deleteEntry = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const userId = req.user?._id;
    const result = await entryService.deleteEntry(
      req.params.id,
      userId!.toString(),
    );
    res.status(200).json(result);
  },
);
