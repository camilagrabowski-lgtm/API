
import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export function authentication(
  request: Request,
  response: Response,
  next: NextFunction
) {
  const authorization = request.headers.authorization;

  if (!authorization) {
    return response.status(401).json({
      mensagem: "Token não informado.",
    });
  }

  const [tipo, token] = authorization.split(" ");

  if (tipo !== "Bearer" || !token) {
    return response.status(401).json({
      mensagem: "Formato do token inválido.",
    });
  }

  try {
    jwt.verify(token, process.env.JWT_SECRET as string);
    return next();
  } catch {
    return response.status(401).json({
      mensagem: "Token inválido ou expirado.",
    });
  }
}
