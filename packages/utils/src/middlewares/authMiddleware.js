const jwt = require('jsonwebtoken');
const { AppError } = require('../errors/AppError');

const authMiddleware = (rolesOrFunction = []) => {
    return (req, res, next) => {
        let requiredRoles = [];
        if(typeof rolesOrFunction === "function"){
            requiredRoles = rolesOrFunction();
        }
        else{
            requiredRoles = rolesOrFunction;
        }
        const token = req.cookies.authToken;
        if (!token) throw new AppError("Unauthorized", 401);
        const payload = jwt.verify(token, process.env.JWT_SECRET,function(err,decodedToken){
            if(err){
                throw new AppError("Token Expired",401);
            }
            return decodedToken;
        });
        req.user = {
            id: payload.userId,
            roles: payload.roles,
        };
        console.log('roles payload.roles',requiredRoles,payload.roles);
        if(!requiredRoles.length){
            throw new AppError("Something went wrong", 500);
        }
        if (!requiredRoles.some(r => payload.roles.includes(r))) {
            throw new AppError("Forbidden", 403);
        }
        next();
    };
};

module.exports = { authMiddleware };
