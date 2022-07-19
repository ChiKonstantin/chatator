const Sequelize = require('sequelize');
const db = new Sequelize('postgres://localhost:5432/chatator');

// Defining models
const User = db.define('user', {
  userName: {
    type: Sequelize.STRING,
  },
  roomCode: {
    type: Sequelize.INTEGER,
  },
  userLang: {
    type: Sequelize.STRING,
  },
});

const Message = db.define('messages', {
  message: {
    type: Sequelize.STRING,
  },
  messageLang: {
    type: Sequelize.STRING,
    // validate: {
    //   isIn: [
    //     [
    //       'en',
    //       'ar',
    //       'az',
    //       'zh',
    //       'cs',
    //       'da',
    //       'nl',
    //       'eo',
    //       'fi',
    //       'fr',
    //       'de',
    //       'el',
    //       'he',
    //       'hi',
    //       'hu',
    //       'id',
    //       'ga',
    //       'it',
    //       'ja',
    //       'ko',
    //       'fa',
    //       'pl',
    //       'pt',
    //       'ru',
    //       'sk',
    //       'es',
    //       'sv',
    //       'tr',
    //       'uk',
    //       'vi',
    //     ],
    //   ],
    // },
  },
  roomCode: {
    type: Sequelize.INTEGER,
  },
});

User.hasMany(Message);
Message.belongsTo(User);

// Syncing DB
async function syncDb() {
  console.log('Syncing db...');
  await db.sync();
  //Alternative, for when to drop tables:
  // await db.sync({ force: true });
  console.log('Synced!');
  await db.close();
  console.log('Closed db.');
}

syncDb();

module.exports = { User, Message, db };
