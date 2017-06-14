'use strict';
const bodyParser = require('body-parser');
const express = require('express');
const humps = require('humps');
const knex = require('../knex.js');

const bcrypt = require('bcrypt');
const saltRounds = 10;

// eslint-disable-next-line new-cap
const router = express.Router();

/* ======================================================================== */

// function passwordHasher(unhashedPassword) {
//   console.log('BEFORE:', unhashedPassword);
//   return bcrypt.hash(unhashedPassword, saltRounds, (err, hash) => {
//     console.log('AFTER:', hash);
//   });
// }

/* ======================================================================== */

router.post('/users', (req, res) => {
  var plaintextPassword = req.body.password;

  bcrypt.hash(plaintextPassword, saltRounds).then((hash) => {
      req.body.hashed_password = hash;
      delete req.body.password;
    }).then(() => {
      var newBody = req.body;

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
          .catch(err => {
            console.log('ERROR:', err);
            res.sendStatus(500);
          });

    })

});

module.exports = router;
