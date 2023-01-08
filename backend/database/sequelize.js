const {Sequelize} = require('sequelize')

const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: './database/events.db',
  define: {
      timestamps: false
  }
});

module.exports = sequelize