const express = require("express");
const { quotation } = require("../controllers/quotationController");
const router = express.Router();
const protect = require("../middlewares/authMiddleware");

router.post("/", protect, quotation);

module.exports = router;
