const { Usuario, Participante } = require("../models");
const jwt = require("jsonwebtoken");

const SECRET_KEY = "mi_secreto_super_seguro"; // En producción, usar variable de entorno

const login = async (req, res) => {
  try {
    const { username, password, type } = req.body;

    let user;
    let role;

    if (type === "empleado") {
      user = await Usuario.findOne({ where: { usu_nombre: username } });
      role = "empleado";
    } else if (type === "participante") {
      // Para participantes, username puede ser el correo o la cédula
      user = await Participante.findOne({ where: { par_correo: username } });
      if (!user) {
        user = await Participante.findOne({ where: { par_cedula: username } });
      }
      role = "participante";
    } else {
      return res.status(400).json({ message: "Tipo de usuario requerido (empleado/participante)" });
    }

    if (!user) {
      return res.status(401).json({ message: "Usuario no encontrado" });
    }

    const storedPassword = type === "empleado" ? user.usu_password : user.par_password;

    if (storedPassword !== password) {
      return res.status(401).json({ message: "Contraseña incorrecta" });
    }

    const token = jwt.sign(
      {
        id: type === "empleado" ? user.usu_id : user.par_id,
        role: role,
        username: type === "empleado" ? user.usu_nombre : user.par_nombre
      },
      SECRET_KEY,
      { expiresIn: "24h" }
    );

    return res.json({
      message: "Login exitoso",
      token,
      user: {
        id: type === "empleado" ? user.usu_id : user.par_id,
        nombre: type === "empleado" ? user.usu_nombre : user.par_nombre,
        role: role,
      },
    });
  } catch (error) {
    console.error("Error en inicio de sesión:", error);
    res.status(500).json({ message: "Error en el servidor" });
  }
};

const register = async (req, res) => {
  try {
    const { username, password } = req.body;
    const existingUser = await Usuario.findOne({ where: { usu_nombre: username } });

    if (existingUser) {
      return res.status(400).json({ message: "El usuario ya existe" });
    }

    const newUser = await Usuario.create({
      usu_nombre: username,
      usu_password: password,
    });

    res.status(201).json({ message: "Usuario registrado con éxito", user: newUser });
  } catch (error) {
    console.error("Error en registro:", error);
    res.status(500).json({ message: "Error en el servidor" });
  }
};

module.exports = {
  login,
  register,
  SECRET_KEY
};
