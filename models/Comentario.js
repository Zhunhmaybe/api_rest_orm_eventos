const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");
const Publicacion = require("./Publicacion");

const Comentario = sequelize.define(
  "Comentario",
  {
    com_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    pub_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: Publicacion,
        key: "pub_id",
      },
    },
    aut_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    com_descripcion: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  {
    tableName: "comentario",
    timestamps: false,
  },
);

module.exports = Comentario;
