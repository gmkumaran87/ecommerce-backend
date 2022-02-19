const AccountExistsError = require("./already-exists");
const CustomApiError = require("./custom-api");
const UnauthenticatedError = require("./unauthenticated");
const NotFoundError = require("./not-found");
const BadRequestError = require("./bad-request");
const UnauthorizedError = require("./unAuthorized");

module.exports = {
    CustomApiError,
    UnauthenticatedError,
    NotFoundError,
    BadRequestError,
    AccountExistsError,
    UnauthorizedError,
};