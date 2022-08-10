'use strict';

const {DataTypes, Model} = require(`sequelize`);

class Offer extends Model {}

const define = (sequelize) => Offer.init({
  title: {
    type: DataTypes.STRING,
    allowNull: false
  },
  announce: {
    // type: DataTypes[STRING](250)
    // eslint-disable-next-line new-cap
    type: DataTypes.STRING(250),
    allowNull: false
  },
  full_text: {
    // type: DataTypes[STRING](1000)
    // eslint-disable-next-line new-cap
    type: DataTypes.STRING(1000),
    allowNull: false
  },
  picture: DataTypes.STRING,
  created_at: {
    type: DataTypes.DATE,
    allowNull: false
  },
}, {
  sequelize,
  modelName: `Article`,
  tableName: `articles`
});

module.exports = define;
