const { Client } = require("pg");

const client = new Client({
  user: "postgres",
  host: "localhost",
  database: "eventos",
  password: "12345",
  port: 5432,
});

client
  .connect()
  .then(() => {
    console.log("Connected successfully");
    client.end();
  })
  .catch((err) => {
    console.error("Connection error", err.stack);
    client.end();
  });
