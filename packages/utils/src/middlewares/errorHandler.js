const { AppError } =  require("../errors/AppError");

function errorHandler(
  err,req,res,next
) {
  console.log(err);
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      status: "error",
      message: err.message,
    });
  }


  return res.status(500).json({
    status: "error",
    message: "Internal Server Error",
  });
}

module.exports = {
  errorHandler,
}