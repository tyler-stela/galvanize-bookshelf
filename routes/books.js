'use strict';

const bodyParser = require('body-parser');
const express = require('express');
const humps = require('humps');
const knex = require('../knex.js');

// eslint-disable-next-line new-cap
const router = express.Router();

router.get('/books', (req, res) => {
  knex('books')
    .select('*')
    .orderBy('title', 'asc')
    .then((books) => {
      res.status(200).json(humps.camelizeKeys(books));
    })
    .catch((err) => res.sendStatus(404));
});

router.get('/books/:id', (req, res) => {
  knex('books')
    .select('*')
    .where('id', req.params.id)
    .first()
    .then((book) => {
      if (!book) {
        res.sendStatus(404);

        return;
      }
      res.status(200).json(humps.camelizeKeys({ book }).book);
    })
    .catch((err) => res.sendStatus(404));
});

router.post('/books', (req, res) => {
  if (req.body.title === undefined) {
    res.status(400).set('Content-Type', 'text/plain').send('Title must not be blank');

    return;
  }
  if (req.body.author === undefined) {
    res.status(400).set('Content-Type', 'text/plain').send('Author must not be blank');

    return;
  }
  if (req.body.genre === undefined) {
    res.status(400).set('Content-Type', 'text/plain').send('Genre must not be blank');

    return;
  }
  if (req.body.description === undefined) {
    res.status(400).set('Content-Type', 'text/plain').send('Description must not be blank');

    return;
  }
  if (req.body.coverUrl === undefined) {
    res.status(400).set('Content-Type', 'text/plain').send('Cover URL must not be blank');

    return;
  }
  knex('books')
    .insert(humps.decamelizeKeys(req.body), '*')
    .then((books) => {
      if (!books) {
        res.sendStatus(404);
      }
      const book = books[0];

      res.status(200).json(humps.camelizeKeys(book));
    })
    .catch((err) => {
      res.sendStatus(500);
    });
});

router.patch('/books/:id', (req, res) => {
  knex('books')
    .select('*')
    .where('id', req.params.id)
    .then((book) => {
      if (!book) {
        res.sendStatus(404);
      }

      return knex('books')
        .update(humps.decamelizeKeys(req.body), '*')
        .where('id', req.params.id);
    })
    .then((books) => {
      res.status(200);
      res.send(humps.camelizeKeys(books[0]));
    })
    .catch((err) => {
      res.sendStatus(404);
    });
});

router.delete('/books/:id', (req, res, next) => {
  let deletedBook;

  knex('books')
    .select('*')
    .where('id', req.params.id)
    .then((book) => {
      if (!book) {
        return next();
      }
      deletedBook = book;

      return knex('books').del().where('id', req.params.id);
    })
    .then(() => {
      delete deletedBook[0].id;
      res.status(200);
      res.send(humps.camelizeKeys(deletedBook[0]));
    })
    .catch((err) => {
      res.sendStatus(404);
    });
});

module.exports = router;
