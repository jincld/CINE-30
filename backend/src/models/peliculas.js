/*
    Campos:
    titulo
    descripcion
    director
    genero
    anio
    duracion
    imagen
*/

import { Schema, model } from "mongoose";

const clienteSchema = new Schema(
  {
    titulo: {
      type: String,
      require: true,
    },

    descripcion: {
      type: String,
    },

    director: {
        type: String,
    },

    genero: {
      type: String,
      require: true,
    },

    anio: {
      type: Number,
    },

    duracion: {
      type: Number,
      require: true,
    },

    imagen: {
        type: String,
        require: true,
      }
  },
  {
    timestamps: true,
    strict: false,
  }
);

export default model("pelicula", clienteSchema);
