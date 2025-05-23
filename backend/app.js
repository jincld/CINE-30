// Importo todo lo de la libreria de Express
import express from "express";
import cookieParser from "cookie-parser";
import empleadoRoutes from "./src/routes/empleados.js";
import clienteRoutes from "./src/routes/clientes.js";
import peliculasRoutes from "./src/routes/peliculas.js";
import registerClienteRoutes from "./src/routes/registerClientes.js";
import registerEmpleadosRoutes from "./src/routes/registerEmpleados.js";
import passwordRecoveryRoutes from "./src/routes/passwordRecovery.js";
import loginRoutes from "./src/routes/login.js";
import logoutRoutes from "./src/routes/logout.js";

// Creo una constante que es igual a la libreria que importé
const app = express();
//Que acepte datos en json
app.use(express.json());
//Que acepte cookies en postman
app.use(cookieParser());
// Definir las rutas de las funciones que tendrá la página web
app.use("/api/empleados", empleadoRoutes);
app.use("/api/clientes", clienteRoutes);
app.use("/api/peliculas", peliculasRoutes);
app.use("/api/registerclientes", registerClienteRoutes);
app.use("/api/registerempleados", registerEmpleadosRoutes);
app.use("/api/passwordrecovery", passwordRecoveryRoutes);
app.use("/api/login", loginRoutes);
app.use("/api/logout", logoutRoutes);

// Exporto la constante para poder usar express en otros archivos
export default app;
