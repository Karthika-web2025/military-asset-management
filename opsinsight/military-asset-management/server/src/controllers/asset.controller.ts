import { Request, Response } from "express";
import prisma from "../lib/prisma.js";

export const getAssets = async (req: Request, res: Response) => {
  try {
    const { baseId, equipmentTypeId } = req.query;

    const assets = await prisma.asset.findMany({
      where: {
        ...(baseId ? { baseId: Number(baseId) } : {}),
        ...(equipmentTypeId
          ? { equipmentTypeId: Number(equipmentTypeId) }
          : {}),
      },
      include: {
        base: true,
        equipmentType: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return res.json({
      success: true,
      data: assets,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch assets",
    });
  }
};