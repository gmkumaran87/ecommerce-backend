const Cart = require("../models/Cart");
const { StatusCodes } = require("http-status-codes");
const CustomError = require("../errors");

const createCart = async(req, res) => {
    const {
        body: { productId, quantity, price },
        user: { userId },
    } = req;

    let cart = await Cart.findOne({ userId: userId });

    if (!cart) {
        const newCart = await Cart.create({
            userId: userId,
            products: [{ productId, quantity, price }],
        });

        return res
            .status(StatusCodes.CREATED)
            .json({ msg: "Cart created", newCart });
    } else {
        // If the Cart is already avaiable for the User

        const itemIndex = await cart.products.findIndex(
            (p) => p.productId == productId
        );

        if (itemIndex > -1) {
            let productItem = cart.products[itemIndex];
            productItem.quantity = quantity;
            cart.products[itemIndex] = productItem;
        } else {
            await cart.products.push({ productId, quantity, price });
        }
        cart = await cart.save();

        return res.status(StatusCodes.CREATED).json(cart);
    }
};
const deleteCart = async(req, res) => {
    res.send("Creating cart");
};
const updateCart = async(req, res) => {
    res.send("Creating cart");
};
const getCart = async(req, res) => {
    const cart = await Cart.findOne({ usreId: req.body.user.userId });

    if (!cart) {
        throw new CustomError.NotFoundError("Cart not found");
    }
    res.status(StatusCodes.OK).json({ msg: "Cart found", cart });
};
const getAllCarts = async(req, res) => {
    const carts = await Cart.find({});
    if (!carts) {
        throw new CustomError.NotFoundError("Cart not found");
    }
    res.status(StatusCodes.OK).json({ msg: "Carts found", carts });
};

module.exports = { createCart, deleteCart, updateCart, getAllCarts, getCart };