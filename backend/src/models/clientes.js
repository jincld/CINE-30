/*
    Campos:
        nombre
        correo
        contrasena
        telefono
        direccion
        activo
*/

import { Schema, model } from "mongoose";

const clienteSchema = new Schema(
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

export default model("cliente", clienteSchema);
