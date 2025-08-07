const express = require("express");
const router = express.Router();
const usersController = require("../controllers/usersControllers");
const { authenticate, authorizeSuperadmin } = require("../middleware/authMiddleware");

router.get("/", usersController.getUsers);

router.post("/post", usersController.createUser);

// Menggunakan middleware autentikasi
router.put("/:id", authenticate, usersController.updateUser);

// Middleware autentikasi + otorisasi superadmin
router.delete("/:id", authenticate, authorizeSuperadmin, usersController.deleteUser);

router.put("/change", authenticate, usersController.changePassword);


module.exports = router;
