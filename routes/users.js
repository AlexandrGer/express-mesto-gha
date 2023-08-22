const router = require('express').Router();

const {
  getAllUsers,
  getUserById,
  createUser,
  updateUserById,
  updateUserAvatar,
} = require('../controllers/users');

router.get('/', getAllUsers);
router.patch('/me', updateUserById);
router.patch('/me/avatar', updateUserAvatar);
router.get('/:userId', getUserById);
router.post('/', createUser);


module.exports = router;