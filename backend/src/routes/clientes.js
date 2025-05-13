import express from "express";
import clienteController from "../controllers/clientesController.js";
// Router() nos ayuda a colocar los metodos
// que tendra mi ruta
const router = express.Router();

router
  .route("/")
  .get(clienteController.getcliente)
  .post(clienteController.crearcliente);

router
  .route("/:id")
  .put(clienteController.updatecliente)
  .delete(clienteController.deletecliente);

export default router;
