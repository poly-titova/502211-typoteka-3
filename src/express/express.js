'use strict';

const express = require(`express`);

const articlesRoutes = require(`./routes/articles-routes`);
const mainRoutes = require(`./routes/main-routes`);
const myRoutes = require(`./routes/my-routes`);

const DEFAULT_PORT = 8080;

const app = express();

app.use(`/articles`, articlesRoutes);
app.use(`/`, mainRoutes);
app.use(`/my`, myRoutes);

app.listen(DEFAULT_PORT);
