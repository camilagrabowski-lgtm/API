
import { Request, Response } from "express";
import { prisma } from "../config/prisma";

export default {
  // Listar todos os personagens
  list: async (request: Request, response: Response) => {
    try {
      const personagens = await prisma.personagem.findMany();

      return response.status(200).json(personagens);
    } catch {
      return response.status(500).json({
        mensagem: "Erro ao listar personagens.",
      });
    }
  },

  // Buscar um personagem pelo ID
  getById: async (request: Request, response: Response) => {
    try {
      const id = Number(request.params.id);

      if (!Number.isInteger(id) || id <= 0) {
        return response.status(400).json({
          mensagem: "ID inválido.",
        });
      }

      const personagem = await prisma.personagem.findUnique({
        where: { id },
      });

      if (!personagem) {
        return response.status(404).json({
          mensagem: "Personagem não encontrado.",
        });
      }

      return response.status(200).json(personagem);
    } catch {
      return response.status(500).json({
        mensagem: "Erro ao buscar personagem.",
      });
    }
  },

  // Criar um personagem
  create: async (request: Request, response: Response) => {
    try {
      const { nome, aldeia, cla, habilidade, bijuu } = request.body;

      if (!nome || !aldeia || !habilidade) {
        return response.status(400).json({
          mensagem: "Nome, aldeia e habilidade são obrigatórios.",
        });
      }

      const personagem = await prisma.personagem.create({
        data: { nome, aldeia, cla, habilidade, bijuu },
      });

      return response.status(201).json(personagem);
    } catch {
      return response.status(500).json({
        mensagem: "Erro ao criar personagem.",
      });
    }
  },

  // Atualizar um personagem
  update: async (request: Request, response: Response) => {
    try {
      const id = Number(request.params.id);

      if (!Number.isInteger(id) || id <= 0) {
        return response.status(400).json({
          mensagem: "ID inválido.",
        });
      }

      const { nome, aldeia, cla, habilidade, bijuu } = request.body;

      const existente = await prisma.personagem.findUnique({
        where: { id },
      });

      if (!existente) {
        return response.status(404).json({
          mensagem: "Personagem não encontrado.",
        });
      }

      const personagem = await prisma.personagem.update({
        where: { id },
        data: { nome, aldeia, cla, habilidade, bijuu },
      });

      return response.status(200).json(personagem);
    } catch {
      return response.status(500).json({
        mensagem: "Erro ao atualizar personagem.",
      });
    }
  },

  // Excluir um personagem
  delete: async (request: Request, response: Response) => {
    try {
      const id = Number(request.params.id);

      if (!Number.isInteger(id) || id <= 0) {
        return response.status(400).json({
          mensagem: "ID inválido.",
        });
      }

      const personagem = await prisma.personagem.findUnique({
        where: { id },
      });

      if (!personagem) {
        return response.status(404).json({
          mensagem: "Personagem não encontrado.",
        });
      }

      await prisma.personagem.delete({
        where: { id },
      });

      return response.status(200).json({
        mensagem: "Personagem excluído com sucesso!",
      });
    } catch {
      return response.status(500).json({
        mensagem: "Erro ao excluir personagem.",
      });
    }
  },
};
