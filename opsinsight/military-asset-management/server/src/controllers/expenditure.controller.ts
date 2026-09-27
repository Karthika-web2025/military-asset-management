import { Request, Response } from "express";
import prisma from "../lib/prisma.js";

export const createExpenditure = async (req: Request, res: Response) => {
  try {
    const { assetId, quantity, reason } = req.body;

    if (!assetId || !quantity) {
      return res.status(400).json({
        success: false,
        message: "Asset and quantity are required",
      });
    }

    const asset = await prisma.asset.findUnique({
      where: { id: Number(assetId) },
    });

    if (!asset) {
      return res.status(404).json({
        success: false,
        message: "Asset not found",
      });
    }

    if (asset.quantity < Number(quantity)) {
      return res.status(400).json({
        success: false,
        message: "Insufficient asset quantity",
      });
    }

    const expenditure = await prisma.$transaction(async (tx) => {
      const result = await tx.expenditure.create({
        data: {
          assetId: Number(assetId),
          quantity: Number(quantity),
          reason,
        },
      });

      await tx.asset.update({
        where: { id: Number(assetId) },
        data: {
          quantity: {
            decrement: Number(quantity),
          },
        },
      });

      return result;
    });

    return res.status(201).json({
      success: true,
      message: "Expenditure recorded successfully",
      data: expenditure,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Failed to record expenditure",
    });
  }
};

export const getExpenditures = async (_req: Request, res: Response) => {
  try {
    const expenditures = await prisma.expenditure.findMany({
      include: {
        asset: true,
      },
      orderBy: {
        expendedAt: "desc",
      },
    });

    return res.json({
      success: true,
      data: expenditures,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch expenditures",
    });
  }
};