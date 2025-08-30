const jwt = require('jsonwebtoken');
const AppError = require('@repo/utils/appError');

const authMiddleware = (roles = []) => {
    return (req, res, next) => {
        const token = req.cookies.authToken;
        if (!token) throw new AppError("Unauthorized", 401);
        const payload = jwt.verify(token, process.env.JWT_SECRET,function(err){
            throw new AppError("Token Expired",401);
        });
        req.user = {
            id: payload.userId,
            roles: payload.roles,
        };
        if (roles.length && !roles.some(r => payload.roles.includes(r))) {
            throw new AppError("Forbidden", 403);
        }
        next();
    };
};

module.exports = authMiddleware;
