const express = require("express");
const router = express.Router();
const categoryControllers = require("../controllers/categoryControllers");
const { authenticate, authorizeSuperadmin } = require("../middleware/authMiddleware");

// GET bisa diakses siapa saja
router.get("/", categoryControllers.getCategories);

// POST, PUT, DELETE hanya bisa diakses oleh superadmin
router.post("/post", authenticate, authorizeSuperadmin, categoryControllers.postCategory);
router.put("/:id", authenticate, authorizeSuperadmin, categoryControllers.updateCategory);
router.delete("/:id", authenticate, authorizeSuperadmin, categoryControllers.deleteCategory);

module.exports = router;
