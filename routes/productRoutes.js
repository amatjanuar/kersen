const express = require("express");
const router = express.Router();
const productController = require("../controllers/productController");
const { authenticate } = require("../middleware/authMiddleware");

// GET semua produk (public)
router.get("/", productController.getProduct);


router.post("/post", authenticate,  productController.post);
router.put("/update", authenticate,  productController.put);
router.delete("/:id", authenticate,  productController.deletePro);

module.exports = router;
