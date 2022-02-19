const User = require("../models/User");
const {
    AccountExistsError,
    BadRequestError,
    UnauthenticatedError,
    NotFoundError,
} = require("../errors/index");
const { StatusCodes, OK } = require("http-status-codes");

const getAllUsers = async(req, res) => {
    const users = await User.find({}).select("-password");

    res.status(StatusCodes.OK).json(users);
};
const getSingleUser = async(req, res) => {
    const user = await User.findOne({ _id: req.params.id }).select("-password");

    if (!user) {
        throw new NotFoundError(`User with id - ${req.params.id} not found `);
    }
    res.status(StatusCodes.OK).json(user);
};
const updateUser = async(req, res) => {
    const { email, name } = req.body;

    const user = await User.findOne({ _id: req.params.id });

    if (!user) {
        throw new NotFoundError("User not found");
    }

    user.email = email;
    user.name = name;

    await user.save();

    res
        .status(StatusCodes.CREATED)
        .json({ msg: "User details updated successfully" });
};

const updateUserPassword = async(req, res) => {
    const { oldPassword, newPassword } = req.body;

    if (!oldPassword || !newPassword) {
        throw new BadRequestError("Please provide both old and new Passwords");
    }

    console.log("Passwords", oldPassword, newPassword, req.user);
    const user = await User.findOne({ _id: req.user.userId });

    const isPasswordRight = await user.comparePassword(oldPassword);
    console.log("User", isPasswordRight);
    if (!isPasswordRight) {
        throw new UnauthenticatedError("Invalid Credentials");
    }

    user.password = newPassword;

    await user.save();

    res.status(StatusCodes.OK).json({ msg: "Password updated successfully." });
};

module.exports = {
    getAllUsers,
    getSingleUser,
    updateUser,
    updateUserPassword,
};