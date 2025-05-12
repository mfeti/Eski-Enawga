const errorHandler = async (err, req, res, next) => {
  try {
    err.statusCode = err.statusCode || 500;
    err.message = err.message || "Internal server error";

    // wrong mongodb id
    if (err.name === "CastError") {
      const message = `Resource not found. Invalid: ${err.path} `;
      return res.status(404).json({ success: false, message });
    }

    // duplicate key value
    if (err.code === 11000) {
      const message = `Duplicate field value: ${Object.keys(err.keyValue)[0]}`;
      return res.status(409).json({ success: false, message });
    }

    // JWT error
    if (err.name === "JsonWebTokenError") {
      const message = "Invalid token. Please log in again.";
      return res.status(401).json({ success: false, message });
    }

    // JWT expire error
    if (err.name === "TokenExpiredError") {
      const message = "Token expired. Please log in again.";
      return res.status(401).json({ success: false, message });
    }
    res.status(err.statusCode).json({ success: false, message: err.message });
  } catch (error) {
    next(error);
  }
};

export default errorHandler;
