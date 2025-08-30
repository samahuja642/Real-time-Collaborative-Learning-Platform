const { AppError } = require("./errors/AppError");

function handlePrismaError(err) {
  if (err.code === 'P2002') {
    return new AppError('Duplicate entry: unique constraint failed', 409); // Conflict
  }
  if (err.code === 'P2025') {
    return new AppError('Record not found', 404); // Not Found
  }
  if (err.code === 'P2003') {
    return new AppError('Invalid reference (foreign key failed)', 400); // Bad Request
  }
  return new AppError(`Database error: ${err.code}`, 400);
}

module.exports = {
  handlePrismaError,
  ...require("./errors/AppError"),
  ...require("./middlewares/errorHandler"),
  ...require("./middlewares/sanitizeRequests"),
  ...require("./libs/redis"),
};