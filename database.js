const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('associationdb', 'root', 'Shashvraj21!', {
    host: 'localhost',
    dialect: 'mysql',
    logging: false
});

module.exports = sequelize;
