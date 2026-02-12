const { Sala, Evento } = require("../models");

const getSalas = async (req, res) => {
  try {
    const response = await Sala.findAll();
    res.json(response);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const createSala = async (req, res) => {
  const { sal_nombre, sal_descripcion, sal_estado } = req.body;
  try {
    const response = await Sala.create({
      sal_nombre,
      sal_descripcion,
      sal_estado,
    });
    res.json(response);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const updateSala = async (req, res) => {
  const { sal_id, sal_nombre, sal_descripcion, sal_estado } = req.body;

  if (!sal_id) return res.status(400).json({ message: "sal_id es requerido" });

  try {
    const [updated] = await Sala.update(
      { sal_nombre, sal_descripcion, sal_estado },
      { where: { sal_id } },
    );

    if (updated) {
      const updatedSala = await Sala.findByPk(sal_id);
      res.json(updatedSala);
    } else {
      res.status(404).json({ message: "Sala no encontrada" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const deleteSala = async (req, res) => {
  const { sal_id } = req.query;

  if (!sal_id) return res.status(400).json({ message: "sal_id es requerido" });

  try {
    // Desvincular eventos antes de eliminar la sala
    await Evento.update({ sal_id: null }, { where: { sal_id } });

    const deleted = await Sala.destroy({ where: { sal_id } });
    if (deleted) {
      res.json({ message: "Sala eliminada correctamente" });
    } else {
      res.status(404).json({ message: "Sala no encontrada" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getSalas,
  createSala,
  updateSala,
  deleteSala,
};
