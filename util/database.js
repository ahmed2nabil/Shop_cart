const Sequelize = require('sequelize');

//mysql://b9132e62374537:26d70167@us-cdbr-east-04.cleardb.com/heroku_2a753bf0f0af225?reconnect=true
const sequelize = new Sequelize('heroku_2a753bf0f0af225', 'b9132e62374537', '26d70167', {
  dialect: 'mysql',
  host: 'us-cdbr-east-04.cleardb.com'
});

module.exports = sequelize;
