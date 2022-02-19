const mongoose = require("mongoose");

const ProductSchema = new mongoose.Schema({
    name: {
        type: String,
        trim: true,
        required: [true, "Please enter the Product name"],
        maxlength: [100, "Name cannot more than 100 characters"],
    },
    desc: {
        type: String,
        required: [true, "Please enter the Product description"],
    },
    price: {
        type: Number,
        required: [true, "Please enter the Product price"],
        default: 0,
    },
    image: {
        type: String,
        default: "uploads/Mens-Jake.png",
    },
    category: {
        type: [String],
        required: [true, "Please enter category values"],
    },
    colors: {
        type: [String],
        required: true,
    },
    user: {
        type: mongoose.Types.ObjectId,
        ref: "User",
    },
}, { timestamps: true });

module.exports = mongoose.model("Product", ProductSchema);