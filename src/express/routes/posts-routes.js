'use strict';

const {Router} = require(`express`);
const postsRouter = new Router();
const api = require(`../api`).getAPI();

postsRouter.get(`/category/:id`, (req, res) => res.render(`articles-by-category`));
postsRouter.get(`/add`, (req, res) => res.render(`post`));

postsRouter.get(`/edit/:id`, async (req, res) => {
  const {id} = req.params;
  const [article, categories] = await Promise.all([
    api.getArticle(id),
    api.getCategories()
  ]);
  res.render(`post-detail`, {article, categories});
});

postsRouter.get(`/:id`, (req, res) => res.render(`post-detail`));

module.exports = postsRouter;
