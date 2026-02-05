const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Sala = sequelize.define(
  "Sala",
  {
    sal_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    sal_nombre: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    sal_descripcion: {
      type: DataTypes.TEXT,
      allowNull: true, 
    },
    sal_estado: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
    },
  },
  {
    tableName: "sala",
    timestamps: false,
  },
);

module.exports = Sala;
