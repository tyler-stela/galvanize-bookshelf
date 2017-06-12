'use strict';

const express = require('express');
const knex = require('../db/knex.js');
// eslint-disable-next-line new-cap
const router = express.Router();

router.get('/books', (req, res) => {
  knex('books')
    .select('*')
    .then((books) => {
      res.status(200).json(books);
    });
});

module.exports = router;
