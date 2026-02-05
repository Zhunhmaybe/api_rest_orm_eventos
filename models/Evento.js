const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");
const Sala = require("./Sala");

const Evento = sequelize.define(
  "Evento",
  {
    eve_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    sal_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: Sala,
        key: "sal_id",
      },
    },
    eve_nombre: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    eve_costo: {
      type: DataTypes.DECIMAL(8, 2),
      allowNull: true,
    },
  },
  {
    tableName: "evento",
    timestamps: false,
  },
);

module.exports = Evento;
