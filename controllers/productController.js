const Product = require("../models/Product");
const { StatusCodes } = require("http-status-codes");
const CustomError = require("../errors");

const createProduct = async(req, res) => {
    req.body.user = req.user.userId;
    const product = await Product.create(req.body);
    res
        .status(StatusCodes.CREATED)
        .json({ msg: "Product created successfully", product });
};
const getAllProducts = async(req, res) => {
    const { category, sort, colors } = req.query;

    const queryObj = {};

    if (colors) {
        queryObj.colors = { $in: [colors] };
    }
    if (category) {
        queryObj.category = { $in: [category] };
    }

    let result = Product.find(queryObj);
    if (sort) {
        const sortList = sort.split(",").join(" ");
        result = result.find().sort(sortList);
    } else {
        result = result.find().sort("createdAt");
    }
    const products = await result;
    res.status(StatusCodes.OK).json(products);
};
const getSingleProduct = async(req, res) => {
    const { id: productId } = req.params;

    const product = await Product.findOne({ _id: productId });

    if (!product) {
        throw new CustomError.NotFoundError("Product with ID not found");
    }

    res.status(StatusCodes.OK).json(product);
};
const updateProduct = async(req, res) => {
    const { id: productId } = req.params;

    const product = await Product.findOneAndUpdate({ _id: productId }, req.body, {
        new: true,
        runValidators: true,
    });

    if (!product) {
        throw new CustomError.NotFoundError("Product with ID not found");
    }

    res.status(StatusCodes.OK).json(product);
};
const deleteProduct = async(req, res) => {
    const { id: productId } = req.params;

    const product = await Product.findOneAndDelete({ _id: productId });

    if (!product) {
        throw new CustomError.NotFoundError("Product with ID not found");
    }

    res.status(StatusCodes.OK).json({ msg: "Product deleted" });
};

const uploadImage = async(req, res) => {
    res.send("Image upload Products");
};

module.exports = {
    getAllProducts,
    getSingleProduct,
    updateProduct,
    deleteProduct,
    uploadImage,
    createProduct,
};