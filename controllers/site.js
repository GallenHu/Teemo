const db = require('../models');
const sequelize = db.sequelize;

module.exports = {
  createSite: async function(category, params) {
    return await category.createSite(params);
  },

  getAllSites: async function(category) {
    if (!category) return [];
    return await category.getSites();
  }
};
