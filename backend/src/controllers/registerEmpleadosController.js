import jsonwebtoken from "jsonwebtoken"; //Token
import bcryptjs from "bcryptjs"; //Encriptar
import nodemailer from "nodemailer"; //Enviar correos
import crypto from "crypto"; // Codigo aleatorio

import empleadosModel from "../models/empleados.js";
import { config } from "../config.js";

//Array de funciones
const registerEmpleadosController = {};

registerEmpleadosController.register = async (req, res) => {
  //1- Solicitar los datos que vamos a registrar
  const { nombre, correo, contrasena, telefono, direccion, puesto, fecha_contratacion, salario, activo } = req.body;

  try {
    // Verificamos si el empleado ya existe
    const existingEmpleado = await empleadosModel.findOne({ correo });
    if (existingEmpleado) {
      return res.json({ message: "El empleado ya existe" });
    }

    // Encriptar la contraseña
    const passwordHash = await bcryptjs.hash(contrasena, 10);

    //Guardos el empleado en la base de datos
    const newEmpleado = new empleadosModel({nombre, correo, contrasena:passwordHash, telefono, direccion, puesto, fecha_contratacion, salario, activo});

    await newEmpleado.save();

    // Generar un codigo aleatorio para enviarlo por correo
    const verificationCode = crypto.randomBytes(3).toString("hex");

    // Generar un token que contenga el codigo de verficacion
    const tokenCode = jsonwebtoken.sign(
      //1- ¿Que voy a guardar?
      { correo, verificationCode },
      //2- Secret key
      config.JWT.secret,
      //3- Cuando expira
      { expiresIn: "2h" }
    );

    res.cookie("verificationToken", tokenCode, { maxAge: 2 * 60 * 60 * 1000 });

    // Enviar el correo electronico
    //1- Transporter => quien lo envia
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: config.email.email_user,
        pass: config.email.email_pass,
      },
    });

    //2- mailOption => Quien lo recibe
    const mailOptions = {
      from: config.email.email_user,
      to: correo,
      subject: "Verificación de correo",
      text:
        "Para verificar tu cuenta, utiliza el siguiente codigo: " +
        verificationCode +
        "\n expira en dos horas",
    };

    //3- Enviar el correo
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        return res.json({ message: "Error enviando correo" + error });
      }
      console.log("Correo enviado" + info);
    });

    res.json({
      message: "Empleado registrado, revise su correo con el código enviado",
    });
  } catch (error) {
    console.log("error" + error);
  }
};

registerEmpleadosController.verifyCodeEmail = async (req, res) => {
  const { requireCode } = req.body;

  // Obtengo el token guardado en las cookies
  const token = req.cookies.verificationToken;

  try {
    // Verificar y decodificar el token
    const decoded = jsonwebtoken.verify(token, config.JWT.secret);
    const { correo, verificationCode: storedCode } = decoded;

    // Comparar el código que envié por correo y está guardado
    // en las cookies, con el código que el usuario
    // está ingresando
    if (requireCode !== storedCode) {
      return res.json({ message: "Código inválido" });
    }

    // Marcamos al empleado como verificado
    const empleado = await empleadosModel.findOne({ correo });
    empleado.isVerified = true;
    await empleado.save();

    res.clearCookie("verificationToken");

    res.json({ message: "Correo verificado correctamente." });
  } catch (error) {
    console.log("error" + error);
  }
};

export default registerEmpleadosController;
