'use strict';
module.exports = (sequelize, DataTypes) => {
  var User = sequelize.define('User', {
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: { isEmail: { msg: 'email invalid.' } },
    },
    username: DataTypes.STRING,
    avator: DataTypes.STRING,
    nickname: DataTypes.STRING,
    current_category: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    }
  });

  User.associate = function(models) {
    models.User.hasMany(models.Category);
  };

  return User;
};
