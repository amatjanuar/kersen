const express = require("express");
const router = express.Router();
const productController = require("../controllers/productController");
const { authenticate, authorizeSuperadmin } = require("../middleware/authMiddleware");

// GET semua produk (public)
router.get("/", productController.getProduct);


router.post("/post", authenticate, authorizeSuperadmin,  productController.post);
router.put("/update", authenticate, authorizeSuperadmin, productController.put);
router.delete("/:id", authenticate, authorizeSuperadmin, productController.deletePro);

module.exports = router;
