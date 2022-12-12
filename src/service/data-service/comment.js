'use strict';

class CommentService {
  constructor(sequelize) {
    this._Article = sequelize.models.Article;
    this._Comment = sequelize.models.Comment;
  }

  async create(articleId, comment) {
    return await this._Comment.create({
      articleId,
      ...comment
    });
  }

  async drop(userId, articleId, commentId) {
    const articleByUser = await this._Article.findOne({
      where: {
        id: articleId,
        userId
      }
    });

    if (!articleByUser) {
      return !!articleByUser;
    }

    const deletedRows = await this._Comment.destroy({
      where: {
        id: commentId
      }
    });

    return !!deletedRows;
  }

  async findAll(articleId) {
    return await this._Comment.findAll({
      where: {articleId},
      raw: true
    });
  }

  async findOne(id, articleId) {
    return await this._Comment.findOne({
      where: {
        id,
        articleId
      }
    });
  }
}

module.exports = CommentService;
