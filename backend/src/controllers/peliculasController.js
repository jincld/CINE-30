import peliculasModel from "../models/peliculas.js";
import { v2 as cloudinary } from "cloudinary";

import { config } from "../config.js";

//1- Configurar cloudinary
cloudinary.config({
  cloud_name: config.cloudinary.cloudinary_name,
  api_key: config.cloudinary.cloudinary_api_key,
  api_secret: config.cloudinary.cloudinary_api_secret,
});

// Array de funciones vacio
const peliculasController = {};

//Select
peliculasController.getAllPeliculas = async (req, res) => {
  const peliculas = await peliculasModel.find();
  res.json(peliculas);
};

//Guardar
peliculasController.createPeliculas = async (req, res) => {
  try {
    const { titulo, descripcion, director, genero, anio, duracion } = req.body;
    let imageUrl = "";

    if (req.file) {
      //Subir el archivo a Cloudinary
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: "public",
        allowed_formats: ["jpg", "png", "jpeg"],
      });
      imageUrl = result.secure_url;
    }

    const newPelicula = new peliculasModel({ titulo, descripcion, director, genero, anio, duracion, imagen: imageUrl });
    newPelicula.save();

    res.json({ message: "Pelicula guardada" });
  } catch (error) {
    console.log("error" + error);
  }
};

export default peliculasController;
