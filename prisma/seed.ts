import "dotenv/config";
import bcrypt from "bcrypt";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../generated/prisma/client";

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
 throw new Error("DATABASE_URL is not set");
}

const userEmail = process.env.USER_EMAIL;
const userPassword = process.env.USER_PASSWORD;

if (!userEmail || !userPassword) {
 throw new Error("USER_EMAIL or USER_PASSWORD is not set");
}

const adapter = new PrismaPg({
 connectionString,
});

const prisma = new PrismaClient({
 adapter,
});

async function main(email: string, password: string) {
 const passwordHash = await bcrypt.hash(password, 12);

 await prisma.user.upsert({
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

 console.log(`User seeded: ${email}`);
}

main(userEmail, userPassword)
 .catch((error) => {
  console.error(error);
  process.exit(1);
 })
 .finally(async () => {
  await prisma.$disconnect();
 });
