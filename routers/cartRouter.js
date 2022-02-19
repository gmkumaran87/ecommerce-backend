const router = require("express").Router();
const {
    authorizePermission,
    authenticateUser,
} = require("../middlewares/authenticate");
const {
    createCart,
    deleteCart,
    updateCart,
    getAllCarts,
    getCart,
} = require("../controllers/cartController");

router
    .route("/")
    .get([authenticateUser, authorizePermission("admin")], getAllCarts)
    .post(authenticateUser, createCart);

router
    .route("/:id")
    .get(authenticateUser, getCart)
    .delete(authenticateUser, deleteCart)
    .patch(authenticateUser, updateCart);

module.exports = router;