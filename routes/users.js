const users = require('express').Router();

users.get('/', (req, res, next) => {
  res.status(200).json({msg: 'hello from users route'});
})

module.exports = users;