const noEndpoint = (req, res, next) => {
  const error = new Error(`End point does not exist ${req.originalUrl}`);
  res.status(404);
  next(error);
};

const errorHandler = (err, req, res, next) => {
  let status = res.statusCode === 200 ? 500 : res.statusCode;
  let message = err.message;
  if (err.name === "CastError" && err.kind === "ObjectId") {
    status = 404;
    message = "Not found";
  }

  res.status(status).json({
    message,
    stack: process.env.DEV === "true" ? err.stack : null,
  });
};

export { noEndpoint, errorHandler };
