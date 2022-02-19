const express = require("express");
const {
    register,
    login,
    resetPassword,
    emailValidation,
    forgotPassword,
} = require("../controllers/auth");

const router = express.Router();

router.route("/register").post(register);
router.route("/login").post(login);
router.route("/forgot-password").post(forgotPassword);
router.route("/emailValidation/:userId/:randomStr").post(emailValidation);
router.route("reset-password").patch(resetPassword);

module.exports = router;