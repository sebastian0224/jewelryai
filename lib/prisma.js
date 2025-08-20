import { PrismaClient } from "@prisma/client";

let prisma;

try {
  if (process.env.NODE_ENV === "production") {
    prisma = new PrismaClient();
  } else {
    if (!global.prisma) {
      global.prisma = new PrismaClient();
    }
    prisma = global.prisma;
  }
} catch (error) {
  // TODO: Show visual connection error message with V0
  console.error("Error initializing Prisma:", error);
  throw new Error(
    "Could not connect to the database. Check your Prisma configuration and your connection."
  );
}

export default prisma;
