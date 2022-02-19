const express = require("express");
const {
    getAllUsers,
    getSingleUser,
    updateUser,
    updateUserPassword,
} = require("../controllers/userController");
const router = express.Router();
const {
    authenticateUser,
    authorizePermission,
} = require("../middlewares/authenticate");

router
    .route("/")
    .get([authenticateUser, authorizePermission("admin")], getAllUsers);

// router.route("/updateUser").post(updateUser);

router.route("/update-password").patch(authenticateUser, updateUserPassword);
router
    .route("/:id")
    .get([authenticateUser, authorizePermission("admin")], getSingleUser)
    .patch([authenticateUser, authorizePermission("admin")], updateUser);

module.exports = router;