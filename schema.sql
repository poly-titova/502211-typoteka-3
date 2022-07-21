CREATE TABLE categories(
  name varchar(255) NOT NULL
);

CREATE TABLE users(
  email varchar(255) NOT NULL,
  password_hash varchar(255) NOT NULL,
  first_name varchar(255) NOT NULL,
  last_name varchar(255) NOT NULL,
  avatar varchar(50) NOT NULL
);

CREATE TABLE articles(
  title varchar(255) NOT NULL,
  announce text NOT NULL,
  full_text text NOT NULL,
  picture varchar(50),
  created_at timestamp NOT NULL
);

CREATE TABLE comments(
  text text NOT NULL,
  created_at timestamp NOT NULL
);
