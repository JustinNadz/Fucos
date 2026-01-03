import prisma from "../lib/prisma";
import bcrypt from "bcryptjs";

async function main() {
  const email = process.env.TEST_USER_EMAIL || "testuser@example.com";
  const name = process.env.TEST_USER_NAME || "Test User";
  const password = process.env.TEST_USER_PASSWORD || "Password123!";

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    console.log("User already exists:", existing.email);
    return;
  }

  const passwordHash = await bcrypt.hash(password, 10);
  const user = await prisma.user.create({
    data: {
      email,
      name,
      passwordHash,
    },
  });

  // create default settings
  await prisma.userSettings.create({ data: { userId: user.id } });

  console.log("Created user:", {
    id: user.id,
    email: user.email,
    name: user.name,
  });
}

main()
  .then(() => process.exit(0))
  .catch((e) => {
    console.error(e);
    process.exit(1);
  });
