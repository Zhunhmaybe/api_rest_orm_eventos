//Packages
const express = require("express");
const app = express();
const { sequelize } = require("../models");
const cors = require('cors'); // Import cors

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
    // await sequelize.sync(); // Uncomment to create tables if they don't exist
    app.listen(3000);
    console.log("Server running in: http://localhost:3000");
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  }
};

startServer();
