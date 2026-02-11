const { Sequelize, DataTypes } = require("sequelize");

// Setup query
const sequelize = new Sequelize("Eventos", "postgres", "12345", {
    host: "localhost",
    dialect: "postgres",
    logging: console.log, // Enable logging to see actual SQL
});

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

async function testConnection() {
    try {
        await sequelize.authenticate();
        console.log("Connection has been established successfully.");

        const eventos = await Evento.findAll();
        console.log("Eventos found:", JSON.stringify(eventos, null, 2));

    } catch (error) {
        console.error("Unable to connect to the database:", error);
    } finally {
        await sequelize.close();
    }
}

testConnection();
