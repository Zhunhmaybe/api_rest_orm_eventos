const { Sequelize } = require("sequelize");

const sequelize = new Sequelize(
  "postgres",
  "postgres.epmbqjxuewvhgdmmpxtq",
  "c7LHBltsNbKsm0A5",
  {
    host: "aws-1-us-east-1.pooler.supabase.com",
    port: 5432,
    dialect: "postgres",
    logging: false,
  },
);

module.exports = sequelize;
