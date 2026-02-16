const express = require("express");
const router = express.Router();
const {
  createEvento,
  updateEvento,
  deleteEvento,
  getEventos,
  getEventosById,
  asignarParticipante,
  deleteParticipanteDeEvento,
  getSalasConEventos,
  getEventoConParticipantes,
  getSalasEventosDeParticipante,
} = require("../controllers/evento-controller");

const {
  getSalas,
  createSala,
  updateSala,
  deleteSala,
} = require("../controllers/sala-controller");

const {
  getParticipantes,
  createParticipante,
  updateParticipante,
  deleteParticipante,
} = require("../controllers/participante-controller");

const { login, register } = require("../controllers/auth-controller");
const { verifyToken, isEmpleado, isParticipante } = require("../middleware/auth");

router.get("/", (req, res) => {
  res.send("Bienvenidos a mi API de Eventos");
});

// Rutas Públicas
router.get("/eventos", getEventos);
router.get("/evento/:id", getEventosById);
router.get("/user/eventos", getEventos); // Alias for consistency

// Rutas Empleados (Organizadores)
router.post("/evento", [verifyToken, isEmpleado], createEvento);
router.put("/evento", [verifyToken, isEmpleado], updateEvento);
router.delete("/evento", [verifyToken, isEmpleado], deleteEvento);

router.get("/salas-eventos", [verifyToken, isEmpleado], getSalasConEventos);
router.get("/evento-participantes", [verifyToken, isEmpleado], getEventoConParticipantes);

// Salas Routes (Empleados)
router.get("/salas", [verifyToken, isEmpleado], getSalas);
router.post("/sala", [verifyToken, isEmpleado], createSala);
router.put("/sala", [verifyToken, isEmpleado], updateSala);
router.delete("/sala", [verifyToken, isEmpleado], deleteSala);

// Participantes Routes (Gestión por Empleados)
router.get("/participantes", [verifyToken, isEmpleado], getParticipantes);
router.post("/participante", [verifyToken, isEmpleado], createParticipante);
router.put("/participante", [verifyToken, isEmpleado], updateParticipante);
router.delete("/participante", [verifyToken, isEmpleado], deleteParticipante);

// Rutas Participantes (Suscripción)
router.post("/evento/participante", [verifyToken, isParticipante], asignarParticipante);
router.delete("/evento/participante", [verifyToken, isParticipante], deleteParticipanteDeEvento);
router.get("/participante-eventos", [verifyToken, isParticipante], getSalasEventosDeParticipante);

// Auth
router.post("/login", login);
router.post("/register/participante", createParticipante);
router.post("/register", register);

module.exports = router;
