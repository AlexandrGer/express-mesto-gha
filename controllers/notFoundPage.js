const { HTTP_STATUS_NOT_FOUND } = require('http2').constants;

const notFoundPage = (_req, res) => res
  .status(HTTP_STATUS_NOT_FOUND)
  .send({ message: 'Страница не найдена.' });

module.exports = { notFoundPage };
