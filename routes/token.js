'use strict';

const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser')
const express = require("express");
const humps = require('humps');
const knex = require('../knex.js');
const app = express();

const bcrypt = require('bcrypt');
const saltRounds = 10;

const jwt = require('jsonwebtoken');

// const JWT_SECRET = require('../.env');

app.use(cookieParser());
const router = express.Router();

const privateKey = 'H0L4qgAGO2yqqYXh0gcG3G2M3zSO+ptYrQYt1FnTGIp6LGv9Rk8YkJ2Iz2UdueMP ftOPA1W0geq4E5s+OQDt7g==';

router.post('/token', (req, res) => {
  var email = req.body.email;
  var password = req.body.password;

    return knex('users')
      .select('email', 'hashed_password')
      .where('email', email)
      .then((users) => {
        if (!users) {
          console.log('email not found--you probably don\'t exist');
          res.sendStatus(404);
        }
        const user = users[0];
        var storedPassword = user.hashed_password;

        bcrypt.compare(password, storedPassword).then((resolutionOfBcrypt) => {
            if (resolutionOfBcrypt === false) {
              console.log('wrong password');
              res.sendStatus(401.1);
              return;
            } else {

              var tokenData = {
                email: user.email,
                password: storedPassword
              };

              var result = {
                email: user.email,
                password: storedPassword,
                token: jwt.sign(tokenData, privateKey)
              };

              console.log('RESULT:', result);
              return result;
            }
        })
        .then((result) => {
          var token = result.token;
          res.status(200).json(token);

          var opts = {
            maxAge: 900000,
            httpOnly: true
          };
          res.cookie('Auth token', token, opts);
          res.send('Cookie was created!');
          res.end();

        });
      })
      .catch(err => {
        // console.log('ERROR:', err);
        res.sendStatus(500);
      });

});

module.exports = router;
