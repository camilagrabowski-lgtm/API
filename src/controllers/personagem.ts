
import { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { prisma } from "../../config/prisma";
import { handleErrors } from "../helpers/handleErrors";

export default {
  list: async (request: Request, response: Response) => {
    try {
      const funcionarios = await prisma.funcionario.findMany({
        select: {
          id: true,
          nome: true,
          cpf: true,
          email: true,
          telefone: true,
          endereco: true,
          nascimento: true,
          cargo: true,
        },
      });

      return response.status(200).json(funcionarios);
    } catch (e) {
      return handleErrors(e, response);
    }
  },

  getById: async (request: Request, response: Response) => {
    try {
      const { id } = request.params;

      const funcionario = await prisma.funcionario.findUnique({
        where: { id: +id },
        select: {
          id: true,
          nome: true,
          cpf: true,
          email: true,
          telefone: true,
          endereco: true,
          nascimento: true,
          cargo: true,
        },
      });

      if (!funcionario) {
        return response.status(404).json({
          message: "Funcionário não encontrado",
        });
      }

      return response.status(200).json(funcionario);
    } catch (e) {
      return handleErrors(e, response);
    }
  },

  create: async (request: Request, response: Response) => {
    try {
      const {
        nome,
        cpf,
        email,
        telefone ,
        senha,
        endereco,
        nascimento, 
        cargo,
      } = request.body;

      const senhaHash = await bcrypt.hash(senha, 10);

      const funcionario = await prisma.funcionario.create({
        data: {
          nome,
          cpf,
          email,
          telefone: telefone ? Number(telefone) : null,
          senha: senhaHash,
          endereco,
          nascimento: nascimento ? new Date(nascimento) : null,
          cargo,
        },
        select: {
          id: true,
          nome: true,
          cpf: true,
          email: true,
          telefone: true,
          endereco: true,
          nascimento: true,
          cargo: true,
        },
      });

      return response.status(201).json(funcionario);
    } catch (e) {
      return handleErrors(e, response);
    }
  },

  update: async (request: Request, response: Response) => {
    try {
      const { id } = request.params;
      const {
        nome,
        cpf,
        email,
        telefone,
        senha,
        endereco,
        nascimento,
        cargo,
      } = request.body;

      const funcionario = await prisma.funcionario.update({
        where: { id: +id },
        data: {
          nome,
          cpf,
          email,
          telefone: telefone !== undefined
            ? (telefone ? Number(telefone) : null)
            : undefined,
          senha: senha ? await bcrypt.hash(senha, 10) : undefined,
          endereco,
          nascimento: nascimento !== undefined
            ? (nascimento ? new Date(nascimento) : null)
            : undefined,
          cargo,
        },
        select: {
          id: true,
          nome: true,
          cpf: true,
          email: true,
          telefone: true,
          endereco: true,
          nascimento: true,
          cargo: true,
        },
      });

      return response.status(200).json(funcionario);
    } catch (e) {
      return handleErrors(e, response);
    }
  },

  delete: async (request: Request, response: Response) => {
    try {
      const { id } = request.params;

      await prisma.funcionario.delete({
        where: { id: +id },
      });

      return response.status(200).json({
        message: "Funcionário excluído com sucesso",
      });
    } catch (e) {
      return handleErrors(e, response);
    }
  },

  login: async (request: Request, response: Response) => {
    try {
      const { email, senha } = request.body;

      if (!email || !senha) {
        return response.status(400).json("Dados incompletos");
      }

      const funcionario = await prisma.funcionario.findUnique({
        where: {
          email,
        },
      });

      if (
        !funcionario ||
        !bcrypt.compareSync(senha, funcionario.senha)
      ) {
        return response.status(401).json("Email e/ou senha inválidos");
      }

      const token = jwt.sign(
        {
          id: funcionario.id,
          cargo: funcionario.cargo,
        },
        process.env.JWT_SECRET!,
        {
          expiresIn: "1d",
        }
      );

      return response.status(200).json(token);
    } catch (e) {
      return handleErrors(e, response);
    }
  },
};