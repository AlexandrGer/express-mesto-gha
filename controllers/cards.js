const mongoose = require('mongoose');
const cardModel = require('../models/card');
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

//Получение всех карточек
const getAllCards = (req, res) => {
  cardModel.find({})
    .then((cards) => res.status(HTTP_STATUS_OK).send(cards))
    .catch((err) => handleServerError(err, res));
}

//Создание карточки
const createCard = (req, res) => {
  const { name, link } = req.body;
  const owner = req.user._id;
  cardModel.create({ name, link, owner })
    .then((card) => res.status(HTTP_STATUS_CREATED).send(card))
    .catch((err) => {
      if (err instanceof mongoose.Error.ValidationError /*err.name === 'ValidationError'*/) {
        return res.status(HTTP_STATUS_BAD_REQUEST).send({
          message: 'Переданы некорректные данные.',
        });
      }
      handleServerError(err, res);
    });
}

//Удаление карточки
const deleteCard = (req, res) => {
  cardModel.findByIdAndRemove(req.params.cardId)
    .then(() => res.status(HTTP_STATUS_OK).send({ message: 'Карточка удалена' }))
    .catch((err) => {
      if (err instanceof mongoose.Error.DocumentNotFoundError /*err.message === 'NotFoundError'*/) {
        return res.status(HTTP_STATUS_NOT_FOUND).send({
          message: 'Карточки с указанным _id не существует',
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

//Поставить лайк карточке
const putLikeCard = (req, res) => {
  cardModel.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .then((newCard) => res.status(HTTP_STATUS_OK).send(newCard))
    .catch((err) => {
      if (err instanceof mongoose.Error.DocumentNotFoundError /*err.message === 'NotFoundError'*/) {
        return res.status(HTTP_STATUS_NOT_FOUND).send({
          message: 'Карточки с указанным _id не существует',
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

//Удалить лайк карточки
const deleteLikeCard = (req, res) => {
  cardModel.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .then((newCard) => res.status(HTTP_STATUS_OK).send(newCard))
    .catch((err) => {
      if (err instanceof mongoose.Error.DocumentNotFoundError /*err.message === 'NotFoundError'*/) {
        return res.status(HTTP_STATUS_NOT_FOUND).send({
          message: 'Карточки с указанным _id не существует',
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

module.exports = {
  getAllCards,
  createCard,
  deleteCard,
  putLikeCard,
  deleteLikeCard
}