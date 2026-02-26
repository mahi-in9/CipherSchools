const { Pool } = require("pg");

const pgPool = new Pool({
  connectionString: process.env.POSTGRES_URI,
  ssl:
    process.env.NODE_ENV === "production"
      ? { rejectUnauthorized: false }
      : false,
});

const connectPostgres = async () => {
  try {
    const client = await pgPool.connect();
    console.log("PostgreSQL Connected");
    client.release();
  } catch (error) {
    console.error("PostgreSQL connection error:", error.message);
    process.exit(1);
  }
};

module.exports = { pgPool, connectPostgres };
