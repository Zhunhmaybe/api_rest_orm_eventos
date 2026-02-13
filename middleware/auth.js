const jwt = require("jsonwebtoken");
const { SECRET_KEY } = require("../controllers/auth-controller");

const verifyToken = (req, res, next) => {
    const token = req.headers["authorization"];

    if (!token) {
        return res.status(403).json({ message: "Token requerido" });
    }

    try {
        const decoded = jwt.verify(token.split(" ")[1], SECRET_KEY); // Bearer TOKEN
        req.user = decoded;
        next();
    } catch (err) {
        return res.status(401).json({ message: "Token inválido" });
    }
};

const isEmpleado = (req, res, next) => {
    if (req.user && req.user.role === "empleado") {
        next();
    } else {
        res.status(403).json({ message: "Acceso denegado: Se requiere rol de empleado" });
    }
};

const isParticipante = (req, res, next) => {
    if (req.user && req.user.role === "participante") {
        next();
    } else {
        res.status(403).json({ message: "Acceso denegado: Se requiere ser participante" });
    }
};

module.exports = { verifyToken, isEmpleado, isParticipante };
