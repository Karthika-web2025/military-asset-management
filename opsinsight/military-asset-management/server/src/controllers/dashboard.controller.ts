
import { Request, Response } from "express";
import prisma from "../lib/prisma.js";

export const getDashboard = async (req: Request, res: Response) => {
  try {
    const { baseId, equipmentTypeId } = req.query;

    const baseFilter = baseId ? Number(baseId) : undefined;
    const equipmentFilter = equipmentTypeId
      ? Number(equipmentTypeId)
      : undefined;

    // -----------------------------
    // Purchases
    // -----------------------------
    const purchases = await prisma.purchase.findMany({
      where: {
        ...(baseFilter ? { baseId: baseFilter } : {}),
        ...(equipmentFilter
          ? { equipmentTypeId: equipmentFilter }
          : {}),
      },
    });

    // -----------------------------
    // Transfer In
    // -----------------------------
    const transfersIn = await prisma.transfer.findMany({
      where: {
        status: "COMPLETED",

        ...(baseFilter
          ? { toBaseId: baseFilter }
          : {}),

        ...(equipmentFilter
          ? {
              asset: {
                equipmentTypeId: equipmentFilter,
              },
            }
          : {}),
      },
    });

    // -----------------------------
    // Transfer Out
    // -----------------------------
    const transfersOut = await prisma.transfer.findMany({
      where: {
        status: "COMPLETED",

        ...(baseFilter
          ? { fromBaseId: baseFilter }
          : {}),

        ...(equipmentFilter
          ? {
              asset: {
                equipmentTypeId: equipmentFilter,
              },
            }
          : {}),
      },
    });

    // -----------------------------
    // Assignments
    // -----------------------------
    const assignments = await prisma.assignment.findMany({
      where: {
        ...(baseFilter || equipmentFilter
          ? {
              asset: {
                ...(baseFilter
                  ? { baseId: baseFilter }
                  : {}),

                ...(equipmentFilter
                  ? {
                      equipmentTypeId: equipmentFilter,
                    }
                  : {}),
              },
            }
          : {}),
      },
    });

    // -----------------------------
    // Expenditures
    // -----------------------------
    const expenditures = await prisma.expenditure.findMany({
      where: {
        ...(baseFilter || equipmentFilter
          ? {
              asset: {
                ...(baseFilter
                  ? { baseId: baseFilter }
                  : {}),

                ...(equipmentFilter
                  ? {
                      equipmentTypeId: equipmentFilter,
                    }
                  : {}),
              },
            }
          : {}),
      },
    });

    // -----------------------------
    // Current Assets
    // -----------------------------
    const assets = await prisma.asset.findMany({
      where: {
        ...(baseFilter
          ? { baseId: baseFilter }
          : {}),

        ...(equipmentFilter
          ? {
              equipmentTypeId: equipmentFilter,
            }
          : {}),
      },
    });

    // -----------------------------
    // Calculate Totals
    // -----------------------------
    const totalPurchases = purchases.reduce(
      (sum, item) => sum + item.quantity,
      0
    );

    const totalTransferIn = transfersIn.reduce(
      (sum, item) => sum + item.quantity,
      0
    );

    const totalTransferOut = transfersOut.reduce(
      (sum, item) => sum + item.quantity,
      0
    );

    const totalAssigned = assignments.reduce(
      (sum, item) => sum + item.quantity,
      0
    );

    const totalExpended = expenditures.reduce(
      (sum, item) => sum + item.quantity,
      0
    );

    const currentAssetBalance = assets.reduce(
      (sum, asset) => sum + asset.quantity,
      0
    );

    // -----------------------------
    // Net Movement
    // Purchases + Transfer In - Transfer Out
    // -----------------------------
    const netMovement =
      totalPurchases +
      totalTransferIn -
      totalTransferOut;

    // -----------------------------
    // Closing Balance
    // -----------------------------
    const closingBalance = currentAssetBalance;

    // -----------------------------
    // Opening Balance
    // Closing = Opening + Net Movement - Expenditure
    //
    // Therefore:
    // Opening = Closing - Net Movement + Expenditure
    // -----------------------------
    const openingBalance =
      closingBalance -
      netMovement +
      totalExpended;

    // -----------------------------
    // Response
    // -----------------------------
    return res.json({
      success: true,
      data: {
        openingBalance,
        purchases: totalPurchases,
        transferIn: totalTransferIn,
        transferOut: totalTransferOut,
        netMovement,
        assigned: totalAssigned,
        expended: totalExpended,
        closingBalance,
      },
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch dashboard",
    });
  }
};

