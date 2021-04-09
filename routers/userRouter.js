const router = require("express").Router();
const userController = require("../controllers/userController");
const { verifyToken } = require("../controllers/authController");

router.get("/", userController.getAllUsers);
router.get("/:id", verifyToken, userController.getSingleUser);
router.patch("/:id", userController.updateUser);
router.delete("/:id", userController.deleteUser);

module.exports = router;
