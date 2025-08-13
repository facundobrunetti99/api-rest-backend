import mongoose from "mongoose";
import dotenv from "dotenv"
export const conectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    
  } catch (error) {
    console.log(error, "Error en la conexion de la base de datos");
  }
};
