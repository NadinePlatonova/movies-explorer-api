const router = require('express').Router();
const validator = require('validator');
const { celebrate, Joi } = require('celebrate');

const urlValidation = (value) => {
  const result = validator.isURL(value);
  if (result) {
    return value;
  }
  throw new Error('Url не валидный');
};

const {
  getUser,
  updateUser,
} = require('../controllers/users');

router.get('/users/me', getUser);
router.patch('/users/me', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30).required(),
    email: Joi.string().required().custom(urlValidation),
  }),
}), updateUser);

module.exports = router;
