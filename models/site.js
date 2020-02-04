'use strict';
module.exports = (sequelize, DataTypes) => {
  var Site = sequelize.define('Site', {
    name: DataTypes.STRING,
    url: {
      type: DataTypes.STRING,
      defaultValue: '',
    },
    icon: DataTypes.STRING,
    order: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    remark: {
      type: DataTypes.TEXT,
      defaultValue: ''
    }
  });

  Site.associate = function (models) {
    models.Site.belongsTo(models.Category, {
      onDelete: "CASCADE",
      foreignKey: {
        allowNull: false
      }
    });
  };

  return Site;
};
