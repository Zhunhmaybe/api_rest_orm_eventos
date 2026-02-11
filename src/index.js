//Packages
const express = require("express");
const app = express();
const { sequelize } = require("../models");
const cors = require("cors"); // Import cors

// Middlewears
app.use(cors()); // Use cors
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use(require("../routes/index"));

// Service Execution
const startServer = async () => {
  try {
    await sequelize.authenticate();
    console.log("Database connection has been established successfully.");

    // Sync database and seed admin user
    await sequelize.sync();

    // Check/Create Admin
    const { Usuario } = require("../models");
    try {
      const admin = await Usuario.findOne({ where: { usu_nombre: "admin" } });
      if (!admin) {
        await Usuario.create({
          usu_nombre: "admin",
          usu_password: "admin",
        });
        console.log("Usuario admin (password: admin) creado por defecto");
      }
    } catch (e) {
      console.error("Error seeding admin:", e);
    }

    app.listen(3000);
    console.log("Server running in: http://localhost:3000");
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  }
};

startServer();
