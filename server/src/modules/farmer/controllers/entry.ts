import { Response } from "express";
import { AuthRequest } from "../../../shared/middleware/authMiddleware";
import asyncHandler from "../../../shared/utils/asyncHandler";
import { entryService } from "../services/entry";

export const createEntry = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    console.log(req.body);

    const userId = req.user?._id;
    const newEntry = await entryService.createEntry(
      userId?.toString()!,
      req.body,
      req.file
    );
    res.status(201).json(newEntry);
  }
);
