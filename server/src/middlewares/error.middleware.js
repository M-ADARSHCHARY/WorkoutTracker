const errorMiddleware = (err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  console.log(statusCode)
  // Log full error for debugging (server-side only)
  console.error("💥 ERROR:", err);

  res.status(statusCode).json({
    success: false,
    message:
      statusCode === 500
        ? "Internal Server Error"
        : err.message,
  });
};

export default errorMiddleware;
