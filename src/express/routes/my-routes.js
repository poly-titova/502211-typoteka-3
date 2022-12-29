'use strict';

const {Router} = require(`express`);
const auth = require(`../middlewares/auth`);
const api = require(`../api`).getAPI();

const myRouter = new Router();

myRouter.use(auth);

myRouter.get(`/`, async (req, res) => {
  const {user} = req.session;
  const articles = await api.getArticles({userId: user.id});
  res.render(`my`, {user, articles});
});

myRouter.get(`/comments`, async (req, res) => {
  const {user} = req.session;
  const articles = await api.getArticles({userId: user.id, withComments: true});
  res.render(`comments`, {user, articles});
});

module.exports = myRouter;
