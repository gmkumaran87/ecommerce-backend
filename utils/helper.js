const jwt = require("jsonwebtoken");
const { randomBytes } = require("crypto");

const createToken = (payload) => {
    const token = jwt.sign(payload, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN,
    });

    return token;
};

const verifyToken = (token) => jwt.verify(token, process.env.JWT_SECRET);

const randomStringGenerator = () => randomBytes(20).toString("hex");

module.exports = { createToken, verifyToken, randomStringGenerator };