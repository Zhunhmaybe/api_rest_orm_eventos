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

    // Eliminar relaciones primero para evitar conflictos de llave foránea
    await EventoParticipante.destroy({
      where: { eve_id },
    });

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
    console.error(error);
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
      attributes: [
        "eve_id",
        "sal_id",
        "eve_nombre",
        "eve_costo",
        [
          sequelize.fn("COUNT", sequelize.col("Participantes.par_id")),
          "cantidad_participantes",
        ],
      ],
      include: [
        {
          model: Participante,
          attributes: [],
          through: { attributes: [] },
        },
      ],
      group: ["Evento.eve_id"],
    });
    res.json(response);
  } catch (error) {
    console.error(error);
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
  const { eve_id, par_id } = req.body;
  let { evepar_cantidad } = req.body;

  try {
    // Si no se envía la cantidad, tomamos el costo del evento por defecto
    if (evepar_cantidad === undefined || evepar_cantidad === null) {
      const evento = await Evento.findByPk(eve_id);
      if (evento) {
        evepar_cantidad = evento.eve_costo;
      } else {
        evepar_cantidad = 0;
      }
    }

    const response = await EventoParticipante.create({
      eve_id,
      par_id,
      evepar_cantidad: evepar_cantidad || 0, // Fallback to 0 if still null
    });
    res.json(response);
  } catch (error) {
    console.error("Error al asignar participante:", error);
    res.status(500).json(error);
  }
};

const deleteParticipanteDeEvento = async (req, res) => {
  const { eve_id, par_id } = req.query;

  try {
    const deleted = await EventoParticipante.destroy({
      where: { eve_id, par_id },
    });

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
    // Sequelize devuelve objetos anidados por defecto.
    // Se busca mantener la estructura plana original si es necesario, pero JSON jerárquico es comúnmente preferido.

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

    // Aplanando la respuesta para coincidir con el comportamiento original.

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
          attributes: ["par_cedula", "par_nombre", "par_id"],
          through: {
            attributes: ["evepar_cantidad"],
          },
        },
      ],
      order: [[Participante, "par_id", "ASC"]],
    });

    if (!response) return res.json([]);

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
    // Consulta de tres vías: Participante -> Evento -> Sala
    // El usuario requiere: sal_nombre, eve_nombre, eve_costo, par_nombre, evepar_cantidad

    const response = await Participante.findOne({
      where: { par_id },
      attributes: ["par_nombre"],
      include: [
        {
          model: Evento,
          attributes: ["eve_nombre", "eve_costo", "eve_id"],
          through: {
            attributes: ["evepar_cantidad"],
          },
          include: [
            {
              model: Sala,
              attributes: ["sal_nombre", "sal_id"],
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
      // Evento pertenece a Sala
      const sala = evento.Sala;
      flatResponse.push({
        eve_id: evento.eve_id,
        sal_id: sala ? sala.sal_id : null,
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
  deleteParticipanteDeEvento,
  getSalasConEventos,
  getEventoConParticipantes,
  getSalasEventosDeParticipante,
  getParticipantes,
};
