//Array de metodos (C R U D)
const clientesController = {};
import clienteModel from "../models/clientes.js";

// SELECT
clientesController.getcliente = async (req, res) => {
  const cliente = await clienteModel.find();
  res.json(cliente);
};

// INSERT
clientesController.crearcliente = async (req, res) => {
  const { nombre, correo, contrasena, telefono, direccion, activo } = req.body;
  const newcliente= new clienteModel({ nombre, correo, contrasena, telefono, direccion, activo });
  await newcliente.save();
  res.json({ message: "Cliente guardado" });
};

// DELETE
clientesController.deletecliente = async (req, res) => {
const deletedcliente = await clienteModel.findByIdAndDelete(req.params.id);
  if (!deletedcliente) {
    return res.status(404).json({ message: "Cliente no encontrado" });
  }
  res.json({ message: "Cliente eliminado" });
};

// UPDATE
clientesController.updatecliente = async (req, res) => {
  // Solicito todos los valores
  const { nombre, correo, contrasena, telefono, direccion, activo } = req.body;
  // Actualizo
  await clienteModel.findByIdAndUpdate(
    req.params.id,
    { nombre, correo, contrasena, telefono, direccion, activo },
    { new: true }
  );
  // muestro un mensaje que todo se actualizo
  res.json({ message: "Cliente actualizado" });
};

export default clientesController;
