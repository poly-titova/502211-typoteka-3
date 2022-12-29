'use strict';

const {
  getRandomInt,
  shuffle,
} = require(`../../utils`);
const fs = require(`fs`).promises;
const chalk = require(`chalk`);

const {ExitCode} = require(`../../constants`);
const DEFAULT_COUNT = 1;
const MAX_COMMENTS = 4;
const FILE_NAME = `fill-db.sql`;

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

const PictureRestrict = {
  MIN: 1,
  MAX: 16,
};

const generateComments = (count, articleId, userCount, comments) => (
  Array(count).fill({}).map(() => ({
    userId: getRandomInt(1, userCount),
    articleId,
    text: shuffle(comments)
      .slice(0, getRandomInt(1, 3))
      .join(` `),
  }))
);

const generateCategories = (count, articleId, categoryCount) => (
  Array(count).fill({}).map(() => ({
    categoryId: getRandomInt(1, categoryCount),
    articleId,
  }))
);

const getPictureFileName = (number) => `item${number.toString().padStart(2, 0)}.jpg`;

const generateArticles = (count, titles, categoryCount, userCount, sentences, comments) => (
  Array(count).fill({}).map((_, index) => ({
    categories: generateCategories(getRandomInt(1, MAX_COMMENTS), index + 1, categoryCount),
    announce: shuffle(sentences).slice(1, 5).join(` `),
    full_text: shuffle(sentences).slice(1, getRandomInt(1, sentences.length - 1)).join(` `),
    picture: getPictureFileName(getRandomInt(PictureRestrict.MIN, PictureRestrict.MAX)),
    title: titles[getRandomInt(0, titles.length - 1)],
    created_at: randomDate(),
    comments: generateComments(getRandomInt(1, MAX_COMMENTS), index + 1, userCount, comments),
    userId: getRandomInt(1, userCount)
  }))
);

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
  name: `--fill`,
  async run(args) {
    const sentences = await readContent(FILE_SENTENCES_PATH);
    const titles = await readContent(FILE_TITLES_PATH);
    const categories = await readContent(FILE_CATEGORIES_PATH);
    const commentSentences = await readContent(FILE_COMMENTS_PATH);

    const [count] = args;
    const countArticle = Number.parseInt(count, 10) || DEFAULT_COUNT;

    const users = [
      {
        email: `ivanov@example.com`,
        passwordHash: `5f4dcc3b5aa765d61d8327deb882cf99`,
        firstName: `Иван`,
        lastName: `Иванов`,
        avatar: `avatar1.jpg`
      },
      {
        email: `petrov@example.com`,
        passwordHash: `5f4dcc3b5aa765d61d8327deb882cf99`,
        firstName: `Пётр`,
        lastName: `Петров`,
        avatar: `avatar2.jpg`
      }
    ];


    const articles = generateArticles(countArticle, titles, categories.length, users.length, sentences, commentSentences);

    const comments = articles.flatMap((article) => article.comments);

    const articleCategories = articles.map((article, index) => ({articleId: index + 1, categoryId: article.category[0]}));

    const userValues = users.map(
      ({ email, passwordHash, firstName, lastName, avatar }) =>
        `('${email}', '${passwordHash}', '${firstName}', '${lastName}', '${avatar}')`
    ).join(`,\n`);

    const categoryValues = categories.map((name) => `('${name}')`).join(`,\n`);

    const articleValues = articles.map(
      ({ title, announce, full_text, picture, userId, created_at }) =>
        `('${title}', '${announce}', '${full_text}', '${picture}', ${userId}, '${created_at}')`
    ).join(`,\n`);

    const articleCategoryValues = articleCategories.map(
      ({ articleId, categoryId }) =>
        `(${articleId}, ${categoryId})`
    ).join(`,\n`);

    const commentValues = comments.map(
      ({ text, userId, articleId }) =>
        `('${text}', ${userId}, ${articleId})`
    ).join(`,\n`);

    const content = `
-- добавили пользователей
INSERT INTO users(email, password_hash, first_name, last_name, avatar) VALUES
${userValues};

-- добавили категории
INSERT INTO categories(name) VALUES
${categoryValues};

-- временно отключим проверку всех ограничений в таблице
ALTER TABLE articles DISABLE TRIGGER ALL;
-- добавили публикации
INSERT INTO articles(title, announce, full_text, picture, user_id, created_at) VALUES
${articleValues};
-- после завершения операции вставки, включим обратно
ALTER TABLE articles ENABLE TRIGGER ALL;

-- присвоения категорий публикациям
ALTER TABLE articles_categories DISABLE TRIGGER ALL;
INSERT INTO articles_categories(article_id, category_id) VALUES
${articleCategoryValues};
ALTER TABLE articles_categories ENABLE TRIGGER ALL;

-- добавили комментарии
ALTER TABLE comments DISABLE TRIGGER ALL;
INSERT INTO COMMENTS(text, user_id, article_id) VALUES
${commentValues};
ALTER TABLE comments ENABLE TRIGGER ALL;
`;

    try {
      await fs.writeFile(FILE_NAME, content);
      console.log(chalk.green(`Operation success. File created.`));
    } catch (err) {
      console.error(chalk.red(`Can't write data to file...`));
      process.exit(ExitCode.fail);
    }
  }
};
