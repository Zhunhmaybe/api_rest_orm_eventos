const sequelize = require("../config/database");
const Sala = require("./Sala");
const Evento = require("./Evento");
const Participante = require("./Participante");
const EventoParticipante = require("./EventoParticipante");
const Publicacion = require("./Publicacion");
const Comentario = require("./Comentario");
const Usuario = require("./Usuario");

// Associations
Sala.hasMany(Evento, { foreignKey: "sal_id" });
Evento.belongsTo(Sala, { foreignKey: "sal_id" });

Evento.belongsToMany(Participante, {
  through: EventoParticipante,
  foreignKey: "eve_id",
  otherKey: "par_id",
});
Participante.belongsToMany(Evento, {
  through: EventoParticipante,
  foreignKey: "par_id",
  otherKey: "eve_id",
});

Publicacion.hasMany(Comentario, { foreignKey: "pub_id" });
Comentario.belongsTo(Publicacion, { foreignKey: "pub_id" });

module.exports = {
  sequelize,
  Sala,
  Evento,
  Participante,
  EventoParticipante,
  Publicacion,
  Comentario,
  Usuario,
};
