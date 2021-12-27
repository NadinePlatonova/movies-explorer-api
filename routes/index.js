const userRouter = require('./users');
const movieRouter = require('./movies');

const NotFoundError = require('../errors/not-found-error');

const {
  createUser,
  login,
  logout,
} = require('../controllers/users');

const {
  signupValidation,
  signinValidation,
} = require('../middlewares/validator');

const handleRoutes = (app, auth) => {
  app.post('/signup', signupValidation, createUser);
  app.post('/signin', signinValidation, login);
  app.post('/signout', logout);
  app.use(auth);

  app.use('/', userRouter);
  app.use('/', movieRouter);
  // eslint-disable-next-line no-unused-vars
  app.use((req, res) => {
    throw new NotFoundError('Что-то пошло не так...');
  });
};

module.exports = {
  handleRoutes,
};
