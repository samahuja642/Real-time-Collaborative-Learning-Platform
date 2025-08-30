class AppError extends Error {
    statusCode;
    isOperational;
    constructor(message="It's Not You. It's because of us.",statusCode=500, isOperational=true){
        super(message);
        this.statusCode = statusCode
        this.isOperational = isOperational;
        Error.captureStackTrace(this,this.constructor);
    }
}
module.exports = {
    AppError,
}