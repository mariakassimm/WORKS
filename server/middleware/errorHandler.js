const notFound = (req, res, next) => {
  res.status(404);
  next(new Error(`Route not found: ${req.originalUrl}`));
};

const errorHandler = (err, req, res, next) => {
  let statusCode = res.statusCode && res.statusCode !== 200 ? res.statusCode : 500;
  let message = err.message || "Something went wrong. Please try again.";
  let recognized = false;

  if (err.name === "CastError") {
    statusCode = 404;
    message = "Resource not found.";
    recognized = true;
  }
  if (err.name === "ValidationError") {
    statusCode = 400;
    message = Object.values(err.errors).map((e) => e.message).join(", ");
    recognized = true;
  }
  if (err.code === 11000) {
    statusCode = 400;
    message = "A record with that value already exists.";
    recognized = true;
  }
  if (message.startsWith("Not allowed by CORS")) {
    statusCode = 403;
    message = "Not allowed by CORS";
    recognized = true; // keep this exact, deliberately generic message
  }
  if (err.type === "entity.parse.failed") {
    statusCode = 400;
    message = "Malformed request body.";
    recognized = true;
  }
  if (err.type === "entity.too.large") {
    statusCode = 413;
    message = "Request is too large.";
    recognized = true;
  }

  // Always log the real error server-side, regardless of environment.
  if (statusCode >= 500) {
    console.error("[Error]", err);
  }

  // Any *unrecognized* server error (Mongoose connection/buffering timeouts,
  // driver errors, unexpected exceptions, etc.) gets a generic, user-safe
  // message instead of leaking raw internals like "MongooseError: Operation
  // `products.find()` buffering timed out..." straight to the client.
  if (!recognized && statusCode >= 500) {
    message = "Something went wrong on our end. Please try again shortly.";
  }

  res.status(statusCode).json({
    success: false,
    message,
    // Opt-in only: an unset/misspelled NODE_ENV must never leak stack traces.
    stack: process.env.NODE_ENV === "development" ? err.stack : undefined,
  });
};

module.exports = { notFound, errorHandler };
