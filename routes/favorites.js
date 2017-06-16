'use strict';

// knex migrate:make 01_favorites
// knex seed:make favorites
// knex seed:run
// knex migrate:latest

const bodyParser = require('body-parser');
const express = require('express');
const humps = require('humps');
const knex = require('../knex.js');

// eslint-disable-next-line new-cap
const router = express.Router();


router.get('/favorites', (req, res) => {
  knex('favorites')
    .select('*')
    .innerJoin('books', 'favorites.id', 'books.id' )
    .then((favorites) => {
      let result = humps.camelizeKeys(favorites)
      res.status(200).json(result)
    })
    .catch(err => res.sendStatus(404))
});

router.get('/favorites/:id', (req, res) => {
  knex('favorites')
    .select('*')
    .innerJoin('books', 'favorites.id', 'books.id' )
    .where('book_id', req.query.bookId)
    .first()
    .then((favorite_book) => {
      if (!favorite_book) {
        res.status(200).send(false)
      }
      res.status(200).send(true)
    })
    .catch(err => {
      res.sendStatus(404)
    })
});



module.exports = router;
