const Sequelize = require('sequelize');

//  define connection
const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: 'events.db',
    define: {
        timestamps: false
    }
});

const User = sequelize.define('user', {
    userName: {
        type: Sequelize.STRING,
        allowNull: false
    },
    password: {
        type: Sequelize.STRING,
        allowNull: false
    } 
});

const Event = sequelize.define('event', {
    name: {
        type: Sequelize.STRING,
        allowNull: false
    },
    location: {
        type: Sequelize.TEXT,
        allowNull: false
    },
    date: {
        type: Sequelize.DATE,
        allowNull: false
    },
    startHour: {
        type: Sequelize.STRING,
        allowNull: false
    }
});

User.hasMany(Event)

// send to database
// create table if not exists
sequelize.sync({force: true})
    .then(() => {
        console.warn('table created')
    })