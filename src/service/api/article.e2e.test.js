'use strict';

const express = require(`express`);
const request = require(`supertest`);

const article = require(`./article`);
const DataService = require(`../data-service/article`);
const CommentService = require(`../data-service/comment`);

const {HttpCode} = require(`../../constants`);

const mockData = [
  {
    "id": `avHMSN`,
    "category": [
      `Разное`,
      `Кино`,
      `IT`,
      `Без рамки`,
      `Программирование`
    ],
    "announce": `Из под его пера вышло 8 платиновых альбомов. Он написал больше 30 хитов. Достичь успеха помогут ежедневные повторения. Первая большая ёлка была установлена только в 1938 году.`,
    "fullText": `Вы можете достичь всего. Стоит только немного постараться и запастись книгами. Программировать не настолько сложно, как об этом говорят. Процессор заслуживает особого внимания. Он обязательно понравится геймерам со стажем. Из под его пера вышло 8 платиновых альбомов. Золотое сечение — соотношение двух величин, гармоническая пропорция. Игры и программирование разные вещи. Не стоит идти в программисты, если вам нравятся только игры. Это один из лучших рок-музыкантов. Как начать действовать? Для начала просто соберитесь. Достичь успеха помогут ежедневные повторения. Простые ежедневные упражнения помогут достичь успеха. Этот смартфон — настоящая находка. Большой и яркий экран, мощнейший процессор — всё это в небольшом гаджете. Освоить вёрстку несложно. Возьмите книгу новую книгу и закрепите все упражнения на практике. Ёлки — это не просто красивое дерево. Это прочная древесина. Он написал больше 30 хитов. Рок-музыка всегда ассоциировалась с протестами. Так ли это на самом деле?`,
    "title": `Ёлки. История деревьев`,
    "createdDate": `2021-11-30T06:01:00.888Z`,
    "comments": [
      {
        "id": `v0CYov`,
        "text": `Плюсую, но слишком много буквы! Мне кажется или я уже читал это где-то? Мне не нравится ваш стиль. Ощущение, что вы меня поучаете.`
      },
      {
        "id": `ycOIRc`,
        "text": `Мне не нравится ваш стиль. Ощущение, что вы меня поучаете. Давно не пользуюсь стационарными компьютерами. Ноутбуки победили.`
      }
    ]
  },
  {
    "id": `0fpXjC`,
    "category": [
      `Кино`,
      `Программирование`
    ],
    "announce": `Альбом стал настоящим открытием года. Мощные гитарные рифы и скоростные соло-партии не дадут заскучать. Рок-музыка всегда ассоциировалась с протестами. Так ли это на самом деле? Игры и программирование разные вещи. Не стоит идти в программисты, если вам нравятся только игры. Вы можете достичь всего. Стоит только немного постараться и запастись книгами.`,
    "fullText": `Ёлки — это не просто красивое дерево. Это прочная древесина. Бороться с прокрастинацией несложно. Просто действуйте. Маленькими шагами. Альбом стал настоящим открытием года. Мощные гитарные рифы и скоростные соло-партии не дадут заскучать. Как начать действовать? Для начала просто соберитесь. Этот смартфон — настоящая находка. Большой и яркий экран, мощнейший процессор — всё это в небольшом гаджете. Процессор заслуживает особого внимания. Он обязательно понравится геймерам со стажем. Рок-музыка всегда ассоциировалась с протестами. Так ли это на самом деле? Это один из лучших рок-музыкантов. Игры и программирование разные вещи. Не стоит идти в программисты, если вам нравятся только игры. Золотое сечение — соотношение двух величин, гармоническая пропорция. Вы можете достичь всего. Стоит только немного постараться и запастись книгами. Помните, небольшое количество ежедневных упражнений лучше, чем один раз, но много. Программировать не настолько сложно, как об этом говорят. Первая большая ёлка была установлена только в 1938 году. Освоить вёрстку несложно. Возьмите книгу новую книгу и закрепите все упражнения на практике. Собрать камни бесконечности легко, если вы прирожденный герой.`,
    "title": `Ёлки. История деревьев`,
    "createdDate": `2020-10-22T09:39:29.445Z`,
    "comments": [
      {
        "id": `fWfUrD`,
        "text": `Совсем немного... Плюсую, но слишком много буквы! Мне не нравится ваш стиль. Ощущение, что вы меня поучаете.`
      },
      {
        "id": `grZ88I`,
        "text": `Хочу такую же футболку :-) Мне не нравится ваш стиль. Ощущение, что вы меня поучаете. Это где ж такие красоты?`
      },
      {
        "id": `MyANNP`,
        "text": `Это где ж такие красоты? Согласен с автором! Планируете записать видосик на эту тему?`
      },
      {
        "id": `6zY9IL`,
        "text": `Хочу такую же футболку :-) Плюсую, но слишком много буквы! Мне кажется или я уже читал это где-то?`
      }
    ]
  },
  {
    "id": `wBQO4w`,
    "category": [
      `IT`,
      `Железо`,
      `Программирование`,
      `Кино`
    ],
    "announce": `Альбом стал настоящим открытием года. Мощные гитарные рифы и скоростные соло-партии не дадут заскучать. Этот смартфон — настоящая находка. Большой и яркий экран, мощнейший процессор — всё это в небольшом гаджете. Собрать камни бесконечности легко, если вы прирожденный герой. Достичь успеха помогут ежедневные повторения.`,
    "fullText": `Собрать камни бесконечности легко, если вы прирожденный герой. Первая большая ёлка была установлена только в 1938 году. Бороться с прокрастинацией несложно. Просто действуйте. Маленькими шагами. Освоить вёрстку несложно. Возьмите книгу новую книгу и закрепите все упражнения на практике. Это один из лучших рок-музыкантов. Этот смартфон — настоящая находка. Большой и яркий экран, мощнейший процессор — всё это в небольшом гаджете. Рок-музыка всегда ассоциировалась с протестами. Так ли это на самом деле? Игры и программирование разные вещи. Не стоит идти в программисты, если вам нравятся только игры. Он написал больше 30 хитов. Как начать действовать? Для начала просто соберитесь. Золотое сечение — соотношение двух величин, гармоническая пропорция. Альбом стал настоящим открытием года. Мощные гитарные рифы и скоростные соло-партии не дадут заскучать.`,
    "title": `Самый лучший музыкальный альбом этого года`,
    "createdDate": `2020-03-08T23:25:05.792Z`,
    "comments": [
      {
        "id": `thJA25`,
        "text": `Согласен с автором! Давно не пользуюсь стационарными компьютерами. Ноутбуки победили. Хочу такую же футболку :-)`
      },
      {
        "id": `scD8-0`,
        "text": `Плюсую, но слишком много буквы!`
      },
      {
        "id": `1oGVCh`,
        "text": `Согласен с автором! Совсем немного... Хочу такую же футболку :-)`
      },
      {
        "id": `pYatrV`,
        "text": `Плюсую, но слишком много буквы! Это где ж такие красоты? Давно не пользуюсь стационарными компьютерами. Ноутбуки победили.`
      }
    ]
  },
  {
    "id": `Gyrd5g`,
    "category": [
      `Кино`,
      `Без рамки`,
      `Деревья`,
      `Железо`,
      `Разное`,
      `Музыка`
    ],
    "announce": `Освоить вёрстку несложно. Возьмите книгу новую книгу и закрепите все упражнения на практике. Это один из лучших рок-музыкантов. Этот смартфон — настоящая находка. Большой и яркий экран, мощнейший процессор — всё это в небольшом гаджете. Простые ежедневные упражнения помогут достичь успеха.`,
    "fullText": `Этот смартфон — настоящая находка. Большой и яркий экран, мощнейший процессор — всё это в небольшом гаджете. Альбом стал настоящим открытием года. Мощные гитарные рифы и скоростные соло-партии не дадут заскучать. Бороться с прокрастинацией несложно. Просто действуйте. Маленькими шагами. Программировать не настолько сложно, как об этом говорят. Как начать действовать? Для начала просто соберитесь. Ёлки — это не просто красивое дерево. Это прочная древесина. Первая большая ёлка была установлена только в 1938 году. Рок-музыка всегда ассоциировалась с протестами. Так ли это на самом деле? Собрать камни бесконечности легко, если вы прирожденный герой. Вы можете достичь всего. Стоит только немного постараться и запастись книгами. Золотое сечение — соотношение двух величин, гармоническая пропорция. Помните, небольшое количество ежедневных упражнений лучше, чем один раз, но много. Простые ежедневные упражнения помогут достичь успеха.`,
    "title": `Самый лучший музыкальный альбом этого года`,
    "createdDate": `2020-10-09T13:01:54.925Z`,
    "comments": [
      {
        "id": `8dJdo7`,
        "text": `Давно не пользуюсь стационарными компьютерами. Ноутбуки победили. Хочу такую же футболку :-) Совсем немного...`
      },
      {
        "id": `9ZgOaK`,
        "text": `Мне не нравится ваш стиль. Ощущение, что вы меня поучаете. Это где ж такие красоты?`
      },
      {
        "id": `YZAIFK`,
        "text": `Давно не пользуюсь стационарными компьютерами. Ноутбуки победили. Совсем немного... Согласен с автором!`
      },
      {
        "id": `W05iu2`,
        "text": `Планируете записать видосик на эту тему? Это где ж такие красоты? Давно не пользуюсь стационарными компьютерами. Ноутбуки победили.`
      }
    ]
  },
  {
    "id": `K0R_ns`,
    "category": [
      `Деревья`,
      `Разное`,
      `Без рамки`,
      `Кино`,
      `Программирование`
    ],
    "announce": `Процессор заслуживает особого внимания. Он обязательно понравится геймерам со стажем. Простые ежедневные упражнения помогут достичь успеха. Ёлки — это не просто красивое дерево. Это прочная древесина. Первая большая ёлка была установлена только в 1938 году.`,
    "fullText": `Программировать не настолько сложно, как об этом говорят. Первая большая ёлка была установлена только в 1938 году. Игры и программирование разные вещи. Не стоит идти в программисты, если вам нравятся только игры. Альбом стал настоящим открытием года. Мощные гитарные рифы и скоростные соло-партии не дадут заскучать. Достичь успеха помогут ежедневные повторения. Простые ежедневные упражнения помогут достичь успеха. Вы можете достичь всего. Стоит только немного постараться и запастись книгами. Золотое сечение — соотношение двух величин, гармоническая пропорция. Он написал больше 30 хитов. Собрать камни бесконечности легко, если вы прирожденный герой. Помните, небольшое количество ежедневных упражнений лучше, чем один раз, но много. Этот смартфон — настоящая находка. Большой и яркий экран, мощнейший процессор — всё это в небольшом гаджете. Процессор заслуживает особого внимания. Он обязательно понравится геймерам со стажем. Рок-музыка всегда ассоциировалась с протестами. Так ли это на самом деле? Из под его пера вышло 8 платиновых альбомов. Как начать действовать? Для начала просто соберитесь.`,
    "title": `Ёлки. История деревьев`,
    "createdDate": `2021-07-10T11:38:17.785Z`,
    "comments": [
      {
        "id": `4Dh9pB`,
        "text": `Давно не пользуюсь стационарными компьютерами. Ноутбуки победили. Совсем немного...`
      },
      {
        "id": `71jhHw`,
        "text": `Согласен с автором!`
      },
      {
        "id": `KnaoFL`,
        "text": `Это где ж такие красоты? Мне кажется или я уже читал это где-то?`
      }
    ]
  }
];

const app = express();
app.use(express.json());
article(app, new DataService(mockData));

const createAPI = () => {
  const app = express();
  const cloneData = JSON.parse(JSON.stringify(mockData));
  app.use(express.json());
  article(app, new DataService(cloneData), new CommentService());
  return app;
};

describe(`API returns a list of all articles`, () => {
  const app = createAPI();

  let response;

  beforeAll(async () => {
    response = await request(app)
      .get(`/articles`);
  });

  test(`Status code 200`, () => expect(response.statusCode).toBe(HttpCode.OK));

  test(`Returns a list of 5 articles`, () => expect(response.body.length).toBe(5));

  test(`First article's id equals "avHMSN"`, () => expect(response.body[0].id).toBe(`avHMSN`));
});

describe(`API returns an article with given id`, () => {
  const app = createAPI();

  let response;

  beforeAll(async () => {
    response = await request(app)
      .get(`/articles/avHMSN`);
  });

  test(`Status code 200`, () => expect(response.statusCode).toBe(HttpCode.OK));

  test(`Article's title is "Ёлки. История деревьев"`, () => expect(response.body.title).toBe(`Ёлки. История деревьев`));
});

describe(`API creates an article if data is valid`, () => {
  const newArticle = {
    "category": `Котики`,
    "announce": `Красивые котики`,
    "fullText": `Очень красивые котики`,
    "title": `Котики`,
    "createdDate": `2021-07-20T03:56:00.879Z`
  };

  const app = createAPI();

  let response;

  beforeAll(async () => {
    response = await request(app)
      .post(`/articles`)
      .send(newArticle);
  });

  test(`Status code 201`, () => expect(response.statusCode).toBe(HttpCode.CREATED));

  test(`Returns article created`, () => expect(response.body).toEqual(expect.objectContaining(newArticle)));

  test(`Articles count is changed`, () => request(app)
    .get(`/articles`)
    .expect((res) => expect(res.body.length).toBe(6))
  );
});

describe(`API refuses to create an article if data is invalid`, () => {
  const newArticle = {
    "category": `Котики`,
    "announce": `Красивые котики`,
    "fullText": `Очень красивые котики`,
    "title": `Котики`,
    "createdDate": `2021-07-20T03:56:00.879Z`
  };

  const app = createAPI();

  test(`Without any required property response code is 400`, async () => {
    for (const key of Object.keys(newArticle)) {
      const badArticle = {...newArticle};
      delete badArticle[key];
      await request(app)
        .post(`/articles`)
        .send(badArticle)
        .expect(HttpCode.BAD_REQUEST);
    }
  });
});

describe(`API changes existent article`, () => {
  const newArticle = {
    "category": `Котики`,
    "announce": `Красивые котики`,
    "fullText": `Очень красивые котики`,
    "title": `Котики`,
    "createdDate": `2021-07-20T03:56:00.879Z`
  };

  const app = createAPI();

  let response;

  beforeAll(async () => {
    response = await request(app)
      .put(`/articles/avHMSN`)
      .send(newArticle);
  });

  test(`Status code 200`, () => expect(response.statusCode).toBe(HttpCode.OK));

  test(`Returns changed article`, () => expect(response.body).toEqual(expect.objectContaining(newArticle)));

  test(`Article is really changed`, () => request(app)
    .get(`/articles/avHMSN`)
    .expect((res) => expect(res.body.title).toBe(`Котики`))
  );
});

test(`API returns status code 404 when trying to change non-existent article`, () => {
  const app = createAPI();

  const validArticle = {
    "category": `Это`,
    "announce": `валидный`,
    "fullText": `объект`,
    "title": `объявления`,
    "createdDate": `2020-02-20T20:20:00.200Z`
  };

  return request(app)
    .put(`/articles/NOEXST`)
    .send(validArticle)
    .expect(HttpCode.NOT_FOUND);
});

test(`API returns status code 400 when trying to change an article with invalid data`, () => {
  const app = createAPI();

  const invalidArticle = {
    "category": `Это`,
    "announce": `невалидный`,
    "fullText": `объект`,
    "title": `объявления`
  };

  return request(app)
    .put(`/articles/NOEXST`)
    .send(invalidArticle)
    .expect(HttpCode.BAD_REQUEST);
});

describe(`API correctly deletes an article`, () => {
  const app = createAPI();

  let response;

  beforeAll(async () => {
    response = await request(app)
      .delete(`/articles/wBQO4w`);
  });

  test(`Status code 200`, () => expect(response.statusCode).toBe(HttpCode.OK));

  test(`Returns deleted article`, () => expect(response.body.id).toBe(`wBQO4w`));

  test(`Article count is 4 now`, () => request(app)
    .get(`/articles`)
    .expect((res) => expect(res.body.length).toBe(4))
  );
});

test(`API refuses to delete non-existent article`, () => {
  const app = createAPI();

  return request(app)
    .delete(`/articles/NOEXST`)
    .expect(HttpCode.NOT_FOUND);
});

test(`API refuses to create a comment to non-existent article and returns status code 404`, () => {
  const app = createAPI();

  return request(app)
    .post(`/articles/NOEXST/comments`)
    .send({
      text: `Неважно`
    })
    .expect(HttpCode.NOT_FOUND);
});

test(`API refuses to delete non-existent comment`, () => {
  const app = createAPI();

  return request(app)
    .delete(`/articles/Gyrd5g/comments/NOEXST`)
    .expect(HttpCode.NOT_FOUND);
});
