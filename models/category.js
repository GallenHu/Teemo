'use strict';
module.exports = (sequelize, DataTypes) => {
  var Category = sequelize.define('Category', {
    name: DataTypes.STRING,
    order: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    remark: {
      type: DataTypes.TEXT,
      defaultValue: ''
    },
  }, {
    paranoid: true
  });

  Category.associate = function(models) {
    models.Category.hasMany(models.Site);

    models.Category.belongsTo(models.User, {
      onDelete: "CASCADE",
      foreignKey: {
        allowNull: false
      }
    });
  };

  return Category;
};
