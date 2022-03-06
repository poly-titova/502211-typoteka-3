'use strict';

const express = require(`express`);
const path = require(`path`);

const articlesRoutes = require(`../express/routes/articles-routes`);
const mainRoutes = require(`../express/routes/main-routes`);
const myRoutes = require(`../express/routes/my-routes`);

const DEFAULT_PORT = 8080;

const app = express();

const PUBLIC_DIR = `public`;
app.use(express.static(path.resolve(__dirname, PUBLIC_DIR)));

app.set(`views`, path.resolve(__dirname, `templates`));
app.set(`view engine`, `pug`);

app.use(`/articles`, articlesRoutes);
app.use(`/my`, myRoutes);
app.use(`/`, mainRoutes);

app.listen(DEFAULT_PORT);
