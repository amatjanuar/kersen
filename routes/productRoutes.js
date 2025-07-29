const express = require("express");
const router = express.Router();
const productController = require("../controllers/productController");

router.get("/", productController.getProduct);

router.post("/post", productController.post);

router.delete("/:id", productController.deletePro);

router.put("/:id", productController.put)

router.get("/filter", productController.filterproduct);

router.get("/page", productController.getPaginatedProducts)

router.get("/by-category", productController.filterByCategory)

module.exports = router
