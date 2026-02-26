require("dotenv").config();

const express = require("express");
const cors = require("cors");

const connectMongoDB = require("./src/config/mongo.js");
const { connectPostgres } = require("./src/config/postgres.js");

const assignmentRoutes = require("./src/routes/assignment.routes.js");
const queryRoutes = require("./src/routes/query.routes.js");
const hintRoutes = require("./src/routes/hint.routes.js");

const app = express();

connectMongoDB();
connectPostgres();

app.use(cors());
app.use(express.json());

app.use("/api/assignments", assignmentRoutes);
app.use("/api/query", queryRoutes);
app.use("/api/hint", hintRoutes);

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
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
