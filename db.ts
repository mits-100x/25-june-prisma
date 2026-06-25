import { PrismaClient } from "./generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const adapter = new PrismaPg({
  connectionString: "",
});

export const prisma = new PrismaClient({
  adapter,
  log: ['query'], // 'query' enables the SQL logging
});
