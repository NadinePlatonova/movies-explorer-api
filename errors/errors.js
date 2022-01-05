const ConflictError = require('./conflict-error');
const BadRequestError = require('./bad-request-error');
const ServerError = require('./server-error');

const INCORRECT_ID_ERROR = 'CastError';
const BAD_REQUEST_ERROR = 'ValidationError';
const MONGO_ERROR = 'MongoServerError';

const INCORRECT_ID_ERROR_MSG = 'Передан несуществующий _id';
const BAD_REQUEST_ERROR_MSG = 'Переданы некорректные данные';
const SERVER_ERROR_MSG = 'Произошла ошибка сервера';
const CONFLICT_ERROR_MSG = 'Пользователь с таким имейлом уже существует';

const UNAUTH_ERROR_CODES = new Set([401, 403, 404]);

const showErrorStatus = (err) => {
  if (UNAUTH_ERROR_CODES.has(err.statusCode)) return err;
  if (err.name === INCORRECT_ID_ERROR) return new BadRequestError(INCORRECT_ID_ERROR_MSG);
  if (err.name === BAD_REQUEST_ERROR) return new BadRequestError(BAD_REQUEST_ERROR_MSG);
  if (err.name === MONGO_ERROR && err.code === 11000) return new ConflictError(CONFLICT_ERROR_MSG);

  return new ServerError(SERVER_ERROR_MSG);
};

module.exports = {
  showErrorStatus,
};
