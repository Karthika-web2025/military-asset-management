import { Request, Response } from "express";
import prisma from "../lib/prisma.js";

export const getDashboard = async (req: Request, res: Response) => {
  try {
    const { baseId, equipmentTypeId, dateFrom, dateTo } = req.query;

    const baseFilter =
      typeof baseId === "string" ? Number(baseId) : undefined;

    const equipmentFilter =
      typeof equipmentTypeId === "string"
        ? Number(equipmentTypeId)
        : undefined;

    const startDate =
      typeof dateFrom === "string" && dateFrom
        ? new Date(`${dateFrom}T00:00:00`)
        : undefined;

    const endDate =
      typeof dateTo === "string" && dateTo
        ? new Date(`${dateTo}T23:59:59.999`)
        : undefined;

    const dateFilter =
      startDate || endDate
        ? {
            ...(startDate ? { gte: startDate } : {}),
            ...(endDate ? { lte: endDate } : {}),
          }
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
        ...(dateFilter ? { purchaseDate: dateFilter } : {}),
      },
      include: {
        base: true,
        equipmentType: true,
      },
      orderBy: {
        purchaseDate: "desc",
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

        ...(dateFilter ? { transferDate: dateFilter } : {}),
      },
      include: {
        asset: {
          include: {
            equipmentType: true,
          },
        },
        fromBase: true,
        toBase: true,
      },
      orderBy: {
        transferDate: "desc",
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

        ...(dateFilter ? { transferDate: dateFilter } : {}),
      },
      include: {
        asset: {
          include: {
            equipmentType: true,
          },
        },
        fromBase: true,
        toBase: true,
      },
      orderBy: {
        transferDate: "desc",
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

        ...(dateFilter
          ? {
              assignedAt: dateFilter,
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

        ...(dateFilter
          ? {
              expendedAt: dateFilter,
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
    //
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

        // -----------------------------
        // Net Movement Details
        // Used by Dashboard popup
        // -----------------------------
        netMovementDetails: {
          purchases: purchases.map((item) => ({
            id: item.id,
            quantity: item.quantity,
            purchaseDate: item.purchaseDate,
            base: item.base.name,
            equipmentType: item.equipmentType.name,
          })),

          transferIn: transfersIn.map((item) => ({
            id: item.id,
            quantity: item.quantity,
            transferDate: item.transferDate,
            equipmentType: item.asset.equipmentType.name,
            fromBase: item.fromBase.name,
            toBase: item.toBase.name,
          })),

          transferOut: transfersOut.map((item) => ({
            id: item.id,
            quantity: item.quantity,
            transferDate: item.transferDate,
            equipmentType: item.asset.equipmentType.name,
            fromBase: item.fromBase.name,
            toBase: item.toBase.name,
          })),
        },
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
