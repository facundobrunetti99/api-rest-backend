import User from "../model/user.model.js";
import bcrypt from "bcryptjs";
import { createAccessToken } from "../libs/jwt.js";
import { TOKEN_SECRET } from "../config.js";
import jwt from "jsonwebtoken";

export const register = async (req, res) => {
  const { email, username, password } = req.body;

  try {
    const userFound = await User.findOne({ email });
    if (userFound) return res.status(400).json(["El correo ya esta en uso"]);

    const pwhash = await bcrypt.hash(password, 10);

    const newUser = new User({
      username,
      email,
      password: pwhash,
    });

    const userSaved = await newUser.save();

    const token = await createAccessToken({ id: userSaved._id });
    res.cookie("token", token, {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
    });

    res.json({
      id: userSaved._id,
      username: userSaved.username,
      email: userSaved.email,
      createdAt: userSaved.createdAt,
      updateAt: userSaved.updatedAt,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const userFound = await User.findOne({ email });

    const isValidUser =
      userFound && (await bcrypt.compare(password, userFound.password));

    if (!isValidUser) {
      return res.status(400).json(["Correo o contraseña incorrectos"]);
    }

    const token = await createAccessToken({ id: userFound._id });
    res.cookie("token", token, {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
    });

    res.json({
      id: userFound._id,
      username: userFound.username,
      email: userFound.email,
      createdAt: userFound.createdAt,
      updateAt: userFound.updatedAt,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const logout = (req, res) => {
  res.cookie("token", "", {
    expires: new Date(0),
  });
  return res.sendStatus(200);
};

export const profile = async (req, res) => {
  const userFound = await User.findById(req.user.id);
  if (!userFound)
    return res.satatus(400).json({ message: "Usuario no encontrado" });
  res.json({
    id: userFound._id,
    username: userFound.username,
    emai: userFound.email,
    createdAt: userFound.createdAt,
    updateAt: userFound.updatedAt,
  });
};

export const verifyToken = async (req, res) => {
  try {
    console.log("Cookies recibidas:", req.cookies);

    const { token } = req.cookies;
    if (!token) {
      console.log("No hay token");
      return res
        .status(401)
        .json({ message: "No token, authorization denied" });
    }

    const decoded = jwt.verify(token, TOKEN_SECRET);

    const userFound = await User.findById(decoded.id);
    if (!userFound) {
      return res.status(401).json({ message: "Usuario no encontrado" });
    }

    return res.json({
      id: userFound._id,
      username: userFound.username,
      email: userFound.email,
      createdAt: userFound.createdAt,
      updatedAt: userFound.updatedAt,
    });
  } catch (error) {
    console.error("Error al verificar token:", error);
    return res.status(401).json({ message: "Token inválido o expirado" });
  }
};
