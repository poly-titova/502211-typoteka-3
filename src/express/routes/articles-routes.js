'use strict';

const {Router} = require(`express`);
const multer = require(`multer`);
const path = require(`path`);
const {ensureArray, prepareErrors} = require(`../../utils`);
const {getRandomInt, shuffle} = require(`../../utils`);

const UPLOAD_DIR = `../upload/img/`;

const uploadDirAbsolute = path.resolve(__dirname, UPLOAD_DIR);

const storage = multer.diskStorage({
  destination: uploadDirAbsolute,
  filename: (req, file, cb) => {
    const uniqueName = nanoid(10);
    const extension = file.originalname.split(`.`).pop();
    cb(null, `${uniqueName}.${extension}`);
  }
});

const upload = multer({storage});
const articlesRouter = new Router();
const api = require(`../api`).getAPI();

const getAddArticleData = () => {
  return api.getCategories();
};

articlesRouter.get(`/category/:id`, async (req, res) => {
  const categories = await api.getCategories();
  res.render(`articles-by-category`, {categories})
});

articlesRouter.get(`/add`, async (req, res) => {
  const categories = await getAddArticleData();
  res.render(`new-post`, {categories});
});

articlesRouter.post(`/add`,
  upload.single(`avatar`),
  async (req, res) => {
    const {body, file} = req;
    const categories = await api.getCategories();
    const articleData = {
      category: shuffle(categories).slice(0, getRandomInt(1, categories.length - 1)),
      announce: body.announcement,
      full_text: body[`full-text`],
      title: body.title,
      createdAt: body.date,
    };

    try {
      await api.createArticle(articleData);
      res.redirect(`/my`);
    } catch (errors) {
      const validationMessages = prepareErrors(errors);
      const categories = await getAddArticleData();
      res.render(`new-post`, {categories, user, validationMessages, csrfToken: req.csrfToken()});
    }
  }
);

articlesRouter.get(`/edit/:id`, async (req, res) => {
  const {id} = req.params;
  const [article, categories] = await Promise.all([
    api.getArticle(id),
    api.getCategories()
  ]);
  res.render(`new-post`, {article, categories});
});

articlesRouter.get(`/:id`, async (req, res) => {
  const {id} = req.params;
  const article = await api.getArticle(id, true);
  res.render(`post-detail`, {article});
});

module.exports = articlesRouter;
