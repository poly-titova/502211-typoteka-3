'use strict';

const {
  getRandomInt,
  shuffle,
} = require(`../../utils`);
const {getLogger} = require(`../lib/logger`);
const fs = require(`fs`).promises;
const sequelize = require(`../lib/sequelize`);
const initDatabase = require(`../lib/init-db`);

const DEFAULT_COUNT = 1;
const MAX_COMMENTS = 4;

const FILE_SENTENCES_PATH = `./data/sentences.txt`;
const FILE_TITLES_PATH = `./data/titles.txt`;
const FILE_CATEGORIES_PATH = `./data/categories.txt`;
const FILE_COMMENTS_PATH = `./data/comments.txt`;

const randomDate = () => {
  let date = new Date(+new Date(2019, 0, 1) + Math.random() * (new Date() - new Date(2019, 0, 1)));
  let hour = 0 + Math.random() * (23 - 0) | 0;
  date.setHours(hour);
  return [
    date.getDate().toString().padStart(2, '0'),
    date.getMonth().toString().padStart(2, '0'),
    date.getFullYear(),
  ].join('.') + ' ' +
  [date.getHours().toString().padStart(2, '0'),
   date.getMinutes().toString().padStart(2, '0'),
   date.getSeconds().toString().padStart(2, '0'),].join(':');
};

const getRandomSubarray = (items) => {
  items = items.slice();
  let count = getRandomInt(1, items.length - 1);
  const result = [];
  while (count--) {
    result.push(
      ...items.splice(
        getRandomInt(0, items.length - 1), 1
      )
    );
  }
  return result;
};

const generateComments = (count, comments) => (
  Array(count).fill({}).map(() => ({
    user: users[getRandomInt(0, users.length - 1)].email,
    text: shuffle(comments)
      .slice(0, getRandomInt(1, 3))
      .join(` `),
  }))
);

const generateArticles = (count, titles, categories, sentences, comments) => (
  Array.from({length: count}, () => ({
    user: users[getRandomInt(0, users.length - 1)].email,
    categories: getRandomSubarray(categories),
    announce: shuffle(sentences).slice(1, 5).join(` `),
    full_text: shuffle(sentences).slice(1, getRandomInt(1, sentences.length - 1)).join(` `),
    title: titles[getRandomInt(0, titles.length - 1)],
    createdAt: randomDate(),
    comments: generateComments(getRandomInt(1, MAX_COMMENTS), comments),
  }))
);

const logger = getLogger({});

const readContent = async (filePath) => {
  try {
    const content = await fs.readFile(filePath, `utf8`);
    return content.trim().split(`\n`);
  } catch (err) {
    console.error(chalk.red(err));
    return [];
  }
};

module.exports = {
  name: `--filldb`,
  async run(args) {
    try {
      logger.info(`Trying to connect to database...`);
      await sequelize.authenticate();
      logger.info(`Connection to database established`);
    } catch (err) {
      logger.error(`An error occurred: ${err.message}`);
      process.exit(1);
    }

    const sentences = await readContent(FILE_SENTENCES_PATH);
    const titles = await readContent(FILE_TITLES_PATH);
    const categories = await readContent(FILE_CATEGORIES_PATH);
    const comments = await readContent(FILE_COMMENTS_PATH);
    const users = [
      {
        name: `Иван Иванов`,
        email: `ivanov@example.com`,
        passwordHash: await passwordUtils.hash(`ivanov`),
        avatar: `avatar01.jpg`
      },
      {
        name: `Пётр Петров`,
        email: `petrov@example.com`,
        passwordHash: await passwordUtils.hash(`petrov`),
        avatar: `avatar02.jpg`
      }
    ];

    const [count] = args;
    const countArticle = Number.parseInt(count, 10) || DEFAULT_COUNT;
    const articles = generateArticles(countArticle, titles, categories, sentences, comments, users);

    if (countArticle > MAX_COUNT) {
      console.error(chalk.red(`Не больше 1000 публикаций`));
      process.exit(ExitCode.FAIL);
    }

    try {
      await fs.writeFile(FILE_NAME, content);
      console.log(chalk.green(`Operation success. File created.`));
    } catch (err) {
      console.error(chalk.red(`Can't write data to file...`));
      process.exit(ExitCode.FAIL);
    }

    return initDatabase(sequelize, {articles, categories});
  }
};
