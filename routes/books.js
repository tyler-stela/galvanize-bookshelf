'use strict';
const bodyParser = require('body-parser');
const express = require('express');
const humps = require('humps');
const knex = require('../knex.js');

// eslint-disable-next-line new-cap
const router = express.Router();

router.get('/books', (req, res) => {
  knex('books')
    .select(
      'id',
      'title',
      'author',
      'genre',
      'description',
      'cover_url AS coverUrl',
      'created_at AS createdAt',
      'updated_at AS updatedAt'
    )
    .orderBy('title', 'asc')
    .then((books) => {
      res.status(200).json(books);
    })
    .catch(err => res.sendStatus(404));
});

router.get('/books/:id', (req, res) => {
  knex('books')
    .select(
      'id',
      'title',
      'author',
      'genre',
      'description',
      'cover_url AS coverUrl',
      'created_at AS createdAt',
      'updated_at AS updatedAt'
    )
    .where('id', req.params.id)
    .first()
    .then((book) => {
      if (!book) {
        res.sendStatus(404);
      }
        res.status(200).json({book}.book);
    })
    .catch(err => res.sendStatus(500));
});

router.post('/books', (req, res) => {
  knex('books')
    .insert(humps.decamelizeKeys(req.body), '*')
    // .insert({
    //   title: req.body.title,
    //   author: req.body.author,
    //   genre: req.body.genre,
    //   description: req.body.description,
    //   cover_url: req.body.coverUrl
    // }, '*')
    .then((books) => {
      if (!books) {
        res.sendStatus(404);
      }
      const book = books[0];
      res.status(200).json(humps.camelizeKeys(book));
      // res.json({
      //   id: book.id,
      //   coverUrl: book.cover_url,
      //   author: book.author,
      //   description: book.description,
      //   title: book.title,
      //   genre: book.genre
      // })
    })
    .catch(err => {
      console.log('errrrrrr', err)
      res.sendStatus(500)
    });
});

router.patch('/books/:id', (req, res) => {
  knex('books')
    .select(
      'id',
      'title',
      'author',
      'genre',
      'description',
      'cover_url AS coverUrl',
      'created_at AS createdAt',
      'updated_at AS updatedAt'
    )
    .where('id', req.params.id)
    .then((book) => {
      if (!book) {
        res.sendStatus(404);
      }
      return knex('books')
        .update(humps.decamelizeKeys(req.body), '*')
        .where('id', req.params.id)
    })
    .then((books) => {
      res.status(200);
      res.send(humps.camelizeKeys(books[0]));
    })
    .catch(err => {
      res.sendStatus(500)
    });
});

router.delete('/books/:id', (req, res, next) => {
  // console.log('REQUEST:', req.params.id);
  var deletedBook;

  knex('books')
    .select(
      'id',
      'title',
      'author',
      'genre',
      'description',
      'cover_url AS coverUrl',
      'created_at AS createdAt',
      'updated_at AS updatedAt'
    )
    .where('id', req.params.id)
    .then((book) => {
      if (!book) {
        return next();
      }
      deletedBook = book;
      return knex('books')
        .del()
        .where('id', req.params.id)
    })
    .then(() => {
      delete deletedBook[0].id;
      res.status(200);
      res.send(humps.camelizeKeys(deletedBook[0]));
    })
    .catch(err => {
      res.sendStatus(500)
    });
});


module.exports = router;
