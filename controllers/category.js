const db = require('../models');
const sequelize = db.sequelize;

module.exports = {
  getAllCategories: async function(user) {
    const categories = await user.getCategories();
    return categories;
  },

  getCategoryById: async function(user, categoryId) {
    const categories = await user.getCategories({
      where: { id: categoryId }
    });
    return categories.length ? categories[0] : null;
  },

  createCategory: async function(user, params) {
    return await user.createCategory(params);
  }
};
