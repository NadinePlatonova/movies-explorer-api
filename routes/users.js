const router = require('express').Router();

const {
  getUser,
  updateUser,
} = require('../controllers/users');

const { updateUserDataValidation } = require('../middlewares/validator');

router.get('/users/me', getUser);
router.patch('/users/me', updateUserDataValidation, updateUser);

module.exports = router;
