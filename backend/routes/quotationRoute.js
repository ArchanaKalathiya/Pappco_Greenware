const express = require("express");
const { quotation, getQuotation, deleteQuotation } = require("../controllers/quotationController");
const router = express.Router();
const {protect } = require("../middlewares/authMiddleware");

router.post("/", protect, quotation);
router.get('/:id', protect, getQuotation);
router.delete('/:id', protect, deleteQuotation);


module.exports = router;
