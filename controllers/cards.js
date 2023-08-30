const mongoose = require('mongoose');
const {
  HTTP_STATUS_OK,
  HTTP_STATUS_CREATED,
} = require('http2').constants;
const cardModel = require('../models/card');
const NotFoundError = require('../errors/NotFoundError');
const BadRequestError = require('../errors/BadRequestError');
const ForbiddenError = require('../errors/ForbiddenError');

// Получение всех карточек
const getAllCards = (req, res, next) => {
  cardModel.find({})
    .then((cards) => res.status(HTTP_STATUS_OK).send(cards))
    .catch(next);
};

// Создание карточки
const createCard = (req, res, next) => {
  const { name, link } = req.body;
  const owner = req.user._id;
  cardModel.create({ name, link, owner })
    .then((card) => res.status(HTTP_STATUS_CREATED).send(card))
    .catch((err) => {
      if (err instanceof mongoose.Error.ValidationError) {
        next(new BadRequestError('Переданы некорректные данные'));
      } else {
        next(err);
      }
    });
};

// Удаление карточки
const deleteCard = (req, res, next) => {
  const { cardId } = req.params;
  cardModel.findByIdAndRemove(cardId)
    .then((card) => {
      if (!card.owner.equals(req.user._id)) {
        throw new ForbiddenError('Нельзя удалить чужую карточку');
      }
      return res.status(HTTP_STATUS_OK).send({ message: 'Карточка удалена' });
    })
    .catch((err) => {
      if (err.message === 'NotFoundError') {
        next(new NotFoundError('Карточки с указанным _id не существует'));
      } else if (err instanceof mongoose.Error.CastError) {
        next(new BadRequestError('Переданы некорректные данные'));
      } else {
        next(err);
      }
    });
  // .then(() => res.status(HTTP_STATUS_OK).send({ message: 'Карточка удалена' }))
  // .catch((err) => {
  //   if (err.message === 'NotFoundError') {
  //     res.status(HTTP_STATUS_NOT_FOUND).send({
  //       message: 'Карточки с указанным _id не существует',
  //     });
  //   } else if (err instanceof mongoose.Error.CastError) {
  //     res.status(HTTP_STATUS_BAD_REQUEST).send({
  //       message: 'Переданы некорректные данные.',
  //     });
  //   } else {
  //     handleServerError(err, res);
  //   }
  // });
};

// Поставить лайк карточке
const putLikeCard = (req, res, next) => {
  cardModel.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    // .then((newCard) => res.status(HTTP_STATUS_OK).send(newCard))
    .then((newCard) => {
      if (newCard) return res.status(HTTP_STATUS_OK).send(newCard);
      throw new NotFoundError('Карточки с указанным _id не существует');
    })
    .catch((err) => {
      // if (err instanceof mongoose.Error.DocumentNotFoundError) {
      //   next(new NotFoundError('Карточки с указанным _id не существует'));
      // }
      if (err instanceof mongoose.Error.CastError) {
        next(new BadRequestError('Переданы некорректные данные'));
      } else {
        next(err);
      }
    });
};

// Удалить лайк карточки
const deleteLikeCard = (req, res, next) => {
  cardModel.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    // .then((newCard) => res.status(HTTP_STATUS_OK).send(newCard))
    .then((newCard) => {
      if (newCard) return res.status(HTTP_STATUS_OK).send(newCard);
      throw new NotFoundError('Карточки с указанным _id не существует');
    })
    .catch((err) => {
      // if (err instanceof mongoose.Error.DocumentNotFoundError) {
      //   next(new NotFoundError('Карточки с указанным _id не существует'));
      // }
      if (err instanceof mongoose.Error.CastError) {
        next(new BadRequestError('Переданы некорректные данные'));
      } else {
        next(err);
      }
    });
};

module.exports = {
  getAllCards,
  createCard,
  deleteCard,
  putLikeCard,
  deleteLikeCard,
};
