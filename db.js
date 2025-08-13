import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

export const conectDB = async () => {
  try {
    console.log("Intentando conectar a MongoDB...");
    
    await mongoose.connect(process.env.MONGODB_URI, {
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    });
    
    console.log("✅ MongoDB conectado exitosamente");
  } catch (error) {
    console.error("❌ Error conectando MongoDB:", error.message);
    throw error;
  }
};