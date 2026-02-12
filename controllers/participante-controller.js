const { Participante, EventoParticipante } = require("../models");

const getParticipantes = async (req, res) => {
  try {
    const response = await Participante.findAll();
    res.json(response);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const createParticipante = async (req, res) => {
  const { par_cedula, par_nombre, par_correo } = req.body;
  try {
    const response = await Participante.create({
      par_cedula,
      par_nombre,
      par_correo,
    });
    res.json(response);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const updateParticipante = async (req, res) => {
  const { par_id, par_cedula, par_nombre, par_correo } = req.body;

  if (!par_id) return res.status(400).json({ message: "par_id es requerido" });

  try {
    const [updated] = await Participante.update(
      { par_cedula, par_nombre, par_correo },
      { where: { par_id } },
    );

    if (updated) {
      const updatedParticipante = await Participante.findByPk(par_id);
      res.json(updatedParticipante);
    } else {
      res.status(404).json({ message: "Participante no encontrado" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const deleteParticipante = async (req, res) => {
  const { par_id } = req.query;

  if (!par_id) return res.status(400).json({ message: "par_id es requerido" });

  try {
    // Eliminar participaciones en eventos antes de borrar al participante
    await EventoParticipante.destroy({ where: { par_id } });

    const deleted = await Participante.destroy({ where: { par_id } });
    if (deleted) {
      res.json({ message: "Participante eliminado correctamente" });
    } else {
      res.status(404).json({ message: "Participante no encontrado" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getParticipantes,
  createParticipante,
  updateParticipante,
  deleteParticipante,
};
