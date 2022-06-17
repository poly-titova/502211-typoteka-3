'use strict';

const {Router} = require(`express`);
const category = require(`../api/category`);
const article = require(`../api/article`);
const search = require(`../api/search`);

const getMockData = require(`../lib/get-mock-data`);

const {
  CategoryService,
  SearchService,
  ArticleService,
  CommentService,
} = require(`../data-service`);

const appApi = new Router();

const readMockData = async () => {
  const mockData = await getMockData();

  category(appApi, new CategoryService(mockData));
  search(appApi, new SearchService(mockData));
  article(appApi, new ArticleService(mockData), new CommentService());
};

module.exports = {
  appApi,
  readMockData,
};
