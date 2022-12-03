'use strict';

const express = require(`express`);
const session = require(`express-session`);
const path = require(`path`);

const articlesRoutes = require(`./routes/articles-routes`);
const mainRoutes = require(`./routes/main-routes`);
const myRoutes = require(`./routes/my-routes`);
const sequelize = require(`../service/lib/sequelize`);
const SequelizeStore = require(`connect-session-sequelize`)(session.Store);

const {getLogger} = require(`../service/lib/logger`);
const logger = getLogger({name: `api`});

const DEFAULT_PORT = 8080;
const PUBLIC_DIR = `public`;

const {SESSION_SECRET} = process.env;
if(!SESSION_SECRET){
  throw new Error(`SESSION_SECRET environment variable is not defined`);
}

const app = express();

const mySessionStore = new SequelizeStore({
  db: sequelize,
  expiration: 180000,
  checkExpirationInterval: 60000
});

sequelize.sync({force: false});

app.use(express.urlencoded({extended: false}));

app.use(session({
  secret: SESSION_SECRET,
  store: mySessionStore,
  resave: false,
  proxy: true,
  saveUninitialized: false,
}));

app.use(express.static(path.resolve(__dirname, PUBLIC_DIR)));

app.set(`views`, path.resolve(__dirname, `templates`));
app.set(`view engine`, `pug`);

app.use(`/articles`, articlesRoutes);
app.use(`/my`, myRoutes);
app.use(`/`, mainRoutes);

app.listen(DEFAULT_PORT)
  .on("error", (err) => {
    logger.error(`An error occurred: ${err.message}`);
    process.exit(1);
  })
  .on("listening", () => {
    return logger.info(`Waiting for connections on a port ${DEFAULT_PORT}`);
  });
