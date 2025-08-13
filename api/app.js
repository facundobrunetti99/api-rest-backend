import express from "express";
import morgan from "morgan";
import authRoutes from "../routes/auth.routes.js";
import cookieParser from "cookie-parser";
import taskRoutes from "../routes/task.routes.js";
import projectRoutes from "../routes/project.routes.js"
import epicRoutes from "../routes/epic.routes.js";
import storyRoutes from "../routes/story.router.js";
import cors from "cors";

const app = express();
// Configuración de CORS más robusta
app.use(cors({
  origin: ["https://front-end-task-pied.vercel.app"], // como array
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "Cookie"],
  exposedHeaders: ["set-cookie"]
}));

// Middleware para headers CORS manuales (backup)
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', 'https://front-end-task-pied.vercel.app');
  res.header('Access-Control-Allow-Credentials', 'true');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization, Cookie');
  res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
  next();
});

app.use((req, res, next) => {
  console.log(`Petición recibida: ${req.method} ${req.path}`);
  next();
});

app.use(morgan("dev"));
app.use(express.json());
app.use(cookieParser());

app.use("/api", authRoutes);
app.use("/api", taskRoutes);
app.use("/api", epicRoutes);
app.use("/api", projectRoutes);
app.use("/api", storyRoutes);

export default app;
