'use strict';

const {Router} = require(`express`);
const mainRouter = new Router();
const api = require(`../api`).getAPI();
const upload = require(`../middlewares/upload`);
const {prepareErrors} = require(`../../utils`);

const ARTICLES_PER_PAGE = 8;

mainRouter.get(`/`, async (req, res) => {
  const {user} = req.session;

  const limit = ARTICLES_PER_PAGE;

  const [articles, categories] = await Promise.all([
    api.getArticles({limit}),
    api.getCategories({withCount: true})
  ]);

  res.render(`main`, {articles, categories, user});
});

mainRouter.get(`/categories`, async (req, res) => {
  const {user} = req.session;

  const [categories] = await Promise.all([
    api.getCategories({withCount: true})
  ]);

  res.render(`all-categories`, {categories, user});
});

mainRouter.get(`/register`, (req, res) => {
  const {user} = req.session;
  res.render(`sign-up`, {user});
});

mainRouter.post(`/register`, upload.single(`avatar`), async (req, res) => {
  const {body, file} = req;
  const userData = {
    avatar: file ? file.filename : ``,
    name: body[`user-name`],
    email: body[`user-email`],
    password: body[`user-password`],
    passwordRepeated: body[`user-password-again`]
  };

  try {
    await api.createUser({data: userData});
    res.redirect(`/login`);
  } catch (errors) {
    const validationMessages = prepareErrors(errors);
    const {user} = req.session;
    res.render(`sign-up`, {validationMessages, user});
  }
});

mainRouter.get(`/login`, (req, res) => {
  const {user} = req.session;
  res.render(`login`, {user});
});

mainRouter.post(`/login`, async (req, res) => {
  const email = req.body[`user-email`];
  const password = req.body[`user-password`];

  try {
    const user = await api.auth({email, password});
    req.session.user = user;
    req.session.save(() => {
      res.redirect(`/`);
    });
  } catch (errors) {
    const validationMessages = prepareErrors(errors);
    const {user} = req.session;
    res.render(`login`, {user, validationMessages});
  }
});

mainRouter.get(`/logout`, (req, res) => {
  delete req.session.user;
  req.session.save(() => {
    res.redirect(`/`);
  });
});

mainRouter.get(`/search`, async (req, res) => {
  const {user} = req.session;
  const {query} = req.query;

  const limit = ARTICLES_PER_PAGE;

  try {
    const [result, articles] = await Promise.all([
      api.search({query}),
      api.getArticles({limit})
    ]);

    res.render(`search`, {
      query,
      result,
      articles,
      user
    });
  } catch (error) {
    const articles = await api.getArticles({limit});

    res.render(`search`, {
      query,
      result: [],
      articles,
      user
    });
  }
});

module.exports = mainRouter;
