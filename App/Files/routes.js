const express = require("express");
const router = express.Router();
const Controller = require("./controller");
const {
  authenticateToken,
  uploadFileValidator,
} = require("../../Functions/Middlewares");

router.post("/", authenticateToken, uploadFileValidator, Controller.Upload);
router.get("/", authenticateToken, Controller.List);
router.get("/:id", authenticateToken, Controller.Read);
router.put("/:id", authenticateToken, Controller.Update);
router.delete("/:id", authenticateToken, Controller.Delete);

module.exports = router;
