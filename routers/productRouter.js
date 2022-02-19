const {
    getAllProducts,
    getSingleProduct,
    updateProduct,
    deleteProduct,
    uploadImage,
    createProduct,
} = require("../controllers/productController");
const {
    authenticateUser,
    authorizePermission,
} = require("../middlewares/authenticate");

const router = require("express").Router();

router
    .route("/")
    .get(getAllProducts)
    .post([authenticateUser, authorizePermission("admin")], createProduct);

router
    .route("/image-upload/")
    .patch([authenticateUser, authorizePermission("admin")], uploadImage);
router
    .route("/:id")
    .get(getSingleProduct)
    .patch([authenticateUser, authorizePermission("admin")], updateProduct)
    .delete([authenticateUser, authorizePermission("admin")], deleteProduct);

module.exports = router;