'use strict';

const {
  getRandomInt,
  shuffle,
} = require(`../../utils`);
const fs = require(`fs`).promises;
const chalk = require(`chalk`);

const {ExitCode} = require(`../../constants`);
const DEFAULT_COUNT = 1;
const MAX_COUNT = 1000;
const FILE_NAME = `mocks.json`;

const FILE_SENTENCES_PATH = `./data/sentences.txt`;
const FILE_TITLES_PATH = `./data/titles.txt`;
const FILE_CATEGORIES_PATH = `./data/categories.txt`;

const randomDate = () => {
  let date = new Date(+new Date(2019, 0, 1) + Math.random() * (new Date() - new Date(2019, 0, 1)));
  let hour = 0 + Math.random() * (23 - 0) | 0;
  date.setHours(hour);
  return date;
};

const generateArticles = (count, titles, categories, sentences) => (
  Array.from({length: count}, () => ({
    title: titles[getRandomInt(0, titles.length - 1)],
    announce: shuffle(sentences).slice(1, 5).join(` `),
    fullText: shuffle(sentences).slice(1, getRandomInt(1, sentences.length - 1)).join(` `),
    createdDate: randomDate(),
    category: shuffle(categories).slice(0, getRandomInt(1, categories.length - 1)),
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
  name: `--generate`,
  async run(args) {
    const sentences = await readContent(FILE_SENTENCES_PATH);
    const titles = await readContent(FILE_TITLES_PATH);
    const categories = await readContent(FILE_CATEGORIES_PATH);

    const [count] = args;
    const countArticle = Number.parseInt(count, 10) || DEFAULT_COUNT;
    const content = JSON.stringify(generateArticles(countArticle, titles, categories, sentences));

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
  }
};
