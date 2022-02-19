const mongoose = require("mongoose");

const CartSchema = new mongoose.Schema({
    products: [{
        productId: {
            type: String,
            required: [true, "Please provide Product Id"],
        },
        quantity: {
            type: Number,
            default: 1,
        },
        price: {
            type: Number,
            default: 0,
        },
    }, ],
    userId: {
        type: mongoose.Types.ObjectId,
        ref: "User",
    },
}, { timestamps: true });

module.exports = mongoose.model("Cart", CartSchema);