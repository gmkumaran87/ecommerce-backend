const {
    AccountExistsError,
    BadRequestError,
    UnauthenticatedError,
    NotFoundError,
    UnauthorizedError,
} = require("../errors/index");
const CustomError = require("../errors");
const { verifyToken } = require("../utils/helper");

const authenticateUser = async(req, res, next) => {
    // console.log("Inside authentication", req.headers);
    const header = req.headers.authorization;

    const [bearer, token] = header.split(" ");

    if (!header || bearer != "Bearer") {
        throw new UnauthenticatedError("Invalid Authentications");
    }

    try {
        const payload = verifyToken(token);

        req.user = {
            name: payload.name,
            userId: payload.userId,
            roles: payload.role,
        };
        next();
    } catch (error) {
        throw new UnauthenticatedError("Invalid Authentications");
    }
};

const authorizePermission = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.roles)) {
            throw new CustomError.UnauthorizedError(
                "Unauthorized to access this route"
            );
        }
        next();
    };
};

module.exports = { authenticateUser, authorizePermission };