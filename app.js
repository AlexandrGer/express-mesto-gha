const express = require('express');
const mongoose = require('mongoose');
const router = require('./routes/index');
const routerAuth = require('./routes/auth');
const auth = require('./middlewares/auth');
const { errors } = require('celebrate');
const handleError = require('./errors/handleError');

const {
  PORT = 3000,
  DB_URL = 'mongodb://127.0.0.1:27017/mestodb',
} = process.env;

mongoose.connect(DB_URL, {
  useNewUrlParser: true,
});

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use((req, res, next) => {
  req.user = {
    _id: '64e49fe91cdce86fcdcd6e96',
  };

  next();
});

app.use('/', routerAuth);

app.use(auth);

app.use(router);

app.use(errors());
app.use(handleError);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
