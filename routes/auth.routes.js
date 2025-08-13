import { Router } from "express";
import {
  login,
  register,
  logout,
  verifyToken,
} from "../controller/auth.controller.js";
import { validateSchema } from "../middlewares/validate.middleware.js";
import { loginSchema, registerSchema } from "../schema/auth.schema.js";
const router = Router();

router.post("/register", validateSchema(registerSchema), register);
router.post("/login", validateSchema(loginSchema), login);
router.post("/logout", logout);
router.get("/verify", verifyToken);
export default router;
