const express = require("express");
const router = express.Router();
const categoryControllers = require("../controllers/categoryControllers")

router.get("/", categoryControllers.getCategories)

router.post("/post", categoryControllers.postCategory)

router.put("/:id", categoryControllers.updateCategory)

router.delete("/:id", categoryControllers.deleteCategory)

module.exports = router;