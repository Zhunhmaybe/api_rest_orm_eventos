const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");
const Evento = require("./Evento");
const Participante = require("./Participante");

const EventoParticipante = sequelize.define(
  "EventoParticipante",
  {
    eve_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      references: {
        model: Evento,
        key: "eve_id",
      },
    },
    par_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      references: {
        model: Participante,
        key: "par_id",
      },
    },
    evepar_cantidad: {
      type: DataTypes.DECIMAL(8, 2),
      allowNull: true,
    },
  },
  {
    tableName: "evento_participante",
    timestamps: false,
  },
);

module.exports = EventoParticipante;
