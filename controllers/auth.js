const User = require("../models/User");
const {
    AccountExistsError,
    BadRequestError,
    UnauthenticatedError,
} = require("../errors/index");
const { StatusCodes } = require("http-status-codes");
const { createToken } = require("../utils/helper");
const sendGridMail = require("../utils/sendMail");

const register = async(req, res) => {
    const { email } = req.body;

    const userExists = await User.findOne({ email: email });

    if (userExists) {
        throw new AccountExistsError("Email entered is already exists");
    }

    const firstUser = await User.countDocuments({});

    console.log("User count", firstUser);

    req.body.role = firstUser === 0 ? "admin" : "user";

    // Creating Confirmation token
    const confirmationToken = createToken({
        email,
        randomId: Math.floor(Math.random() * 100) + 1,
    });

    req.body.activationCode = confirmationToken;
    req.body.isActive = false;

    console.log("User", req.body);

    const user = await User.create(req.body);

    // Account Activation link
    const activationLink = `${process.env.ACCOUNT_ACTIVATION_URL}/${confirmationToken}`;

    try {
        // Sending email
        const mailInfo = sendGridMail(
            req.body.email,
            activationLink,
            "Activate Account"
        );
    } catch (error) {
        console.log(error);
    }

    const { password, ...others } = user._doc;
    res
        .status(StatusCodes.CREATED)
        .json({ msg: "Registered Successfully", others });
};
const login = async(req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        throw new BadRequestError("Please provide Email and Password");
    }

    const user = await User.findOne({ email });

    if (!user) {
        throw new UnauthenticatedError("Invalid email");
    }

    const isPasswordCorrect = await user.comparePassword(password);

    if (!isPasswordCorrect) {
        throw new UnauthenticatedError("Invalid Credentials");
    }

    // Creating Payload for creating token
    const tokenUser = { name: user.name, userId: user._id, role: user.role };

    const token = createToken(tokenUser);

    // console.log("TOken created", token);

    res
        .status(StatusCodes.CREATED)
        .json({ name: tokenUser.name, userId: user._id, role: user.role, token });
};

const forgotPassword = async(req, res) => {
    const { email } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
        throw new NotFoundError("Entered email NOT_FOUND, Please verify");
    }

    user.passwordResetStr = randomStringGenerator();

    await user.save();

    const resetLink = `${process.env.FORGOT_PASSWORD_URL}/${user._id}/${user.passwordResetStr}`;
    // Sending email
    const mailInfo = sendGridMail(email, resetLink, "Reset Password");

    res
        .status(StatusCodes.OK)
        .json({ msg: "Please check your email for the Password reset Link" });
};
const emailValidation = async(req, res) => {
    const { userId, randomStr } = req.params;

    const userExists = await User.findOne({
        _id: userId,
        passwordResetStr: randomStr,
    });

    if (!userExists) {
        throw new BadRequestError("Password reset link is not valid");
    }
    res.status(StatusCodes.OK).json({
        msg: "Password Reset link validation is successfull",
        userExists,
    });
};
const resetPassword = async(req, res) => {
    const { confirmPassword, newPassword, userId, randomStr } = req.body;

    if (!confirmPassword || !newPassword) {
        throw new BadRequestError("Please enter both password");
    }
    const user = await User.findOne({ _id: userId, passwordResetStr: randomStr });

    if (!user) {
        throw new BadRequestError("Reset link not valid");
    }

    console.log("User", user);
    user.password = confirmPassword;

    await user.save();

    console.log("After passoword updt", user);
    res.status(StatusCodes.OK).json({ msg: "Password updated successfully" });
};

module.exports = {
    register,
    login,
    forgotPassword,
    emailValidation,
    resetPassword,
};