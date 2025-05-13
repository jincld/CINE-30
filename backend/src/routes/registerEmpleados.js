import express from "express";
import registerEmpleadosController from "../controllers/registerEmpleadosController.js";
const router = express.Router();

router.route("/").post(registerEmpleadosController.register);
router.route("/verifyCodeEmail").post(registerEmpleadosController.verifyCodeEmail);

export default router;
