
import { Router } from "express";

import usuarioController from "./controllers/usuario";
import personagemController from "./controllers/personagem";
import { authentication } from "./middlewares/authentication";

const routes = Router();

// Rota inicial
routes.get("/", (request, response) => {
  return response.status(200).json({
    mensagem: "API do Naruto funcionando!",
  });
});

// Login
routes.post("/login", usuarioController.login);

// Rotas públicas de personagens
routes.get("/personagens", personagemController.list);
routes.get("/personagens/:id", personagemController.getById);

// Rotas protegidas por JWT
routes.post(
  "/personagens",
  authentication,
  personagemController.create
);

routes.put(
  "/personagens/:id",
  authentication,
  personagemController.update
);

routes.delete(
  "/personagens/:id",
  authentication,
  personagemController.delete
);

export default routes;
