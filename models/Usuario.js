const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Usuario = sequelize.define(
  "usuario",
  {
    usu_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    usu_nombre: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    usu_password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    timestamps: false,
    tableName: "usuario",
  },
);

module.exports = Usuario;
