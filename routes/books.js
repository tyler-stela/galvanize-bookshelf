'use strict';

const express = require('express');
const knex = require('../knex.js');
// eslint-disable-next-line new-cap
const router = express.Router();

router.get('/books', (req, res) => {
  knex('books')
    .select(
      'author',
      'cover_url AS coverUrl',
      'created_at AS createdAt',
      'description',
      'genre',
      'id',
      'title',
      'updated_at AS updatedAt'
    )
    .orderBy('title')
    .then(
      books => res.send(books),
      err => res.sendStatus(404)
    );
});

router.get('/books/:id', (req, res, next) => {
  knex('books')
    .select(
      'author',
      'cover_url AS coverUrl',
      'created_at AS createdAt',
      'description',
      'genre',
      'id',
      'title',
      'updated_at AS updatedAt'
    )
    .where('id', req.params.id)
    .first()
    .then(
      (book) => {
        if (!book) {
          return next();
        }
        res.send(book);
      })
      .catch((err) => {
        next(err);
      });
    });

router.post('/books', (req, res, next) => {
  knex('books')
    .insert({  }, '*')
    .then((books) => {
      res.send(books); // next id
    })
    .catch((err) => {
      next(err);
    });
  });



module.exports = router;
