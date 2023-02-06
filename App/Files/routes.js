const express = require("express");
const { authenticateToken } = require("../../Functions/Middlewares");
const Controller = require("./controller");

const router = express.Router();

router.post("/", authenticateToken, Controller.Upload);
router.get("/", authenticateToken, Controller.List);
router.get("/:id", authenticateToken, Controller.Read);
router.put("/:id", authenticateToken, Controller.Update);
router.delete("/:id", authenticateToken, Controller.Delete);

module.exports = router;
