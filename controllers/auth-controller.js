const { Usuario } = require("../models");

const login = async (req, res) => {
  try {
    const { username, password } = req.body;

    // Simple verification (plaintext as requested)
    const user = await Usuario.findOne({ where: { usu_nombre: username } });

    if (!user || user.usu_password !== password) {
      return res
        .status(401)
        .json({ message: "Usuario o contraseña incorrectos" });
    }

    return res.json({
      message: "Login exitoso",
      user: {
        id: user.usu_id,
        nombre: user.usu_nombre,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Error en el servidor" });
  }
};

const register = async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await Usuario.create({
      usu_nombre: username,
      usu_password: password,
    });
    res.json({ message: "Usuario creado", user });
  } catch (error) {
    res.status(500).json({ message: "Error creando usuario", error });
  }
};

module.exports = {
  login,
  register,
};
