import { Request, Response } from "express";
import prisma from "../lib/prisma.js";

export const createTransfer = async (req: Request, res: Response) => {
  try {
    const {
      assetId,
      fromBaseId,
      toBaseId,
      quantity,
    } = req.body;

    if (!assetId || !fromBaseId || !toBaseId || !quantity) {
      return res.status(400).json({
        success: false,
        message: "Asset, source base, destination base and quantity are required",
      });
    }

    if (Number(fromBaseId) === Number(toBaseId)) {
      return res.status(400).json({
        success: false,
        message: "Source and destination base cannot be the same",
      });
    }

    const asset = await prisma.asset.findUnique({
      where: {
        id: Number(assetId),
      },
    });

    if (!asset) {
      return res.status(404).json({
        success: false,
        message: "Asset not found",
      });
    }

    if (asset.baseId !== Number(fromBaseId)) {
      return res.status(400).json({
        success: false,
        message: "Asset does not belong to the source base",
      });
    }

    if (asset.quantity < Number(quantity)) {
      return res.status(400).json({
        success: false,
        message: "Insufficient asset quantity",
      });
    }

    const transfer = await prisma.$transaction(async (tx) => {
      const createdTransfer = await tx.transfer.create({
        data: {
          assetId: Number(assetId),
          fromBaseId: Number(fromBaseId),
          toBaseId: Number(toBaseId),
          quantity: Number(quantity),
          status: "COMPLETED",
        },
      });

      await tx.asset.update({
        where: {
          id: Number(assetId),
        },
        data: {
          quantity: {
            decrement: Number(quantity),
          },
        },
      });

      return createdTransfer;
    });

    return res.status(201).json({
      success: true,
      message: "Transfer completed successfully",
      data: transfer,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Failed to create transfer",
    });
  }
};

export const getTransfers = async (_req: Request, res: Response) => {
  try {
    const transfers = await prisma.transfer.findMany({
      include: {
        asset: true,
        fromBase: true,
        toBase: true,
      },
      orderBy: {
        transferDate: "desc",
      },
    });

    return res.json({
      success: true,
      data: transfers,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch transfers",
    });
  }
};