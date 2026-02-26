const express = require("express");
const { getHint } = require("../controllers/hint.controller");

const router = express.Router();

router.post("/", getHint);

module.exports = router;
