
import { Request, Response } from "express";
import { prisma } from "../config/prisma.ts";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export default {
  login: async (request: Request, response: Response) => {
    try {
      const { email, senha } = request.body;

      if (!email || !senha) {
        return response.status(400).json({
          mensagem: "Informe o email e a senha.",
        });
      }

      const usuario = await prisma.usuario.findUnique({
        where: { email },
      });

      if (!usuario || !bcrypt.compareSync(senha, usuario.senha)) {
        return response.status(401).json({
          mensagem: "Email ou senha inválidos.",
        });
      }

      const token = jwt.sign(
        { id: usuario.id },
        process.env.JWT_SECRET as string,
        { expiresIn: "1d" }
      );

      return response.status(200).json({
        mensagem: "Login realizado com sucesso!",
        token,
      });
    } catch (error) {
      return response.status(500).json({
        mensagem: "Erro ao realizar login.",
      });
    }
  },
};
