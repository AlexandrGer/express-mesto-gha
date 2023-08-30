const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const URL_REG = require('../utils/constants');

const {
  getAllUsers,
  getUserById,
  getCurrentUserInfo,
  updateUserById,
  updateUserAvatar,
} = require('../controllers/users');

router.get('/', getAllUsers);
router.get('/me', getCurrentUserInfo);

router.get(
  '/:userId',
  celebrate({
    params: Joi.object().keys({
      userId: Joi.string().length(24).hex().required(),
    }),
  }),
  getUserById,
);

router.patch(
  '/me',
  celebrate({
    body: Joi.object().keys({
      name: Joi.string().min(2).max(30),
      about: Joi.string().min(2).max(30),
    }),
  }),
  updateUserById,
);

router.patch(
  '/me/avatar',
  celebrate({
    body: Joi.object().keys({
      avatar: Joi.string().pattern(URL_REG),
    }),
  }),
  updateUserAvatar,
);

module.exports = router;
