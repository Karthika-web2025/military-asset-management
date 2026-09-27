import { Request, Response } from "express";
import prisma from "../lib/prisma.js";

export const createPurchase = async (req: Request, res: Response) => {
  try {
    const {
      baseId,
      equipmentTypeId,
      quantity,
      purchaseDate,
    } = req.body;

    if (!baseId || !equipmentTypeId || !quantity) {
      return res.status(400).json({
        success: false,
        message: "Base, equipment type and quantity are required",
      });
    }

    const purchase = await prisma.purchase.create({
      data: {
        baseId: Number(baseId),
        equipmentTypeId: Number(equipmentTypeId),
        quantity: Number(quantity),
        purchaseDate: purchaseDate
          ? new Date(purchaseDate)
          : new Date(),
      },
    });

    // Update asset quantity
    const asset = await prisma.asset.findFirst({
      where: {
        baseId: Number(baseId),
        equipmentTypeId: Number(equipmentTypeId),
      },
    });

    if (asset) {
      await prisma.asset.update({
        where: {
          id: asset.id,
        },
        data: {
          quantity: {
            increment: Number(quantity),
          },
        },
      });
    }

    return res.status(201).json({
      success: true,
      message: "Purchase recorded successfully",
      data: purchase,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Failed to record purchase",
    });
  }
};

export const getPurchases = async (req: Request, res: Response) => {
  try {
    const { baseId, equipmentTypeId, from, to } = req.query;

    const purchases = await prisma.purchase.findMany({
      where: {
        ...(baseId
          ? { baseId: Number(baseId) }
          : {}),

        ...(equipmentTypeId
          ? { equipmentTypeId: Number(equipmentTypeId) }
          : {}),

        ...(from || to
          ? {
              purchaseDate: {
                ...(from
                  ? { gte: new Date(String(from)) }
                  : {}),
                ...(to
                  ? { lte: new Date(String(to)) }
                  : {}),
              },
            }
          : {}),
      },
      include: {
        base: true,
        equipmentType: true,
      },
      orderBy: {
        purchaseDate: "desc",
      },
    });

    return res.json({
      success: true,
      data: purchases,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch purchases",
    });
  }
};