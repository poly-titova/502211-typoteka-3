-- добавили пользователей
INSERT INTO users(email, password_hash, first_name, last_name, avatar) VALUES
('ivanov@example.com', '5f4dcc3b5aa765d61d8327deb882cf99', 'Иван', 'Иванов', 'avatar1.jpg'),
('petrov@example.com', '5f4dcc3b5aa765d61d8327deb882cf99', 'Пётр', 'Петров', 'avatar2.jpg');

-- добавили категории
INSERT INTO categories(name) VALUES
('Кино'),
('Музыка'),
('Разное');

-- временно отключим проверку всех ограничений в таблице
ALTER TABLE articles DISABLE TRIGGER ALL;
-- добавили публикации
INSERT INTO articles(title, announce, full_text, picture, user_id, created_at) VALUES
('Как перестать беспокоиться и начать жить', 'Как начать действовать? Для начала просто соберитесь.', 'Помните, небольшое количество ежедневных упражнений лучше, чем один раз, но много.', 'image1.jpg', 1, 2019-08-15),
('Как достигнуть успеха не вставая с кресла', 'Вы можете достичь всего. Стоит только немного постараться и запастись книгами.', 'Возьмите книгу новую книгу и закрепите все упражнения на практике', 'image2.jpg', 2, 2020-12-05),
('Обзор новейшего смартфона', 'Этот смартфон — настоящая находка. Большой и яркий экран, мощнейший процессор — всё это в небольшом гаджете.', 'Процессор заслуживает особого внимания.', 'image3.jpg', 2, 2021-09-26),
-- после завершения операции вставки, включим обратно
ALTER TABLE articles ENABLE TRIGGER ALL;

-- присвоения категорий публикациям
ALTER TABLE article_categories DISABLE TRIGGER ALL;
INSERT INTO article_categories(article_id, category_id) VALUES
(1, 1),
(1, 2),
(2, 1),
(2, 2),
(3, 1),
(3, 3),
ALTER TABLE article_categories ENABLE TRIGGER ALL;

-- добавили комментарии
ALTER TABLE comments DISABLE TRIGGER ALL;
INSERT INTO COMMENTS(text, user_id, article_id) VALUES
('Как начать действовать?', 1, 1),
('Для начала просто соберитесь', 2, 1),
('Вы можете достичь всего', 1, 2),
('Стоит только немного постараться и запастись книгами', 2, 2),
('Хорошая находка', 1, 3),
('Большой и яркий экран', 2, 3),
ALTER TABLE comments ENABLE TRIGGER ALL;
