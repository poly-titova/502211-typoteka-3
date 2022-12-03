'use strict';

const {Model} = require(`sequelize`);
const defineCategory = require(`./category`);
const defineComment = require(`./comment`);
const defineArticle = require(`./article`);
const defineUser = require(`./user`);
const Aliase = require(`./aliase`);

class ArticleCategories extends Model {}

const define = (sequelize) => {
  const Category = defineCategory(sequelize);
  const Comment = defineComment(sequelize);
  const Article = defineArticle(sequelize);
  const User = defineUser(sequelize);

  Article.hasMany(Comment, {as: Aliase.COMMENTS, foreignKey: `articleId`, onDelete: `cascade`});
  Comment.belongsTo(Article, {foreignKey: `articleId`});

  ArticleCategories.init({}, {sequelize});

  Article.belongsToMany(Category, {through: ArticleCategories, as: Aliase.CATEGORIES});
  Category.belongsToMany(Article, {through: ArticleCategories, as: Aliase.ARTICLES});
  Category.hasMany(ArticleCategories, {as: Aliase.ARTICLE_CATEGORIES});

  User.hasMany(Article, {as: Aliase.ARTICLES, foreignKey: `userId`});
  Article.belongsTo(User, {as: Aliase.USERS, foreignKey: `userId`});

  User.hasMany(Comment, {as: Aliase.COMMENTS, foreignKey: `userId`});
  Comment.belongsTo(User, {as: Aliase.USERS, foreignKey: `userId`});

  return {Category, Comment, Article, ArticleCategories, User};
};

module.exports = define;
