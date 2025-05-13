//Importamos las tablas de los usuario
import clientesModel from "../models/clientes.js";
import empleadosModel from "../models/empleados.js";
import bcryptjs from "bcryptjs"; // encriptar
import jsonwebtoken from "jsonwebtoken"; //Token
import { config } from "../config.js";

const loginController = {};

loginController.login = async (req, res) => {
  const { correo, contrasena } = req.body;

  try {
    let userFound; //Para guardar el usuario encontrado
    let userType; //Para guardar el tipo usuario encontrado

    // 1. ADMIN
    if (
      correo === config.emailAdmin.email &&
      contrasena === config.emailAdmin.password
    ) {
      (userType = "admin"), (userFound = { _id: "admin" });
    } else {
      //2-EMPLEADO
      userFound = await empleadosModel.findOne({ correo });
      userType = "empleado";

      if (!userFound) {
        userFound = await clientesModel.findOne({ correo });
        userType = "cliente";
      }
    }

    //Usuario no encontrado
    if (!userFound) {
      console.log("A pesar de buscar en todos lados, no existe");
      return res.json({ message: "User no encontrado" });
    }

    // Validar la contraseña
    // Solo si no es Admin
    if (userType !== "admin") {
      //veamos si la contraseña que están escribiendo
      // en el login
      // Es la misma, que la que está en la BD (encriptada)
      const isMatch = await bcryptjs.compare(contrasena, userFound.contrasena);
      if (!isMatch) {
        console.log("No coinciden");
        return res.json({ message: "Contraseña incorrecta" });
      }
    }

    // --> TOKEN <--
    jsonwebtoken.sign(
      //1-Que voy a guardar
      { id: userFound._id, userType },
      //2-Secreto
      config.JWT.secret,
      //3- cuando expira
      { expiresIn: config.JWT.expiresIn },
      //4-funcion flecha
      (error, token) => {
        if (error) console.log(error);

        res.cookie("authToken", token);
        res.json({ message: "Login exitoso" });
      }
    );
  } catch (error) {
    res.json({ message: "error" });
  }
};

export default loginController;