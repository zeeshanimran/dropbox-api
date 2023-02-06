const express = require("express");
const middleware = require("../../Functions/Middlewares");
const Controller = require("./controller");

const router = express.Router();

router.post("/", Controller.Create);
router.post("/login", Controller.Login);
router.patch("/:id", middleware.authenticateToken, Controller.Update);
router.delete("/:id", middleware.authenticateToken, Controller.Delete);

module.exports = router;
