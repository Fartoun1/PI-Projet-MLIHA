/*
The error Not Found from the notFoundError function indicates that the requested 
route does not match any of the defined routes in your Express application. 
This middleware function is typically used as a catch-all for handling 
requests to undefined routes.
*/

// we should pu this two functions after all routes.

export function notFoundError(req, res, next) {
  const err = new Error("Not Found");
  err.status = 404;
  next(err);
}

export function errorHandler(err, req, res, next) {
  res.status(err.status || 500).json({
    message: err.message,
  });
}
