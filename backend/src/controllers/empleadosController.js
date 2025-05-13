//Array de metodos (C R U D)
const empleadoController = {};
import empleadoModel from "../models/empleados.js";

// SELECT
empleadoController.getempleado = async (req, res) => {
  const empleado = await empleadoModel.find();
  res.json(empleado);
};

// INSERT
empleadoController.crearempleado = async (req, res) => {
  const { nombre, correo, contrasena, telefono, direccion, puesto, fecha_contratacion, salario, activo } = req.body;
  const newempleado= new empleadoModel({ nombre, correo, contrasena, telefono, direccion, puesto, fecha_contratacion, salario, activo });
  await newempleado.save();
  res.json({ message: "Empleado guardado" });
};

// DELETE
empleadoController.deleteempleado = async (req, res) => {
const deletedempleado = await empleadoModel.findByIdAndDelete(req.params.id);
  if (!deletedempleado) {
    return res.status(404).json({ message: "Empleado no encontrado" });
  }
  res.json({ message: "Empleado eliminado" });
};

// UPDATE
empleadoController.updateempleado = async (req, res) => {
  // Solicito todos los valores
  const { nombre, correo, contrasena, telefono, direccion, puesto, fecha_contratacion, salario, activo } = req.body;
  // Actualizo
  await empleadoModel.findByIdAndUpdate(
    req.params.id,
    { nombre, correo, contrasena, telefono, direccion, puesto, fecha_contratacion, salario, activo },
    { new: true }
  );
  // muestro un mensaje que todo se actualizo
  res.json({ message: "Empleado actualizado" });
};

export default empleadoController;
