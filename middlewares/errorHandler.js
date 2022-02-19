const { StatusCodes } = require("http-status-codes");

const errorHandler = (err, req, res) => {
    let customError = {
        statusCode: err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR,
        msg: err.message || "Something went wrong try again later",
    };
    console.log("Error in handler", err, customError);

    return res.status(customError.statusCode).json({ msg: customError.msg });
};

module.exports = errorHandler;