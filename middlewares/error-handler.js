export function notFoundError(req, res, next) {
<<<<<<< HEAD
    const err = new Error(`Not Found`);
    err.status = 404;
    next(err);
}

export function errorHundler(err, req, res, next) {
    res.status(err.status || 500).json({
        message: err.message
    });
}
=======
  const err = new Error("Not Found");
  err.status = 404;
  next(err);
}

export function errorHandler(err, req, res, next) {
  res.status(err.status || 500).json({
    message: err.message,
  });
}
>>>>>>> anis
