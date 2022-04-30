'use strict';

const {Router} = require(`express`);
const category = require(`../api/category`);
const search = require(`../api/search`);

const getMockData = require(`../lib/get-mock-data`);

const {
  CategoryService,
  SearchService,
} = require(`../data-service`);

const app = new Router();

(async () => {
  const mockData = await getMockData();

  category(app, new CategoryService(mockData));
  search(app, new SearchService(mockData));
})();

module.exports = app;
