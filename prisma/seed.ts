import "dotenv/config";
import bcrypt from "bcrypt";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../generated/prisma/client";

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
 throw new Error("DATABASE_URL is not set");
}

const adminEmail = process.env.ADMIN_EMAIL;
const adminPassword = process.env.ADMIN_PASSWORD;

if (!adminEmail || !adminPassword) {
 throw new Error("ADMIN_EMAIL or ADMIN_PASSWORD is not set");
}

const adapter = new PrismaPg({
 connectionString,
});

const prisma = new PrismaClient({
 adapter,
});

async function main(email: string, password: string) {
 const passwordHash = await bcrypt.hash(password, 12);

 await prisma.admin.upsert({
  where: {
   email,
  },
  update: {
   passwordHash,
  },
  create: {
   email,
   passwordHash,
  },
 });

 console.log(`Admin seeded: ${email}`);
}

main(adminEmail, adminPassword)
 .catch((error) => {
  console.error(error);
  process.exit(1);
 })
 .finally(async () => {
  await prisma.$disconnect();
 });
