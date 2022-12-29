'use strict';

const {Router} = require(`express`);
const csrf = require(`csurf`);

const upload = require(`../middlewares/upload`);
const auth = require(`../middlewares/auth`);
const {ensureArray, prepareErrors} = require(`../../utils`);
const {HttpCode} = require(`../../constants`);

const api = require(`../api`).getAPI();
const articlesRouter = new Router();

const csrfProtection = csrf();

const ARTICLES_PER_PAGE = 8;

const getAddArticleData = () => {
  return api.getCategories({withCount: false});
};

const getEditArticleData = async ({id, userId}) => {
  const [article, categories] = await Promise.all([
    api.getArticle({id, userId, withComments: false}),
    api.getCategories({withCount: false})
  ]);
  return [article, categories];
};

const getViewArticleData = ({id}) => {
  return api.getArticle({id, withComments: true});
};

articlesRouter.get(`/categories/:categoryId`, async (req, res) => {
  const {user} = req.session;
  const {categoryId} = req.params;

  let {page = 1} = req.query;
  page = +page;

  const limit = ARTICLES_PER_PAGE;
  const offset = (page - 1) * ARTICLES_PER_PAGE;

  const [categories, {category, count, articlesByCategory}] = await Promise.all([
    api.getCategories({withCount: true}),
    api.getCategory({categoryId, limit, offset})
  ]);

  const totalPages = Math.ceil(count / ARTICLES_PER_PAGE);

  const articles = {
    category,
    current: articlesByCategory
  };

  res.render(`articles-by-category`, {
    fullView: true,
    categories,
    count,
    articles,
    page,
    totalPages,
    user
  });
});

articlesRouter.get(`/add`, auth, csrfProtection, async (req, res) => {
  const {user} = req.session;
  const categories = await getAddArticleData();
  res.render(`new-post`, {categories, user, csrfToken: req.csrfToken()});
});

articlesRouter.post(`/add`, auth, upload.single(`avatar`), csrfProtection, async (req, res) => {
  const {user} = req.session;
  const {body, file} = req;
  const articleData = {
    categories: ensureArray(body.category),
    picture: file ? file.filename : ``,
    announce: body.announcement,
    full_text: body[`full-text`],
    title: body.title,
    createdAt: body.date,
    userId: user.id
  };

  try {
    await api.createArticle({data: articleData});
    res.redirect(`/my`);
  } catch (errors) {
    const validationMessages = prepareErrors(errors);
    const categories = await getAddArticleData();
    res.render(`new-post`, {categories, user, validationMessages, csrfToken: req.csrfToken()});
  }
});

articlesRouter.get(`/edit/:id`, auth, csrfProtection, async (req, res) => {
  const {id} = req.params;
  const {user} = req.session;

  try {
    const [article, categories] = await getEditArticleData({id, userId: user.id});

    res.render(`new-post`, {id, article, categories, user, csrfToken: req.csrfToken()});
  } catch (_errors) {
    res.redirect(`/my`);
  }
});

articlesRouter.post(`/edit/:id`, auth, upload.single(`avatar`), csrfProtection, async (req, res) => {
  const {body, file} = req;
  const {id} = req.params;
  const {user} = req.session;
  const articleData = {
    categories: ensureArray(body.category),
    picture: file ? file.filename : ``,
    announce: body.announcement,
    full_text: body[`full-text`],
    title: body.title,
    createdAt: body.date,
    userId: user.id
  };

  try {
    await api.editArticle({id, data: articleData});
    res.redirect(`/my`);
  } catch (errors) {
    const validationMessages = prepareErrors(errors);
    const [article, categories] = await getEditArticleData({id});
    res.render(`new-post`, {id, article, categories, user, validationMessages, csrfToken: req.csrfToken()});
  }
});

articlesRouter.get(`/:id`, csrfProtection, async (req, res) => {
  const {user} = req.session;
  const {id} = req.params;
  const article = await getViewArticleData({id});
  res.render(`post-detail`, {article, id, user, csrfToken: req.csrfToken()});
});

articlesRouter.delete(`/:id`, auth, async (req, res) => {
  const {user} = req.session;
  const {id} = req.params;

  try {
    const article = await api.removeArticle({id, userId: user.id});

    res.status(HttpCode.OK).send(article);
  } catch (errors) {
    res.status(errors.response.status).send(errors.response.statusText);
  }
});

articlesRouter.post(`/:id/comments`, auth, csrfProtection, async (req, res) => {
  const {id} = req.params;
  const {user} = req.session;
  const {comment} = req.body;

  const commentData = {
    userId: user.id,
    text: comment
  };

  try {
    await api.createComment({id, data: commentData});
    res.redirect(`/articles/${id}`);
  } catch (errors) {
    const validationMessages = prepareErrors(errors);
    const article = await getViewArticleData({id});
    res.render(`post-detail`, {article, id, user, validationMessages, csrfToken: req.csrfToken()});
  }
});

articlesRouter.delete(`/:id/comments/:commentId`, auth, async (req, res) => {
  const {user} = req.session;
  const {id, commentId} = req.params;

  try {
    const comment = await api.removeComment({id, userId: user.id, commentId});

    res.status(HttpCode.OK).send(comment);
  } catch (errors) {
    res.status(errors.response.status).send(errors.response.statusText);
  }
});

module.exports = articlesRouter;
