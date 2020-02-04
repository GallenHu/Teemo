const db = require('../models');
const sequelize = db.sequelize;

module.exports = {
  createOrGetUser: async function(userInfo) {
    console.log('userInfo', userInfo);
    const { email, avator, nickname, username } = userInfo;
    let transaction;

    try {
      // get transaction
      transaction = await sequelize.transaction();

      // step 1
      let user = await db.User.findOne({ where: { email } });

      if (!user) {
        user = await db.User.create({
          email,
          avator,
          username,
          nickname
        });
        const defaultCategory = await user.createCategory({
          name: '默认'
        });
        user.update({ current_category: defaultCategory.id });
      }

      // commit
      await transaction.commit();
      return user;
    } catch (err) {
      console.error(err);
      // Rollback transaction only if the transaction object is defined
      if (transaction) await transaction.rollback();
    }
  },

  getUser: async function(userId) {
    const user = await db.User.findOne({ where: { id: userId } });
    return user;
  }
};
