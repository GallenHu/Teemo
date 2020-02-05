const db = require('../models');

module.exports = {
  createSite: async function(category, params) {
    return await category.createSite(params);
  },

  getAllSites: async function(category) {
    if (!category) return [];
    return await category.getSites({
      order: [
        ['order', 'DESC'],
        ['createdAt', 'ASC'],
      ],
    });
  },

  getSiteById: async function(user, siteId) {
    if (!user || !siteId) return null;
    return await db.Site.findOne({
      where: { id: siteId, UserId: user.id }
    });
  },

  deleteSite: async function(user, id) {
    const site = await this.getSiteById(user, id);
    await site.destroy();
  }
};
