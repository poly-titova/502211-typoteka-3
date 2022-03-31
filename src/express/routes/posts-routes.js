'use strict';

const {Router} = require(`express`);
const postsRouter = new Router();

postsRouter.get(`/category/:id`, (req, res) => res.render(`articles-by-category`));
postsRouter.get(`/add`, (req, res) => res.render(`post`));
postsRouter.get(`/edit/:id`, (req, res) => res.render(`post`));
postsRouter.get(`/:id`, (req, res) => res.render(`post-detail`));

module.exports = postsRouter;
