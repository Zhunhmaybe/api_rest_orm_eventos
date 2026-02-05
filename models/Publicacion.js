const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Publicacion = sequelize.define(
  "Publicacion",
  {
    pub_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    cat_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    aut_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    pub_titulo: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    pub_descripcion: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  {
    tableName: "publicacion",
    timestamps: false,
  },
);

module.exports = Publicacion;
