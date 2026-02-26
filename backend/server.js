require("dotenv").config();

const express = require("express");
const cors = require("cors");

const connectMongoDB = require("./src/config/mongo.js");
const { connectPostgres } = require("./src/config/postgres.js");

const app = express();

connectMongoDB();
connectPostgres();

app.use(express.json());

const PORT = process.env.PORT || 3000;

app.get("/", (req, res) => {
  res.send("CipherSQLStudio API running");
});

app.use((req, res) => {
  res.status(404).json({ error: "Route not found" });
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: "Server error" });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
