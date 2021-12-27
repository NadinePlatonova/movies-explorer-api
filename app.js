const express = require('express');
const mongoose = require('mongoose');
const helmet = require('helmet');
const cookieParser = require('cookie-parser');
const { celebrate, Joi, errors } = require('celebrate');
const NotFoundError = require('./errors/not-found-error');

const {
  createUser,
  login,
  logout,
} = require('./controllers/users');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const limiter = require('./middlewares/rate-limiter');
const userRouter = require('./routes/users');
const movieRouter = require('./routes/movies');

const { PORT = 3000 } = process.env;
const { MONGODB_URL } = require('./config');

const app = express();

const auth = require('./middlewares/auth');
const errorHandler = require('./middlewares/error');

limiter.handleRateLimit(app);

mongoose.connect(MONGODB_URL, {
  useNewUrlParser: true,
  autoIndex: true,
});

app.use(helmet());
app.use(cookieParser());
app.use(express.json());
app.use(requestLogger);

app.post('/signup', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
}), createUser);
app.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
}), login);
app.post('/signout', logout);
app.use(auth);

app.use('/', userRouter);
app.use('/', movieRouter);
// eslint-disable-next-line no-unused-vars
app.use((req, res) => {
  throw new NotFoundError('Что-то пошло не так...');
});

app.use(errorLogger);
app.use(errors());
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
