const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

const { JWT_SECRET_DEV } = require('../config');

const UnauthorisedUserError = require('../errors/unauthorised-user-error');
const ConflictError = require('../errors/conflict-error');
const NotFoundError = require('../errors/not-found-error');

const createUser = (req, res, next) => {
  const { name, email, password } = req.body;
  bcrypt.hash(password, 10)
    .then((hash) => User.create({
      name, email, password: hash,
    }))
    .then((user) => res.send({
      name: user.name, email: user.email,
    }))
    .catch((err) => {
      if (err.name === 'MongoError' && err.code === 11000) {
        next(new ConflictError('Пользователь с таким email уже существует'));
      } else {
        next(err);
      }
    });
};

const login = (req, res, next) => {
  const { email, password } = req.body;

  return User.findOne({ email }).select('+password')
    .then((user) => {
      if (!user) throw new UnauthorisedUserError('Пользователь не существует');

      bcrypt.compare(password, user.password)
        .then((isValid) => {
          if (!isValid) throw new UnauthorisedUserError('Неправльный пароль или логин');

          if (isValid) {
            const token = jwt.sign(
              { _id: user._id },
              JWT_SECRET_DEV,
              { expiresIn: '7d' },
            );
            res
              .cookie('jwt', token, {
                maxAge: 3600000 * 24 * 7,
                httpOnly: true,
                sameSite: true,
              })
              .send({
                name: user.name, email: user.email,
              });
          }
        })
        .catch(next);
    })
    .catch(next);
};

const getUser = (req, res, next) => {
  const id = req.user._id;
  User.findById(id)
    .orFail(() => new NotFoundError('Пользователь с указанным id не существует'))
    .then((user) => res.send(user))
    .catch(next);
};

const updateUser = (req, res, next) => {
  const { name, email } = req.body;

  return User.findByIdAndUpdate(
    req.user._id,
    { name, email },
    { new: true, runValidators: true },
  )
    .orFail(() => new NotFoundError('Пользователь с указанным id не существует'))
    .then((user) => res.send(user))
    .catch(next);
};

const logout = (req, res) => {
  res
    .clearCookie('jwt', {
      httpOnly: true,
      sameSite: true,
    })
    .send({ message: 'Выход выполнен' });
};

module.exports = {
  createUser,
  login,
  getUser,
  updateUser,
  logout,
};
