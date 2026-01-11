import { Request, Response } from "express";
import { preorderService } from "../services/preorder";
import asyncHandler from "../../../shared/utils/asyncHandler";

export const createPreorder = asyncHandler(
  async (req: Request, res: Response) => {
    const result = await preorderService.createPreorder(req.body);

    res.status(201).json(result);
  }
);

export const getMyPreorders = asyncHandler(
  async (req: Request, res: Response) => {
    const farmerId = req.query.farmerId;
    const result = await preorderService.getAllPreorders({ farmerId });

    res.status(200).json(result);
  }
);

export const getMerchantPreorders = asyncHandler(
  async (req: Request, res: Response) => {
    const { merchantId } = req.query;

    if (!merchantId) {
      throw new Error("Merchant ID is required");
    }

    const result = await preorderService.getMerchantPreorders(
      merchantId as string
    );

    res.status(200).json(result);
  }
);

// export const updatePreorderStatus = asyncHandler(
//   async (req: Request, res: Response) => {
//     const { id } = req.params;
//     const { status } = req.body;

//     const result = await Preorder.findByIdAndUpdate(
//       id,
//       { status },
//       { new: true }
//     );

//     res.status(200).json(result);
//   }
// );
