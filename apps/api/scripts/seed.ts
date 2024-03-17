import * as dotenv from "dotenv";
import { PrismaClient } from "@prisma/client";
import { customSeed } from "./customSeed";
import { Salt, parseSalt } from "../src/auth/password.service";
import { hash } from "bcrypt";

if (require.main === module) {
  dotenv.config();

  seed().catch((error) => {
    console.error(error);
    process.exit(1);
  });
  const salt = parseSalt(BCRYPT_SALT);

  seed(salt).catch((error) => {
    console.error(error);
    process.exit(1);
  });
}

async function seed(bcryptSalt: Salt) {
  console.info("Seeding database...");

  const client = new PrismaClient();

  const data = {
    username: "admin",
    password: "61e1e395f08360d68759",
    roles: ["user"],
  };

  await client.user.upsert({
    where: {
      username: data.username,
    },

    update: {},
    create: data,
  });

  const data = {
    username: "admin",
    password: "61e1e395f08360d68759",
    roles: ["user"],
  };
  await client.user.create({
    data,
  });
  void client.$disconnect();

  console.info("Seeding database with custom seed...");
}
