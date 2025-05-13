import jsonwebtoken from "jsonwebtoken"; //Token
import bcryptjs from "bcryptjs"; //Encriptar

import clientesModel from "../models/clientes.js";
import empleadosModel from "../models/empleados.js";

import { config } from "../config.js";
import { sendMail, HTMLRecoveryEmail } from "../utils/MailPasswordRecovery.js";

//1- Creo un array de funciones
const passwordRecoveryController = {};

passwordRecoveryController.requestCode = async (req, res) => {
  const { correo } = req.body;

  try {
    let userFound;
    let userType;

    // Buscamos si el correo está
    // en la colección de clientes
    userFound = await clientesModel.findOne({ correo });
    if (userFound) {
      userType = "cliente";
    } else {
      userFound = await empleadosModel.findOne({ correo });
      if (userFound) {
        userType = "empleado";
      }
    }

    // Si no encuentra ni en clientes ni en empleados
    if (!userFound) {
      return res.json({ message: "Usuario no encontrado" });
    }

    // Generar un código aleatorio
    const code = Math.floor(10000 + Math.random() * 90000).toString();

    //Crear un token que guarde todo
    const token = jsonwebtoken.sign(
      //1-¿que voy a guardar?
      { correo, code, userType, verfied: false },
      //2-secret key
      config.JWT.secret,
      //3-¿cuando expira?
      { expiresIn: "20m" }
    );

    res.cookie("tokenRecoveryCode", token, { maxAge: 20 * 60 * 1000 });

    // ULTIMO PASO, enviar el correo
    await sendMail(
        correo,
      "Recuperación de contraseña", //Asunto
      `Tu código es: ${code}`, //Texto
      HTMLRecoveryEmail(code) //
    );

    res.json({ message: "Verification code send" });
  } catch (error) {}
};

passwordRecoveryController.verifyCode = async (req, res) => {
  const { code } = req.body;

  try {
    //Extraer el token de las cookies
    const token = req.cookies.tokenRecoveryCode;

    // Decodificar el token
    const decoded = jsonwebtoken.verify(token, config.JWT.secret);

    // Verificar que pasa si el código que está guardado
    // en el token, no es el mismo que el usuario escribió
    if (decoded.code !== code) {
      return res.json({ message: "Código inválido" });
    }

    // Generemos un nuevo token
    const newToken = jsonwebtoken.sign(
      //1-¿que vamos a guardar?
      {
        correo: decoded.correo,
        code: decoded.code,
        userType: decoded.userType,
        verified: true,
      },
      //2- secret key
      config.JWT.secret,
      //3- ¿cuando expira?
      { expiresIn: "20m" }
    );
    res.cookie("tokenRecoveryCode", newToken, { maxAge: 20 * 60 * 1000 });

    res.json({ message: "Código verificado correctamente" });
  } catch (error) {
    console.log("error" + error);
  }
};

passwordRecoveryController.newPassword = async (req, res) => {
  const { newPassword } = req.body;

  try {
    //1- Extraer el token de las cookies
    const token = req.cookies.tokenRecoveryCode;

    if (!token) {
      return res.json({ message: "No se encontró un Token" });
    }

    //2- Desglozar lo que tiene el token adentro
    const decoded = jsonwebtoken.verify(token, config.JWT.secret);

    //3- Accedemos a la variable verified a ver que valor tiene
    if (!decoded.verified) {
      return res.json({ message: "Código no verificado, no se puede cambiar la contraseña" });
    }

    // Extraer el correo y tipo de usuario del token
    const { correo, userType } = decoded;

    let user;

    // Buscamos al usuario dependiendo del userType
    if (userType === "cliente") {
      user = await clientesModel.findOne({ correo });
    } else if (userType === "empleado") {
      user = await empleadosModel.findOne({ correo });
    }

    //Encriptar la contraseña nueva
    const hashPassword = await bcryptjs.hash(newPassword, 10);

    // ULTIMO PASO
    // Actualizar la contraseña

    let updatedUser;
    if (userType === "cliente") {
      updatedUser = await clientesModel.findOneAndUpdate(
        { correo },
        { contrasena: hashPassword },
        { new: true }
      );
    } else if (userType === "empleado") {
      updatedUser = await empleadosModel.findOneAndUpdate(
        { correo },
        { contrasena: hashPassword },
        { new: true }
      );
    }

    res.clearCookie("tokenRecoveryCode");

    res.json({ message: "Contraseña cambiada con éxito" });
  } catch (error) {
    console.log("error" + error);
  }
};

export default passwordRecoveryController;
