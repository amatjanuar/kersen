const express = require("express");
const router = express.Router();
const usersController = require("../controllers/usersControllers");

router.get("/", usersController.getUsers);

router.post("/post", usersController.createUser);

module.exports = router