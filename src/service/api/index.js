'use strict';

const {Router} = require(`express`);
const category = require(`../api/category`);
const article = require(`../api/article`);
const search = require(`../api/search`);

const {
  CategoryService,
  SearchService,
  ArticleService,
  CommentService,
} = require(`../data-service`);

const sequelize = require(`../lib/sequelize`);
const defineModels = require(`../models`);

const appApi = new Router();

defineModels(sequelize);

const readMockData = () => {
  category(appApi, new CategoryService(sequelize));
  search(appApi, new SearchService(sequelize));
  article(appApi, new ArticleService(sequelize), new CommentService(sequelize));
};

module.exports = {
  appApi,
  readMockData,
};
