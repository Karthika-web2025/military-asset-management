import "dotenv/config";
import postgres from "@prisma/orm-postgres/runtime";

import type { Contract } from "../../prisma/contract.d";
import contractJson from "../../prisma/contract.json" with { type: "json" };

const db = postgres<Contract>({
  url: process.env.DATABASE_URL!,
  contractJson,
});

export { db };
export default db;