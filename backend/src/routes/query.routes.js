const express = require("express");
const {executeQuery} = require("../controllers/queryController")

const router = express.Router();

router.post("/execute", executeQuery);

module.exports = router;
