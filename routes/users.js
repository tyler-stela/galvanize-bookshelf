'use strict';
const bodyParser = require('body-parser');
const express = require('express');
const humps = require('humps');
const knex = require('../knex.js');

const bcrypt = require('bcrypt');
const saltRounds = 10;

// eslint-disable-next-line new-cap
const router = express.Router();

router.post('/users', (req, res) => {
  const plaintextPassword = req.body.password;

  bcrypt
    .hash(plaintextPassword, saltRounds)
    .then((hash) => {
      req.body.hashed_password = hash;
      delete req.body.password;
    })
    .then(() => {
      const newBody = req.body;

      return knex('users')
        .insert(humps.decamelizeKeys(req.body), '*')
        .then((users) => {
          if (!users) {
            res.sendStatus(404);
          }
          const user = users[0];

          delete user.hashed_password;
          res.status(200).json(humps.camelizeKeys(user));
        })
        .catch((err) => {
          res.sendStatus(500);
        });
    });
});

module.exports = router;
