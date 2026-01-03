import prisma from "../lib/prisma";
import bcrypt from "bcryptjs";

async function main() {
  const email = process.env.TARGET_EMAIL || "ahmadmustafa.dev@gmail.com";
  const newPassword = process.env.NEW_PASSWORD || "AM#Pro9922";

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    console.error("User not found for email:", email);
    process.exit(1);
  }

  const passwordHash = await bcrypt.hash(newPassword, 10);
  await prisma.user.update({ where: { id: user.id }, data: { passwordHash } });
  console.log("Password updated for:", user.email);
}

main()
  .then(() => process.exit(0))
  .catch((e) => {
    console.error(e);
    process.exit(1);
  });
