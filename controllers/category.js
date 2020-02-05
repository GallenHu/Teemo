const db = require('../models');
const userController = require('./user');

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
  },

  deleteCategory: async function(user, categoryId) {
    const category = await this.getCategoryById(user, categoryId);
    if (category) {
      if (categoryId === user.current_category)
        await userController.updateCurrentCategory(user, 1);
      await category.destroy();
    }
  }
};
