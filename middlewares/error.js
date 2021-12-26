const ErrorStatus = require('../errors/errors');

const errorHandler = (err, req, res, next) => {
  const error = ErrorStatus.showErrorStatus(err);
  const status = error.statusCode;
  const { message } = error;

  res.status(status).send({ message });

  next();
};

module.exports = errorHandler;
