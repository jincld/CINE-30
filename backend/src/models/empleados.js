/*
    Campos:
        nombre
        correo
        contrasena
        telefono
        direccion
        puesto
        fecha_contratacion
        salario
        activo
*/

import { Schema, model } from "mongoose";

const empleadoSchema = new Schema(
  {
    nombre: {
      type: String,
      require: true,
    },

    correo: {
      type: String,
    },

    contrasena: {
        type: String,
    },

    telefono: {
      type: String,
      require: true,
    },

    direccion: {
      type: String,
    },

    puesto: {
      type: String,
    },

    fecha_contratacion: {
      type: Date,
      require: true,
    },

    salario: {
      type: Number,
    },

    activo: {
      type: Boolean,
      require: true,
    }
  },
  {
    timestamps: true,
    strict: false,
  }
);

export default model("empleado", empleadoSchema);
