'use strict';

const express = require(`express`);
const request = require(`supertest`);
const Sequelize = require(`sequelize`);

const initDB = require(`../lib/init-db`);
const passwordUtils = require(`../lib/password`);
const article = require(`./article`);
const DataService = require(`../data-service/article`);
const CommentService = require(`../data-service/comment`);

const { HttpCode } = require(`../../constants`);

const mockCategories = [
  `Разное`,
  `Кино`,
  `IT`,
  `Без рамки`,
  `Железо`,
  `Деревья`,
  `Музыка`,
  `Программирование`
];

const mockUsers = [
  {
    name: `Иван Иванов`,
    email: `ivanov@example.com`,
    passwordHash: passwordUtils.hashSync(`ivanov`),
    avatar: `avatar01.jpg`
  },
  {
    name: `Пётр Петров`,
    email: `petrov@example.com`,
    passwordHash: passwordUtils.hashSync(`petrov`),
    avatar: `avatar02.jpg`
  }
];

const mockArticles = [
  {
    "user": `ivanov@example.com`,
    "categories": [
      `Разное`,
      `Кино`,
      `IT`,
      `Без рамки`,
      `Программирование`
    ],
    "announce": `Из под его пера вышло 8 платиновых альбомов. Он написал больше 30 хитов. Достичь успеха помогут ежедневные повторения. Первая большая ёлка была установлена только в 1938 году.`,
    "full_text": `Вы можете достичь всего. Стоит только немного постараться и запастись книгами. Программировать не настолько сложно, как об этом говорят. Процессор заслуживает особого внимания. Он обязательно понравится геймерам со стажем. Из под его пера вышло 8 платиновых альбомов. Золотое сечение — соотношение двух величин, гармоническая пропорция. Игры и программирование разные вещи. Не стоит идти в программисты, если вам нравятся только игры. Это один из лучших рок-музыкантов. Как начать действовать? Для начала просто соберитесь. Достичь успеха помогут ежедневные повторения. Простые ежедневные упражнения помогут достичь успеха. Этот смартфон — настоящая находка. Большой и яркий экран, мощнейший процессор — всё это в небольшом гаджете. Освоить вёрстку несложно. Возьмите книгу новую книгу и закрепите все упражнения на практике. Ёлки — это не просто красивое дерево. Это прочная древесина. Он написал больше 30 хитов. Рок-музыка всегда ассоциировалась с протестами. Так ли это на самом деле?`,
    "title": `Ёлки. История деревьев`,
    "createdAt": `2021-11-30T06:01:00.888Z`,
    "comments": [
      {
        "user": `petrov@example.com`,
        "text": `Плюсую, но слишком много буквы! Мне кажется или я уже читал это где-то? Мне не нравится ваш стиль. Ощущение, что вы меня поучаете.`
      },
      {
        "user": `ivanov@example.com`,
        "text": `Мне не нравится ваш стиль. Ощущение, что вы меня поучаете. Давно не пользуюсь стационарными компьютерами. Ноутбуки победили.`
      }
    ]
  },
  {
    "user": `petrov@example.com`,
    "categories": [
      `Кино`,
      `Программирование`
    ],
    "announce": `Альбом стал настоящим открытием года. Мощные гитарные рифы и скоростные соло-партии не дадут заскучать. Рок-музыка всегда ассоциировалась с протестами. Так ли это на самом деле? Игры и программирование разные вещи.`,
    "full_text": `Ёлки — это не просто красивое дерево. Это прочная древесина. Бороться с прокрастинацией несложно. Просто действуйте. Маленькими шагами. Альбом стал настоящим открытием года. Мощные гитарные рифы и скоростные соло-партии не дадут заскучать.`,
    "title": `Ёлки. История деревьев`,
    "createdAt": `2020-10-22T09:39:29.445Z`,
    "comments": [
      {
        "user": `ivanov@example.com`,
        "text": `Совсем немного... Плюсую, но слишком много буквы! Мне не нравится ваш стиль. Ощущение, что вы меня поучаете.`
      },
      {
        "user": `petrov@example.com`,
        "text": `Хочу такую же футболку :-) Мне не нравится ваш стиль. Ощущение, что вы меня поучаете. Это где ж такие красоты?`
      },
      {
        "user": `ivanov@example.com`,
        "text": `Это где ж такие красоты? Согласен с автором! Планируете записать видосик на эту тему?`
      },
      {
        "user": `petrov@example.com`,
        "text": `Хочу такую же футболку :-) Плюсую, но слишком много буквы! Мне кажется или я уже читал это где-то?`
      }
    ]
  },
  {
    "user": `ivanov@example.com`,
    "categories": [
      `IT`,
      `Железо`,
      `Программирование`,
      `Кино`
    ],
    "announce": `Альбом стал настоящим открытием года. Мощные гитарные рифы и скоростные соло-партии не дадут заскучать. Этот смартфон — настоящая находка. Большой и яркий экран, мощнейший процессор — всё это в небольшом гаджете. Собрать камни бесконечности легко, если вы прирожденный герой. Достичь успеха помогут ежедневные повторения.`,
    "full_text": `Собрать камни бесконечности легко, если вы прирожденный герой. Первая большая ёлка была установлена только в 1938 году. Бороться с прокрастинацией несложно. Просто действуйте. Маленькими шагами. Освоить вёрстку несложно. Возьмите книгу новую книгу и закрепите все упражнения на практике. Это один из лучших рок-музыкантов. Этот смартфон — настоящая находка. Большой и яркий экран, мощнейший процессор — всё это в небольшом гаджете. Рок-музыка всегда ассоциировалась с протестами. Так ли это на самом деле? Игры и программирование разные вещи. Не стоит идти в программисты, если вам нравятся только игры. Он написал больше 30 хитов. Как начать действовать? Для начала просто соберитесь. Золотое сечение — соотношение двух величин, гармоническая пропорция. Альбом стал настоящим открытием года. Мощные гитарные рифы и скоростные соло-партии не дадут заскучать.`,
    "title": `Самый лучший музыкальный альбом этого года`,
    "createdAt": `2020-03-08T23:25:05.792Z`,
    "comments": [
      {
        "user": `petrov@example.com`,
        "text": `Согласен с автором! Давно не пользуюсь стационарными компьютерами. Ноутбуки победили. Хочу такую же футболку :-)`
      },
      {
        "user": `ivanov@example.com`,
        "text": `Плюсую, но слишком много буквы!`
      },
      {
        "user": `petrov@example.com`,
        "text": `Согласен с автором! Совсем немного... Хочу такую же футболку :-)`
      },
      {
        "user": `ivanov@example.com`,
        "text": `Плюсую, но слишком много буквы! Это где ж такие красоты? Давно не пользуюсь стационарными компьютерами. Ноутбуки победили.`
      }
    ]
  },
  {
    "user": `petrov@example.com`,
    "categories": [
      `Кино`,
      `Без рамки`,
      `Деревья`,
      `Железо`,
      `Разное`,
      `Музыка`
    ],
    "announce": `Освоить вёрстку несложно. Возьмите книгу новую книгу и закрепите все упражнения на практике. Это один из лучших рок-музыкантов. Этот смартфон — настоящая находка. Большой и яркий экран, мощнейший процессор — всё это в небольшом гаджете. Простые ежедневные упражнения помогут достичь успеха.`,
    "full_text": `Этот смартфон — настоящая находка. Большой и яркий экран, мощнейший процессор — всё это в небольшом гаджете. Альбом стал настоящим открытием года. Мощные гитарные рифы и скоростные соло-партии не дадут заскучать. Бороться с прокрастинацией несложно. Просто действуйте. Маленькими шагами. Программировать не настолько сложно, как об этом говорят. Как начать действовать? Для начала просто соберитесь. Ёлки — это не просто красивое дерево. Это прочная древесина. Первая большая ёлка была установлена только в 1938 году. Рок-музыка всегда ассоциировалась с протестами. Так ли это на самом деле? Собрать камни бесконечности легко, если вы прирожденный герой. Вы можете достичь всего. Стоит только немного постараться и запастись книгами. Золотое сечение — соотношение двух величин, гармоническая пропорция. Помните, небольшое количество ежедневных упражнений лучше, чем один раз, но много. Простые ежедневные упражнения помогут достичь успеха.`,
    "title": `Самый лучший музыкальный альбом этого года`,
    "createdAt": `2020-10-09T13:01:54.925Z`,
    "comments": [
      {
        "user": `ivanov@example.com`,
        "text": `Давно не пользуюсь стационарными компьютерами. Ноутбуки победили. Хочу такую же футболку :-) Совсем немного...`
      },
      {
        "user": `petrov@example.com`,
        "text": `Мне не нравится ваш стиль. Ощущение, что вы меня поучаете. Это где ж такие красоты?`
      },
      {
        "user": `ivanov@example.com`,
        "text": `Давно не пользуюсь стационарными компьютерами. Ноутбуки победили. Совсем немного... Согласен с автором!`
      },
      {
        "user": `petrov@example.com`,
        "text": `Планируете записать видосик на эту тему? Это где ж такие красоты? Давно не пользуюсь стационарными компьютерами. Ноутбуки победили.`
      }
    ]
  },
  {
    "user": `ivanov@example.com`,
    "categories": [
      `Деревья`,
      `Разное`,
      `Без рамки`,
      `Кино`,
      `Программирование`
    ],
    "announce": `Процессор заслуживает особого внимания. Он обязательно понравится геймерам со стажем. Простые ежедневные упражнения помогут достичь успеха. Ёлки — это не просто красивое дерево. Это прочная древесина. Первая большая ёлка была установлена только в 1938 году.`,
    "full_text": `Программировать не настолько сложно, как об этом говорят. Первая большая ёлка была установлена только в 1938 году. Игры и программирование разные вещи. Не стоит идти в программисты, если вам нравятся только игры. Альбом стал настоящим открытием года. Мощные гитарные рифы и скоростные соло-партии не дадут заскучать. Достичь успеха помогут ежедневные повторения. Простые ежедневные упражнения помогут достичь успеха. Вы можете достичь всего. Стоит только немного постараться и запастись книгами. Золотое сечение — соотношение двух величин, гармоническая пропорция. Он написал больше 30 хитов. Собрать камни бесконечности легко, если вы прирожденный герой. Помните, небольшое количество ежедневных упражнений лучше, чем один раз, но много. Этот смартфон — настоящая находка. Большой и яркий экран, мощнейший процессор — всё это в небольшом гаджете. Процессор заслуживает особого внимания. Он обязательно понравится геймерам со стажем. Рок-музыка всегда ассоциировалась с протестами. Так ли это на самом деле? Из под его пера вышло 8 платиновых альбомов. Как начать действовать? Для начала просто соберитесь.`,
    "title": `Ёлки. История деревьев`,
    "createdAt": `2021-07-10T11:38:17.785Z`,
    "comments": [
      {
        "user": `petrov@example.com`,
        "text": `Давно не пользуюсь стационарными компьютерами. Ноутбуки победили. Совсем немного...`
      },
      {
        "user": `ivanov@example.com`,
        "text": `Согласен с автором!`
      },
      {
        "user": `petrov@example.com`,
        "text": `Это где ж такие красоты? Мне кажется или я уже читал это где-то?`
      }
    ]
  }
];

const createAPI = async () => {
  const mockDB = new Sequelize(`sqlite::memory:`, { logging: false });
  await initDB(mockDB, { categories: mockCategories, articles: mockArticles, users: mockUsers });
  const app = express();
  app.use(express.json());
  article(app, new DataService(mockDB), new CommentService(mockDB));
  return app;
};

describe(`API returns a list of all articles`, () => {
  let response;

  beforeAll(async () => {
    const app = await createAPI();
    response = await request(app)
      .get(`/articles`);
  });

  test(`Status code 200`, () => expect(response.statusCode).toBe(HttpCode.OK));

  test(`Returns a list of 5 articles`, () => expect(response.body.length).toBe(5));

  test(`First article's title equals "Ёлки. История деревьев"`, () => expect(response.body[0].title).toBe(`Ёлки. История деревьев`));
});

describe(`API returns an article with given id`, () => {
  let response;

  beforeAll(async () => {
    const app = await createAPI();
    response = await request(app)
      .get(`/articles/1`);
  });

  test(`Status code 200`, () => expect(response.statusCode).toBe(HttpCode.OK));

  test(`Article's title is "Ёлки. История деревьев"`, () => expect(response.body.title).toBe(`Ёлки. История деревьев`));
});

describe(`API creates an article if data is valid`, () => {
  const newArticle = {
    categories: [1, 2],
    announce: `Красивые котики`,
    full_text: `Очень красивые котики`,
    title: `Котики`,
    createdAt: `2021-07-20T03:56:00.879Z`,
    picture: `cat.jpg`,
    userId: 1
  };

  let app;
  let response;

  beforeAll(async () => {
    app = await createAPI();
    response = await request(app)
      .post(`/articles`)
      .send(newArticle);
  });

  test(`Status code 201`, () => expect(response.statusCode).toBe(HttpCode.CREATED));

  test(`Articles count is changed`, () => request(app)
    .get(`/articles`)
    .expect((res) => expect(res.body.length).toBe(6))
  );
});

describe(`API refuses to create an article if data is invalid`, () => {
  const newArticle = {
    categories: [1, 2],
    announce: `Красивые котики`,
    full_text: `Очень красивые котики`,
    title: `Котики`,
    createdAt: `2021-07-20T03:56:00.879Z`,
    picture: `cat.jpg`,
    userId: 1
  };

  let app;

  beforeAll(async () => {
    app = await createAPI();
  });

  test(`Without any required property response code is 400`, async () => {
    for (const key of Object.keys(newArticle)) {
      const badArticle = { ...newArticle };
      delete badArticle[key];
      await request(app)
        .post(`/articles`)
        .send(badArticle)
        .expect(HttpCode.BAD_REQUEST);
    }
  });

  test(`When field type is wrong response code is 400`, async () => {
    const badArticles = [
      {...newArticle, sum: true},
      {...newArticle, picture: 12345},
      {...newArticle, categories: `Котики`}
    ];
    for (const badArticle of badArticles) {
      await request(app)
        .post(`/articles`)
        .send(badArticle)
        .expect(HttpCode.BAD_REQUEST);
    }
  });

  test(`When field value is wrong response code is 400`, async () => {
    const badArticles = [
      { ...newArticle, title: `too short` },
      { ...newArticle, categories: [] }
    ];
    for (const badArticle of badArticles) {
      await request(app)
        .post(`/articles`)
        .send(badArticle)
        .expect(HttpCode.BAD_REQUEST);
    }
  });
});

describe(`API changes existent article`, () => {
  const newArticle = {
    categories: [1, 2],
    announce: `Красивые котики`,
    full_text: `Очень красивые котики`,
    title: `Котики`,
    createdAt: `2021-07-20T03:56:00.879Z`,
    picture: `cat.jpg`,
    userId: 1
  };

  let app;
  let response;

  beforeAll(async () => {
    app = await createAPI();
    response = await request(app)
      .put(`/articles/2`)
      .send(newArticle);
  });

  test(`Status code 200`, () => expect(response.statusCode).toBe(HttpCode.OK));

  test(`Article is really changed`, () => request(app)
    .get(`/articles/2`)
    .expect((res) => expect(res.body.title).toBe(`Котики`))
  );
});

test(`API returns status code 404 when trying to change non-existent article`, async () => {
  const app = await createAPI();

  const validArticle = {
    categories: [3],
    announce: `Это вполне валидный`,
    full_text: `объект публикации, однако поскольку такой публикации в базе нет`,
    title: `мы получим 404`,
    createdAt: `2020-02-20T20:20:00.200Z`,
    picture: `404.jpg`,
    userId: 1
  };

  return request(app)
    .put(`/articles/20`)
    .send(validArticle)
    .expect(HttpCode.NOT_FOUND);
});

test(`API returns status code 400 when trying to change an article with invalid data`, async () => {
  const app = await createAPI();

  const invalidArticle = {
    categories: [1, 2],
    announce: `Это невалидный`,
    full_text: `объект`,
    title: `объявления`,
    picture: `нет поля createdAt`,
    userId: 1
  };

  return request(app)
    .put(`/articles/20`)
    .send(invalidArticle)
    .expect(HttpCode.BAD_REQUEST);
});

describe(`API correctly deletes an article`, () => {
  let app;
  let response;

  beforeAll(async () => {
    app = await createAPI();
    response = await request(app)
      .delete(`/articles/3`);
  });

  test(`Status code 200`, () => expect(response.statusCode).toBe(HttpCode.OK));

  test(`Article count is 4 now`, () => request(app)
    .get(`/articles`)
    .expect((res) => expect(res.body.length).toBe(4))
  );
});

test(`API refuses to delete non-existent article`, async () => {
  const app = await createAPI();

  return request(app)
    .delete(`/articles/20`)
    .expect(HttpCode.NOT_FOUND);
});

describe(`API returns a list of comments to given article`, () => {
  let response;

  beforeAll(async () => {
    const app = await createAPI();
    response = await request(app)
      .get(`/articles/2/comments`);
  });

  test(`Status code 200`, () => expect(response.statusCode).toBe(HttpCode.OK));

  test(`Returns list of 4 comments`, () => expect(response.body.length).toBe(4));

  test(`First comment's text is "Совсем немного... Плюсую, но слишком много буквы! Мне не нравится ваш стиль. Ощущение, что вы меня поучаете."`,
    () => expect(response.body[0].text).toBe(`Совсем немного... Плюсую, но слишком много буквы! Мне не нравится ваш стиль. Ощущение, что вы меня поучаете.`));

});

describe(`API creates a comment if data is valid`, () => {
  const newComment = {
    text: `Валидному комментарию достаточно этих полей`,
    userId: 1
  };

  let app;
  let response;

  beforeAll(async () => {
    app = await createAPI();
    response = await request(app)
      .post(`/articles/3/comments`)
      .send(newComment);
  });

  test(`Status code 201`, () => expect(response.statusCode).toBe(HttpCode.CREATED));

  test(`Comments count is changed`, () => request(app)
    .get(`/articles/3/comments`)
    .expect((res) => expect(res.body.length).toBe(4))
  );
});

test(`API refuses to create a comment to non-existent article and returns status code 404`, async () => {
  const app = await createAPI();

  return request(app)
    .post(`/articles/20/comments`)
    .send({
      text: `Неважно`
    })
    .expect(HttpCode.NOT_FOUND);
});

test(`API refuses to create a comment when data is invalid, and returns status code 400`, async () => {
  const invalidComment = {
    text: `Не указан userId`
  };

  const app = await createAPI();

  return request(app)
    .post(`/articles/2/comments`)
    .send(invalidComment)
    .expect(HttpCode.BAD_REQUEST);
});

describe(`API correctly deletes a comment`, () => {
  let app;
  let response;

  beforeAll(async () => {
    app = await createAPI();
    response = await request(app)
      .delete(`/articles/1/comments/1`);
  });

  test(`Status code 200`, () => expect(response.statusCode).toBe(HttpCode.OK));

  test(`Comments count is 1 now`, () => request(app)
    .get(`/articles/1/comments`)
    .expect((res) => expect(res.body.length).toBe(2))
  );
});

test(`API refuses to delete non-existent comment`, async () => {
  const app = await createAPI();

  return request(app)
    .delete(`/articles/4/comments/100`)
    .expect(HttpCode.NOT_FOUND);
});

test(`API refuses to delete a comment to non-existent article`, async () => {
  const app = await createAPI();

  return request(app)
    .delete(`/articles/20/comments/1`)
    .expect(HttpCode.NOT_FOUND);
});
