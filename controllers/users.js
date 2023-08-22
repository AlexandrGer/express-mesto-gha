const mongoose = require('mongoose');
const userModel = require('../models/user');
const { HTTP_STATUS_OK,
  HTTP_STATUS_CREATED,
  HTTP_STATUS_BAD_REQUEST,
  HTTP_STATUS_NOT_FOUND,
  HTTP_STATUS_INTERNAL_SERVER_ERROR
} = require('http2').constants

const handleServerError = (err, res) => {
  res.status(HTTP_STATUS_INTERNAL_SERVER_ERROR).send({
    message: 'На сервере произошла ошибка',
  });
};

//Получение всех пользователей
const getAllUsers = (req, res) => {
  userModel.find({})
    .then((users) => res.status(HTTP_STATUS_OK).send(users))
    .catch((err) => handleServerError(err, res));
}

//Получение пользователя по ID
const getUserById = (req, res) => {
  userModel.findById(req.params.userId)
    .orFail(() => {
      throw new Error('NotFoundError');
    })
    .then((user) => res.status(HTTP_STATUS_OK).send(user))
    .catch((err) => {
      if (err.message === 'NotFoundError') {
        return res.status(HTTP_STATUS_NOT_FOUND).send({
          message: 'Пользователя с указанным _id не существует',
        });
      } else if (err instanceof mongoose.Error.CastError /*err.name === 'CastError'*/) {
        return res.status(HTTP_STATUS_BAD_REQUEST).send({
          message: 'Переданы некорректные данные.',
        });
      } else {
        handleServerError(err, res);
      }
    });
}

//Создание пользователя
const createUser = (req, res) => {
  const { name, about, avatar } = req.body;
  userModel.create({ name, about, avatar })
    .then((user) => res.status(HTTP_STATUS_CREATED).send(user))
    .catch((err) => {
      if (err instanceof mongoose.Error.ValidationError /*err.name === 'ValidationError'*/) {
        return res.status(HTTP_STATUS_BAD_REQUEST).send({
          message: 'Переданы некорректные данные.',
        });
      }
      handleServerError(err, res);
    });
}

//Обновление информации о пользователе
const updateUserById = (req, res) => {
  const { name, about } = req.body;
  userModel.findByIdAndUpdate(
    req.user._id,
    { name, about },
    { new: true, runValidators: true }
  )
    .orFail(() => {
      throw new Error('NotFoundError');
    })
    .then((user) => res.status(HTTP_STATUS_OK).send(user))
    .catch((err) => {
      if (err.message === 'NotFoundError') {
        return res.status(HTTP_STATUS_NOT_FOUND).send({
          message: 'Пользователя с указанным _id не существует',
        });
      } else if (err instanceof mongoose.Error.ValidationError /*err.name === 'ValidationError'*/) {
        return res.status(HTTP_STATUS_BAD_REQUEST).send({
          message: 'Переданы некорректные данные.',
        });
      } else {
        handleServerError(err, res);
      }
    });
}

//Обновление аватара пользователя
const updateUserAvatar = (req, res) => {
  const { avatar } = req.body;
  userModel.findByIdAndUpdate(
    req.user._id,
    { avatar },
    { new: true, runValidators: true }
  )
    .orFail(() => {
      throw new Error('NotFoundError');
    })
    .then((user) => res.status(HTTP_STATUS_OK).send(user))
    .catch((err) => {
      if (err.message === 'NotFoundError') {
        return res.status(HTTP_STATUS_NOT_FOUND).send({
          message: 'Пользователя с указанным _id не существует',
        });
      } else if (err instanceof mongoose.Error.ValidationError /*err.name === 'ValidationError'*/) {
        return res.status(HTTP_STATUS_BAD_REQUEST).send({
          message: 'Переданы некорректные данные.',
        });
      } else {
        handleServerError(err, res);
      }
    });
}

module.exports = {
  getAllUsers,
  getUserById,
  createUser,
  updateUserById,
  updateUserAvatar
}