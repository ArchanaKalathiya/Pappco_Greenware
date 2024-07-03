const express = require("express");
const { 
    createProduct,
    getProduct,
    getSingleProduct, 
    deleteProduct, 
    updateProduct, 
    availableProducts,
    selectProduct,
    updateUserProductSelection,
    deleteUserProductSelection,
} = require("../controllers/productController");
const {protect, adminOrinventory} = require("../middlewares/authMiddleware");
const {upload} = require("../utils/fileUpload");

const router = express.Router();

// Routes for getting products (available to all authenticated users)
router.get("/", protect, getProduct);
router.get("/available", protect, availableProducts);
router.get("/:id", protect, getSingleProduct);

// Routes for creating, updating, and deleting products (restricted to admin)
router.post("/", protect, adminOrinventory, upload.single("image"), createProduct);
router.patch("/:id", protect, adminOrinventory, upload.single("image"), updateProduct);
router.delete("/:id", protect, adminOrinventory,deleteProduct);

// Route for selecting a product by a user 
router.put('/select/:id', protect, selectProduct);
// Route for deleting a selected product by user 
router.delete("/selection/:id", protect, deleteUserProductSelection);
// Route for updating a selected product by user
router.put("/update-selection/:id", protect, updateUserProductSelection);

module.exports = router;