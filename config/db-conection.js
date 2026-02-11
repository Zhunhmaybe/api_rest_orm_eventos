const pgPromise = require("pg-promise");
const config = {
  host: "aws-1-us-east-1.pooler.supabase.com",
  port: 5432,
  database: "postgres",
  user: "postgres.epmbqjxuewvhgdmmpxtq",
  password: "c7LHBltsNbKsm0A5",
  ssl: { rejectUnauthorized: false },
};
const pgp = pgPromise({});
const db = pgp(config);

exports.db = db;
