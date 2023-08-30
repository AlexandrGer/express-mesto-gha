const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const {
  HTTP_STATUS_OK,
  HTTP_STATUS_CREATED,
} = require('http2').constants;
const userModel = require('../models/user');
const NotFoundError = require('../errors/NotFoundError');
const BadRequestError = require('../errors/BadRequestError');
const ConflictError = require('../errors/ConflictError');
const { SECRET_KEY } = require('../utils/constants');

// Получение всех пользователей
const getAllUsers = (req, res, next) => {
  userModel.find({})
    .then((users) => res.status(HTTP_STATUS_OK).send(users))
    .catch(next);
};

// Получение пользователя по ID
const getUserById = (req, res, next) => {
  userModel.findById(req.params.userId)
    .then((user) => {
      if (!user) {
        throw new NotFoundError('Нет пользователя с таким id');
      }
      res.send(user);
    })
    .catch((err) => {
      if (err instanceof mongoose.Error.CastError) {
        next(new BadRequestError('Переданы некорректные данные'));
      } else {
        next(err);
      }
    });
};

// Получение информации о текущем пользователе
const getCurrentUserInfo = (req, res, next) => {
  const userId = req.user._id;
  userModel.findById(userId)
    .then((user) => {
      if (!user) {
        throw new NotFoundError('Нет пользователя с таким id');
      }
      res.send(user);
    })
    .catch((err) => {
      if (err instanceof mongoose.Error.CastError) {
        next(new BadRequestError('Переданы некорректные данные'));
      } else {
        next(err);
      }
    });
};

// Создание пользователя
const createUser = (req, res, next) => {
  const {
    email, password, name, about, avatar,
  } = req.body;
  bcrypt.hash(password, 10)
    .then((hash) => userModel.create({
      email,
      password: hash,
      name,
      about,
      avatar,
    }))
    .then((user) => {
      const { _id } = user;
      res.status(HTTP_STATUS_CREATED)
        .send({
          email,
          name,
          about,
          avatar,
          _id,
        });
    })
    .catch((err) => {
      if (err.code === 11000) {
        next(new ConflictError('Пользователь с таким электронным адресом уже зарегистрирован'));
      } else if (err instanceof mongoose.Error.ValidationError) {
        next(new BadRequestError('Переданы некорректные данные'));
      } else {
        next(err);
      }
    });
};

// Login
const loginUser = (req, res, next) => {
  const { email, password } = req.body;
  userModel.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign(
        { _id: user._id },
        SECRET_KEY,
        { expiresIn: '7d' },
      );
      res.status(HTTP_STATUS_OK).send({ token });
    })
    .catch(next);
};

// Обновление информации о пользователе
const updateUserById = (req, res, next) => {
  const { name, about } = req.body;
  userModel.findByIdAndUpdate(
    req.user._id,
    { name, about },
    { new: true, runValidators: true },
  )
    .then((user) => {
      if (!user) {
        throw new NotFoundError('Нет пользователя с таким id');
      }
      res.send(user);
    })
    .catch((err) => {
      if (err instanceof mongoose.Error.CastError
        || err instanceof mongoose.Error.ValidationError) {
        next(new BadRequestError('Переданы некорректные данные'));
      } else {
        next(err);
      }
    });
};

// Обновление аватара пользователя
const updateUserAvatar = (req, res, next) => {
  const { avatar } = req.body;
  userModel.findByIdAndUpdate(
    req.user._id,
    { avatar },
    { new: true, runValidators: true },
  )
    .then((user) => {
      if (!user) {
        throw new NotFoundError('Нет пользователя с таким id');
      }
      res.send(user);
    })
    .catch((err) => {
      if (err instanceof mongoose.Error.CastError
        || err instanceof mongoose.Error.ValidationError) {
        next(new BadRequestError('Переданы некорректные данные'));
      } else {
        next(err);
      }
    });
};

module.exports = {
  getAllUsers,
  getUserById,
  createUser,
  updateUserById,
  updateUserAvatar,
  loginUser,
  getCurrentUserInfo,
};
