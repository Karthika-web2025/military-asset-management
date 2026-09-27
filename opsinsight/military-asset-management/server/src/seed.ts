import "dotenv/config";
import bcrypt from "bcrypt";
import prisma from "./lib/prisma.js";

const seed = async () => {
  const password = await bcrypt.hash("admin123", 10);

  const base = await prisma.base.upsert({
    where: {
      name: "Headquarters",
    },
    update: {},
    create: {
      name: "Headquarters",
      location: "Main Base",
    },
  });
  console.log("Admin user created successfully");

  const vehicle = await prisma.equipmentType.upsert({
  where: {
    name: "Vehicle",
  },
  update: {},
  create: {
    name: "Vehicle",
    description: "Military vehicles",
  },
});

const weapon = await prisma.equipmentType.upsert({
  where: {
    name: "Weapon",
  },
  update: {},
  create: {
    name: "Weapon",
    description: "Military weapons",
  },
});

const ammunition = await prisma.equipmentType.upsert({
  where: {
    name: "Ammunition",
  },
  update: {},
  create: {
    name: "Ammunition",
    description: "Military ammunition",
  },
});

console.log("Equipment types created:", {
  vehicle: vehicle.id,
  weapon: weapon.id,
  ammunition: ammunition.id,
});


const alphaBase = await prisma.base.upsert({
  where: {
    name: "Alpha Base",
  },
  update: {},
  create: {
    name: "Alpha Base",
    location: "North Zone",
  },
});

await prisma.asset.upsert({
  where: {
    serialNumber: "VEH-001",
  },
  update: {},
  create: {
    name: "Military Vehicle",
    serialNumber: "VEH-001",
    quantity: 10,
    baseId: base.id,
    equipmentTypeId: vehicle.id,
  },
});

await prisma.asset.upsert({
  where: {
    serialNumber: "WPN-001",
  },
  update: {},
  create: {
    name: "Assault Rifle",
    serialNumber: "WPN-001",
    quantity: 50,
    baseId: base.id,
    equipmentTypeId: weapon.id,
  },
});

await prisma.asset.upsert({
  where: {
    serialNumber: "AMMO-001",
  },
  update: {},
  create: {
    name: "Ammunition",
    serialNumber: "AMMO-001",
    quantity: 1000,
    baseId: base.id,
    equipmentTypeId: ammunition.id,
  },
});

console.log("Sample assets and Alpha Base created successfully");
  await prisma.user.upsert({
    where: {
      email: "admin@military.com",
    },
    update: {},
    create: {
      name: "System Admin",
      email: "admin@military.com",
      password,
      role: "ADMIN",
      baseId: base.id,
    },
  });

  console.log("Admin user created successfully");

  await prisma.$disconnect();
};

seed().catch(async (error) => {
  console.error(error);
  await prisma.$disconnect();
  process.exit(1);
});