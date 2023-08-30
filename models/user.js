const mongoose = require('mongoose');
const validator = require('validator');
const UnauthorizedError = require('../errors/UnauthorizedError');
const URL_REG = require('../utils/constants');

const userSchema = new mongoose.Schema({
	email: {
		type: String,
		required: true,
		unique: true,
		validate: {
			validator: (email) => validator.isEmail(email),
			message: 'Неверно указана почта',
		}
	},
	password: {
		type: String,
		required: true,
		select: false,
		minlength: 8
	},
	name: {
		type: String,
		default: 'Жак-Ив Кусто',
		minlength: 2,
		maxlength: 30,
	},
	about: {
		type: String,
		default: 'Исследователь',
		minlength: 2,
		maxlength: 30,
	},
	avatar: {
		type: String,
		default: 'https://pictures.s3.yandex.net/resources/jacques-cousteau_1604399756.png',
		validate: {
			validator: (url) => URL_REG.test(url),
			message: 'Неверно указан URL',
		}
	},
});

userSchema.statics.findUserByCredentials = function (email, password) {
	return this.findOne({ email }).select('+password')
		.then((user) => {
			if (!user) {
				return Promise.reject(new UnauthorizedError('Неправильные почта или пароль'));
			}
			return bcrypt.compare(password, user.password)
				.then((matched) => {
					if (!matched) {
						return Promise.reject(new UnauthorizedError('Неправильные почта или пароль'));
					}
					return user;
				});
		});
};

module.exports = mongoose.model('user', userSchema);
