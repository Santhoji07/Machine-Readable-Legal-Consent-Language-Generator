const { Pool } = require("pg");

const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "consentdb",
  password: "YOUR_PASSWORD",
  port: 5432
});

module.exports = pool;
// Note: Replace "YOUR_PASSWORD" with your actual PostgreSQL password.