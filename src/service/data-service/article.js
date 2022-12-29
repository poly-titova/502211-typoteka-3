'use strict';

const Aliase = require(`../models/aliase`);

class ArticleService {
  constructor(sequelize) {
    this._sequelize = sequelize;
    this._Article = sequelize.models.Article;
    this._Comment = sequelize.models.Comment;
    this._Category = sequelize.models.Category;
    this._User = sequelize.models.User;
  }

  async create(articleData) {
    const article = await this._Article.create(articleData);
    await article.addCategories(articleData.categories);
    return article.get();
  }

  async drop({userId, articleId}) {
    const deletedRow = await this._Article.destroy({
      where: {
        id: articleId,
        userId
      }
    });
    return !!deletedRow;
  }

  async findAll({userId, withComments}) {
    const options = {
      include: [
        Aliase.CATEGORIES,
        {
          model: this._User,
          as: Aliase.USERS,
          attributes: {
            exclude: [`passwordHash`]
          }
        }
      ],
      order: [
        [`createdAt`, `DESC`]
      ],
      where: {
        userId
      }
    };

    if (withComments) {
      options.include.push({
        model: this._Comment,
        as: Aliase.COMMENTS,
        include: [
          {
            model: this._User,
            as: Aliase.USERS,
            attributes: {
              exclude: [`passwordHash`]
            }
          }
        ]
      });

      options.order.push([
        {model: this._Comment, as: Aliase.COMMENTS}, `createdAt`, `DESC`
      ]);
    }

    let articles = await this._Article.findAll(options);

    articles = articles.map((item) => item.get());

    if (withComments) {
      articles = articles.filter((article) => article.comments.length > 0);
    }

    return articles;
  }

  async findOne({articleId, userId, withComments}) {
    const options = {
      include: [
        Aliase.CATEGORIES,
        {
          model: this._User,
          as: Aliase.USERS,
          attributes: {
            exclude: [`passwordHash`]
          }
        }
      ],
      where: [{
        id: articleId
      }]
    };

    if (userId) {
      options.where.push({userId});
    }

    if (withComments) {
      options.include.push({
        model: this._Comment,
        as: Aliase.COMMENTS,
        include: [
          {
            model: this._User,
            as: Aliase.USERS,
            attributes: {
              exclude: [`passwordHash`]
            }
          }
        ]
      });

      options.order = [
        [{model: this._Comment, as: Aliase.COMMENTS}, `createdAt`, `DESC`]
      ];
    }

    return await this._Article.findOne(options);
  }

  async findPage({limit, offset}) {
    const {count, rows} = await this._Article.findAndCountAll({
      limit,
      offset,
      include: [
        Aliase.CATEGORIES,
        {
          model: this._User,
          as: Aliase.USERS,
          attributes: {
            exclude: [`passwordHash`]
          }
        }
      ],
      order: [
        [`createdAt`, `DESC`]
      ],
      distinct: true
    });

    return {count, rows};
  }

  async findLimit({limit, withComments}) {
    if (!withComments) {
      const options = {
        limit,
        include: [
          Aliase.CATEGORIES
        ],
        order: [
          [`createdAt`, `DESC`]
        ]
      };

      return await this._Article.findAll(options);
    }

    const options = {
      subQuery: false,
      attributes: {
        include: [
          [this._sequelize.fn(`COUNT`, this._sequelize.col(`comments.id`)), `commentsCount`]
        ]
      },
      include: [
        {
          model: this._Comment,
          as: Aliase.COMMENTS,
          attributes: [],
        },
        {
          model: this._Category,
          as: Aliase.CATEGORIES,
          attributes: [`id`, `name`]
        }
      ],
      group: [
        `Article.id`,
        `categories.id`,
        `categories->ArticlesCategories.ArticleId`,
        `categories->ArticlesCategories.CategoryId`
      ],
      order: [
        [this._sequelize.fn(`COUNT`, this._sequelize.col(`comments.id`)), `DESC`]
      ]
    };

    let articles = await this._Article.findAll(options);

    articles = articles
      .map((article) => article.get())
      .filter((article) => article.commentsCount > 0);

    return articles.slice(0, limit);
  }

  async update({id, article}) {
    const affectedRows = await this._Article.update(article, {
      where: {
        id,
        userId: article.userId
      }
    });

    const updatedArticle = await this._Article.findOne({
      where: {
        id,
        userId: article.userId
      }
    });

    await updatedArticle.setCategories(article.categories);

    return !!affectedRows;
  }
}

module.exports = ArticleService;
