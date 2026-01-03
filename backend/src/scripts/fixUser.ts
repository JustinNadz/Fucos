import prisma from "../lib/prisma";

async function main() {
  const users = await prisma.user.findMany({
    where: { email: { contains: "ahmadmustafa.dev" } },
  });

  for (const u of users) {
    const trimmedEmail = u.email.trim();
    const trimmedName = u.name.trim();
    if (trimmedEmail !== u.email || trimmedName !== u.name) {
      const updated = await prisma.user.update({
        where: { id: u.id },
        data: { email: trimmedEmail, name: trimmedName },
      });
      console.log("Fixed user:", {
        id: updated.id,
        email: updated.email,
        name: updated.name,
      });
    } else {
      console.log("No fix needed for:", u.email);
    }
  }
}

main()
  .then(() => process.exit(0))
  .catch((e) => {
    console.error(e);
    process.exit(1);
  });
