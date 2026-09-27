import { Request, Response } from "express";
import prisma from "../lib/prisma.js";

export const createAssignment = async (req: Request, res: Response) => {
  try {
    const { assetId, userId, quantity } = req.body;

    if (!assetId || !userId || !quantity) {
      return res.status(400).json({
        success: false,
        message: "Asset, user and quantity are required",
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

    const assignment = await prisma.$transaction(async (tx) => {
      const result = await tx.assignment.create({
        data: {
          assetId: Number(assetId),
          userId: Number(userId),
          quantity: Number(quantity),
        },
      });

      await tx.asset.update({
        where: { id: Number(assetId) },
        data: {
          quantity: {
            decrement: Number(quantity),
          },
          status: "ASSIGNED",
        },
      });

      return result;
    });

    return res.status(201).json({
      success: true,
      message: "Asset assigned successfully",
      data: assignment,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Failed to assign asset",
    });
  }
};

export const getAssignments = async (_req: Request, res: Response) => {
  try {
    const assignments = await prisma.assignment.findMany({
      include: {
        asset: true,
        user: true,
      },
      orderBy: {
        assignedAt: "desc",
      },
    });

    return res.json({
      success: true,
      data: assignments,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch assignments",
    });
  }
};