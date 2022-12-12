'use strict';

const Joi = require(`joi`);
const {HttpCode} = require(`../../constants`);

const ErrorArticleMessage = {
  CATEGORIES: `Не выбрана ни одна категория объявления`,
  ANNOUNCE_MIN: `Анонс содержит меньше 50 символов`,
  ANNOUNCE_MAX: `Анонс не может содержать более 1000 символов`,
  FULL_TEXT_MIN: `Текст содержит меньше 50 символов`,
  FULL_TEXT_MAX: `Текст не может содержать более 1000 символов`,
  TITLE_MIN: `Заголовок содержит меньше 10 символов`,
  TITLE_MAX: `Заголовок не может содержать более 100 символов`,
  PICTURE: `Изображение не выбрано или тип изображения не поддерживается`,
  USER_ID: `Некорректный идентификатор пользователя`
};

const schema = Joi.object({
  categories: Joi.array().items(
    Joi.number().integer().positive().messages({
      'number.base': ErrorArticleMessage.CATEGORIES
    })
  ).min(1).required(),
  announce: Joi.string().min(50).max(1000).required().messages({
    'string.min': ErrorArticleMessage.ANNOUNCE_MIN,
    'string.max': ErrorArticleMessage.ANNOUNCE_MAX
  }),
  full_text: Joi.string().min(50).max(1000).required().messages({
    'string.min': ErrorArticleMessage.FULL_TEXT_MIN,
    'string.max': ErrorArticleMessage.FULL_TEXT_MAX
  }),
  title: Joi.string().min(10).max(100).required().messages({
    'string.min': ErrorArticleMessage.TITLE_MIN,
    'string.max': ErrorArticleMessage.TITLE_MAX
  }),
  picture: Joi.string().required().messages({
    'string.empty': ErrorArticleMessage.PICTURE
  }),
  userId: Joi.number().integer().positive().required().messages({
    'number.base': ErrorArticleMessage.USER_ID
  })
});

module.exports = (req, res, next) => {
  const newArticle = req.body;
  const {error} = schema.validate(newArticle, {abortEarly: false});

  if (error) {
    return res.status(HttpCode.BAD_REQUEST)
      .send(error.details.map((err) => err.message).join(`\n`));
  }

  return next();
};
