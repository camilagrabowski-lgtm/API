
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const senha = await bcrypt.hash("naruto123", 10);

  await prisma.usuario.upsert({
    where: { email: "admin@naruto.com" },
    update: {},
    create: {
      nome: "Administrador",
      email: "admin@naruto.com",
      senha,
    },
  });

  console.log("Usuário criado com sucesso!");
}

main()
  .catch((erro) => {
    console.error(erro);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
