const Sequelize = require('sequelize');

//  define connection
const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: 'events.db'
});

sequelize.authenticate()
    .then(() => {
        console.warn('we are connected')
    })
    .catch((err) => {
        console.warn(err)
    })