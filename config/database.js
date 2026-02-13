const { Sequelize } = require("sequelize");

const sequelize = new Sequelize(

  "Eventos",
  "postgres",
  "123",
  {
    host:"localhost",
    dialect:"postgres",
    logging:false,
  }
  


  //"postgres",
  //"postgres.epmbqjxuewvhgdmmpxtq",
  //"c7LHBltsNbKsm0A5",
  //{
  //  host: "aws-1-us-east-1.pooler.supabase.com",
  //  port: 5432,
  //  dialect: "postgres",
  //  logging: false,
  //  dialectOptions: {
  //    ssl: {
  //      require: true,
  //      rejectUnauthorized: false,
  //    },
  //  },
  //},
);

module.exports = sequelize;
