
import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const senha = bcrypt.hashSync("naruto123", 10);

  await prisma.usuario.upsert({
    where: {
      email: "admin@naruto.com",
    },
    update: {},
    create: {
      nome: "Administrador",
      email: "admin@naruto.com",
      senha,
    },
  });

  console.log("Usuário de teste criado com sucesso!");
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
