'use strict';

const {Router} = require(`express`);
const {HttpCode} = require(`../../constants`);
const articleValidator = require(`../middlewares/article-validator`);
const articleExist = require(`../middlewares/article-exists`);
const commentValidator = require(`../middlewares/comment-validator`);
const routeParamsValidator = require(`../middlewares/route-params-validator`);

module.exports = (app, articleService, commentService) => {
  const route = new Router();

  app.use(`/articles`, route);

  route.get(`/`, async (req, res) => {
    const {limit, offset, userId, categoryId, withComments} = req.query;

    let articles = {};

    if (userId) {
      articles.current = await articleService.findAll({userId, withComments});
      return res.status(HttpCode.OK).json(articles);
    }

    if (categoryId) {
      articles.current = await articleService.findPage({limit, offset, categoryId});
    } else {
      articles.recent = await articleService.findLimit({limit});
      articles.commented = await articleService.findLimit({limit, withComments: true});
    }

    return res.status(HttpCode.OK).json(articles);
  });

  route.get(`/:articleId`, routeParamsValidator, async (req, res) => {
    const {articleId} = req.params;
    const {userId, withComments} = req.query;

    const article = await articleService.findOne({articleId, userId, withComments});

    if (!article) {
      return res.status(HttpCode.NOT_FOUND)
        .send(`Not found with ${articleId}`);
    }

    return res.status(HttpCode.OK)
      .json(article);
  });

  route.post(`/`, articleValidator, async (req, res) => {
    const data = await articleService.create(req.body);

    return res.status(HttpCode.CREATED)
      .json(data);
  });

  route.put(`/:articleId`, [routeParamsValidator, articleValidator], async (req, res) => {
    const {articleId} = req.params;
    const updated = await articleService.update({id: articleId, article: req.body});

    if (!updated) {
      return res.status(HttpCode.NOT_FOUND)
        .send(`Not found with ${articleId}`);
    }

    return res.status(HttpCode.OK)
      .send(`Updated`);
  });

  route.delete(`/:articleId`, routeParamsValidator, async (req, res) => {
    const {articleId} = req.params;
    const {userId} = req.body;

    const article = await articleService.findOne({articleId});

    if (!article) {
      return res.status(HttpCode.NOT_FOUND)
        .send(`Not found`);
    }

    const deletedArticle = await articleService.drop({userId, articleId});

    if (!deletedArticle) {
      return res.status(HttpCode.FORBIDDEN)
        .send(`Forbidden`);
    }

    return res.status(HttpCode.OK)
      .json(deletedArticle);
  });

  route.get(`/:articleId/comments`, [routeParamsValidator, articleExist(articleService)], async (req, res) => {
    const {articleId} = req.params;
    const comments = await commentService.findAll(articleId);

    res.status(HttpCode.OK)
      .json(comments);
  });

  route.post(`/:articleId/comments`, [routeParamsValidator, articleExist(articleService), commentValidator], async (req, res) => {
    const {articleId} = req.params;

    const comment = await commentService.create(articleId, req.body);

    return res.status(HttpCode.CREATED)
      .json(comment);
  });

  route.delete(`/:articleId/comments/:commentId`, [routeParamsValidator, articleExist(articleService)], async (req, res) => {
    const {articleId, commentId} = req.params;
    const {userId} = req.body;

    const comment = await commentService.findOne(commentId, articleId);

    if (!comment) {
      return res.status(HttpCode.NOT_FOUND)
        .send(`Not found`);
    }

    const deletedComment = await commentService.drop(userId, articleId, commentId);

    if (!deletedComment) {
      return res.status(HttpCode.FORBIDDEN)
        .send(`Forbidden`);
    }

    return res.status(HttpCode.OK)
      .json(deletedComment);
  });
};
