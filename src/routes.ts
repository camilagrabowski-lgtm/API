
import { Router } from "express";

import personagemController from "./controllers/personagem";
import usuarioController from "./controllers/usuario";
import { authentication } from "./middlewares/authentication";

const routes = Router();

// Rota inicial
routes.get("/", (request, response) => {
  return response.status(200).json({
    mensagem: "API do Naruto funcionando!",
  });
});

// Rota de login
routes.post("/login", usuarioController.login);

// ROTAS DE PERSONAGENS
routes.get("/personagens", personagemController.list);
routes.get("/personagens/:id", personagemController.getById);

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
