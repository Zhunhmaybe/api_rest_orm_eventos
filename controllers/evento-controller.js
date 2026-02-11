const {
  Evento,
  Sala,
  Participante,
  EventoParticipante,
  sequelize,
} = require("../models");

const createEvento = async (req, res) => {
  const { sal_id, eve_nombre, eve_costo } = req.query;

  try {
    const response = await Evento.create({
      sal_id,
      eve_nombre,
      eve_costo,
    });
    res.json(response);
  } catch (error) {
    res.json(error);
  }
};

const updateEvento = async (req, res) => {
  const { eve_id, sal_id, eve_nombre, eve_costo } = req.query;

  try {
    const [updated] = await Evento.update(
      {
        sal_id,
        eve_nombre,
        eve_costo,
      },
      {
        where: { eve_id },
      },
    );

    if (updated) {
      const updatedEvento = await Evento.findByPk(eve_id);
      res.json({
        message: "Evento actualizado con éxito!!",
        body: {
          evento: { response: updatedEvento },
        },
      });
    } else {
      res.json({
        message: "Evento no encontrado o no actualizado",
        body: {},
      });
    }
  } catch (error) {
    res.json({
      message: "¡Error al actualizar Evento!",
      body: {
        error: { error },
      },
    });
  }
};

const deleteEvento = async (req, res) => {
  const { eve_id } = req.query;

  try {
    const eventoToDelete = await Evento.findByPk(eve_id);
    if (!eventoToDelete) {
      return res.json({
        message: "Evento no encontrado",
        body: {},
      });
    }

    await Evento.destroy({
      where: { eve_id },
    });

    res.json({
      message: "Evento eliminado con éxito!!",
      body: {
        evento: { response: eventoToDelete },
      },
    });
  } catch (error) {
    res.json({
      message: "¡Error al eliminar Evento!",
      body: {
        error: { error },
      },
    });
  }
};

const getEventos = async (req, res) => {
  try {
    const response = await Evento.findAll({
      attributes: ["eve_id", "sal_id", "eve_nombre", "eve_costo"],
    });
    res.json(response);
  } catch (error) {
    res.json({ error });
  }
};

const getEventosById = async (req, res) => {
  const eve_id = req.params.id;
  try {
    const response = await Evento.findAll({
      where: { eve_id },
    });
    res.json(response);
  } catch (error) {
    res.json({ error });
  }
};

const asignarParticipante = async (req, res) => {
  const { eve_id, par_id, evepar_cantidad } = req.query;

  try {
    const response = await EventoParticipante.create({
      eve_id,
      par_id,
      evepar_cantidad,
    });
    res.json(response);
  } catch (error) {
    res.json(error);
  }
};

const deleteParticipante = async (req, res) => {
  const { eve_id, par_id } = req.query;

  try {
    const deleted = await EventoParticipante.destroy({
      where: { eve_id, par_id },
    });

    // Emulating returning * behavior might be tricky if row is gone,
    // but we can return success message. The original code returned the deleted row
    // but destroy() returns count.

    res.json({
      message: "Participante eliminado del evento con exito!!",
      body: {
        evento_participante: {
          response: { eve_id, par_id, deleted_count: deleted },
        },
      },
    });
  } catch (error) {
    res.json({
      message: "Error al eliminar participante del evento",
      body: {
        error: { error },
      },
    });
  }
};

const getSalasConEventos = async (req, res) => {
  try {
    // SELECT s.sal_id, s.sal_nombre, e.eve_nombre, e.eve_costo FROM sala s LEFT JOIN evento e ...
    // Sequelize returns nested objects by default, to get flat structure we might need raw: true or manual mapping
    // But let's try to stick to standard Sequelize output which is usually better (nested).
    // However, if strict flat format is required matching the original SQL output, we might need attributes.

    const response = await Sala.findAll({
      attributes: ["sal_id", "sal_nombre"],
      include: [
        {
          model: Evento,
          attributes: ["eve_nombre", "eve_costo"],
          required: false, // LEFT JOIN
        },
      ],
      order: [
        ["sal_id", "ASC"],
        [Evento, "eve_id", "ASC"],
      ],
    });

    // Formatting to match original flat structure if possible,
    // or just return the hierarchical JSON which is more API friendly.
    // The original SQL returned a flat list. Sequelize returns Sales with an array of Eventos.
    // I will return the Sequelize structure as it's "transformar ... mediante orms" implying leveraging ORM features.
    // But if exact format is critical, I can map it.
    // Let's flatten it to be safe and close to original behavior.

    const flatResponse = [];
    response.forEach((sala) => {
      if (sala.Eventos && sala.Eventos.length > 0) {
        sala.Eventos.forEach((evento) => {
          flatResponse.push({
            sal_id: sala.sal_id,
            sal_nombre: sala.sal_nombre,
            eve_nombre: evento.eve_nombre,
            eve_costo: evento.eve_costo,
          });
        });
      } else {
        flatResponse.push({
          sal_id: sala.sal_id,
          sal_nombre: sala.sal_nombre,
          eve_nombre: null,
          eve_costo: null,
        });
      }
    });

    res.status(200).json(flatResponse);
  } catch (error) {
    res.status(500).json({
      message: "Error en consulta salas-eventos",
      error: error.message,
    });
  }
};

const getEventoConParticipantes = async (req, res) => {
  const { eve_id } = req.query;

  if (!eve_id) {
    return res.status(400).json({ message: "eve_id es obligatorio" });
  }

  try {
    const response = await Evento.findOne({
      where: { eve_id },
      attributes: ["eve_nombre"],
      include: [
        {
          model: Participante,
          attributes: ["par_cedula", "par_nombre", "par_id"], // added par_id for ordering
          through: {
            attributes: ["evepar_cantidad"],
          },
        },
      ],
      order: [[Participante, "par_id", "ASC"]],
    });

    if (!response) return res.json([]);

    // Flattening
    const flatResponse = response.Participantes.map((p) => ({
      eve_nombre: response.eve_nombre,
      par_cedula: p.par_cedula,
      par_nombre: p.par_nombre,
      eve_par_pago: p.EventoParticipante.evepar_cantidad,
    }));

    res.status(200).json(flatResponse);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Error en consulta evento-participantes",
      error: error.message,
    });
  }
};

const getSalasEventosDeParticipante = async (req, res) => {
  const { par_id } = req.query;

  if (!par_id) {
    return res.status(400).json({ message: "par_id es obligatorio" });
  }

  try {
    // This is a 3-way join: Participante -> Evento -> Sala
    // In Sequelize with Associations properly set:
    // User wants: sal_nombre, eve_nombre, eve_costo, par_nombre, evepar_cantidad

    const response = await Participante.findOne({
      where: { par_id },
      attributes: ["par_nombre"],
      include: [
        {
          model: Evento,
          attributes: ["eve_nombre", "eve_costo", "eve_id"], // eve_id for ordering
          through: {
            attributes: ["evepar_cantidad"],
          },
          include: [
            {
              model: Sala,
              attributes: ["sal_nombre", "sal_id"], // sal_id for ordering
            },
          ],
        },
      ],
      order: [
        [Evento, Sala, "sal_id", "ASC"],
        [Evento, "eve_id", "ASC"],
      ],
    });

    if (!response) return res.json([]);

    const flatResponse = [];
    response.Eventos.forEach((evento) => {
      // Evento belongsTo Sala, so evento.Sala should be an object
      const sala = evento.Sala;
      flatResponse.push({
        sal_nombre: sala ? sala.sal_nombre : null,
        eve_nombre: evento.eve_nombre,
        eve_costo: evento.eve_costo,
        par_nombre: response.par_nombre,
        eve_par_cantidad: evento.EventoParticipante.evepar_cantidad,
      });
    });

    res.status(200).json(flatResponse);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Error en consulta participante-salas-eventos",
      error: error.message,
    });
  }
};

const getParticipantes = async (req, res) => {
  try {
    const response = await Participante.findAll({
      attributes: [
        "par_id",
        "par_nombre",
        "par_cedula",
        "par_telefono",
        "par_correo",
      ],
    });
    res.json(response);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  createEvento,
  updateEvento,
  deleteEvento,
  getEventos,
  getEventosById,
  asignarParticipante,
  deleteParticipante,
  getSalasConEventos,
  getEventoConParticipantes,
  getSalasEventosDeParticipante,
  getParticipantes,
};
