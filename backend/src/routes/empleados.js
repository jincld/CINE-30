import express from "express";
import empleadoController from "../controllers/empleadosController.js";
// Router() nos ayuda a colocar los metodos
// que tendra mi ruta
const router = express.Router();

router
  .route("/")
  .get(empleadoController.getempleado)
  .post(empleadoController.crearempleado);

router
  .route("/:id")
  .put(empleadoController.updateempleado)
  .delete(empleadoController.deleteempleado);

export default router;
