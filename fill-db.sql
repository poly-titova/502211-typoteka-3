
-- добавили пользователей
INSERT INTO users(email, password_hash, first_name, last_name, avatar) VALUES
('ivanov@example.com', '5f4dcc3b5aa765d61d8327deb882cf99', 'Иван', 'Иванов', 'avatar1.jpg'),
('petrov@example.com', '5f4dcc3b5aa765d61d8327deb882cf99', 'Пётр', 'Петров', 'avatar2.jpg');

-- добавили категории
INSERT INTO categories(name) VALUES
('Деревья'),
('За жизнь'),
('Без рамки'),
('Разное'),
('IT'),
('Музыка'),
('Кино'),
('Программирование'),
('Железо');

-- временно отключим проверку всех ограничений в таблице
ALTER TABLE articles DISABLE TRIGGER ALL;
-- добавили публикации
INSERT INTO articles(title, announce, full_text, picture, user_id, created_at) VALUES
('Ёлки. История деревьев', 'Вы можете достичь всего. Стоит только немного постараться и запастись книгами. Из под его пера вышло 8 платиновых альбомов. Ёлки — это не просто красивое дерево. Это прочная древесина. Он написал больше 30 хитов.', 'undefined', 'item10.jpg', 1, Fri Feb 25 2022 11:23:18 GMT+0300 (Москва, стандартное время));
-- после завершения операции вставки, включим обратно
ALTER TABLE articles ENABLE TRIGGER ALL;

-- присвоения категорий публикациям
ALTER TABLE article_categories DISABLE TRIGGER ALL;
INSERT INTO article_categories(article_id, category_id) VALUES
(1, 2);
ALTER TABLE article_categories ENABLE TRIGGER ALL;

-- добавили комментарии
ALTER TABLE comments DISABLE TRIGGER ALL;
INSERT INTO COMMENTS(text, user_id, article_id) VALUES
('Согласен с автором! Планируете записать видосик на эту тему? Хочу такую же футболку :-)', 1, 1),
('Планируете записать видосик на эту тему?', 1, 1),
('Мне кажется или я уже читал это где-то? Плюсую, но слишком много буквы!', 2, 1);
ALTER TABLE comments ENABLE TRIGGER ALL;
