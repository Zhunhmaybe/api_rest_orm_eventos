const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Participante = sequelize.define(
  "Participante",
  {
    par_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    par_cedula: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    par_nombre: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    par_correo: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  {
    tableName: "participante",
    timestamps: false,
  },
);

module.exports = Participante;
