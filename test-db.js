const { Client } = require("pg");

const client = new Client({
  user: "postgres",
  host: "localhost",
  database: "eventos",
  password: "123",
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
