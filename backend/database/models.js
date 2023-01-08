const sequelize = require('../database/sequelize')
const {DataTypes} = require('sequelize')

const User = sequelize.define('user', {
    userName: {
        type: DataTypes.STRING,
        allowNull: false
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false
    } 
});

const Event = sequelize.define('event', {
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    location: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    date: {
        type: DataTypes.DATE,
        allowNull: false
    },
    startHour: {
        type: DataTypes.STRING,
        allowNull: false
    },
    userId: {
        type:DataTypes.INTEGER,
        allowNull:false
    }
});

module.exports ={User, Event}