-- список всех категорий
SELECT * FROM categories;

-- список категорий, для которых создана минимум одна публикация
SELECT
  categories.id,
  categories.name
FROM categories
  LEFT JOIN articles_categories
    ON categories.id = articles_categories.category_id
GROUP BY categories.id;

-- список категорий с количеством публикаций
SELECT
  categories.id,
  categories.name,
  count(articles_categories.article_id)
FROM categories
  LEFT JOIN articles_categories
    ON categories.id = articles_categories.category_id
GROUP BY categories.id;

-- список публикаций
SELECT articles.*,
  COUNT(comments.id) AS comments_count,
  STRING_AGG(DISTINCT categories.name, ', ') AS category_list,
  users.first_name,
  users.last_name,
  users.email
FROM articles
  JOIN articles_categories
    ON articles.id = articles_categories.article_id
  JOIN categories
    ON articles_categories.category_id = categories.id
  LEFT JOIN comments
    ON comments.article_id = articles.id
  JOIN users
    ON users.id = articles.user_id
GROUP BY articles.id, users.id
ORDER BY articles.created_at DESC;

-- полная информация определённой публикации
SELECT articles.*,
  COUNT(comments.id) AS comments_count,
  STRING_AGG(DISTINCT categories.name, ', ') AS category_list,
  users.first_name,
  users.last_name,
  users.email
FROM articles
  JOIN articles_categories
    ON articles.id = articles_categories.article_id
  JOIN categories
    ON articles_categories.category_id = categories.id
  LEFT JOIN comments
    ON comments.article_id = articles.id
  JOIN users
    ON users.id = articles.user_id
WHERE articles.id = 1
  GROUP BY articles.id, users.id;

-- список из 5 свежих комментариев
SELECT
  comments.id,
  comments.article_id,
  users.first_name,
  users.last_name,
  comments.text
FROM comments
  JOIN users
    ON comments.user_id = users.id
  ORDER BY comments.created_at DESC
  LIMIT 5;

-- список комментариев для определённой публикации
SELECT
  comments.id,
  comments.article_id,
  users.first_name,
  users.last_name,
  comments.text
FROM comments
  JOIN users
    ON comments.user_id = users.id
WHERE comments.article_id = 1
  ORDER BY comments.created_at DESC;

-- обновить заголовок определённой публикации
UPDATE articles
SET title = 'Как я встретил Новый год'
WHERE id = 1;
