const express = require("express");
const Controller = require("./controller");
const {
  authenticateToken,
  registerUserBodyValidator,
  existingUserValidator,
} = require("../../Functions/Middlewares");

const router = express.Router();

router.post(
  "/",
  registerUserBodyValidator,
  existingUserValidator,
  Controller.Create
);
router.post("/login", Controller.Login);
router.patch("/:id", authenticateToken, Controller.Update);
router.delete("/:id", authenticateToken, Controller.Delete);

module.exports = router;
