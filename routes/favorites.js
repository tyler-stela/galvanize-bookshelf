'use strict';

// knex migrate:make 01_favorites
// knex seed:make favorites
// knex seed:run
// knex migrate:latest

const bodyParser = require('body-parser');
const cookieParser = require( 'cookie-parser' )
const express = require('express');
const humps = require('humps');
const knex = require('../knex.js');

// eslint-disable-next-line new-cap
const app = express();
const router = express.Router();
app.use( cookieParser() );

router.get('/favorites', (req, res) => {
  if ( !req.cookies.token ) {
    res.status( 401 ).set('Content-Type', 'text/plain').send( 'Unauthorized' );
    return;
  }
  knex('favorites')
    .select('*')
    .innerJoin('books', 'favorites.id', 'books.id' )
    .then((favorites) => {
      let result = humps.camelizeKeys(favorites)
      res.status(200).json(result)
    })
    // .catch(err => res.sendStatus(404))
});

router.get('/favorites/:id', (req, res) => {
  if ( !req.cookies.token ) {
    res.status( 401 ).set('Content-Type', 'text/plain').send( 'Unauthorized' );
    return;
  }
  knex('favorites')
    .select('*')
    .innerJoin('books', 'favorites.id', 'books.id' )
    .where('book_id', req.query.bookId)
    .first()
    .then((favoriteBook) => {
      if (!favoriteBook) {
        res.status(200).send(false)
        return;
      }
      res.status(200).send(true)
    })
    // .catch(err => res.sendStatus(404))
});

router.post('/favorites', (req, res) => {
  if ( !req.cookies.token ) {
    res.status( 401 ).set('Content-Type', 'text/plain').send( 'Unauthorized' );
    return;
  }
  knex('favorites')
    .insert({book_id: req.body.bookId, user_id: 1}, '*')
    .into('favorites')
    .then((newFavorite) => {
      if (!newFavorite[0]) {
        res.sendStatus(401);
      }
      res.status(200).json(humps.camelizeKeys(newFavorite[0]));
    })
    // .catch(err => res.sendStatus(404))
})

router.delete('/favorites', (req, res, next) => {
  if ( !req.cookies.token ) {
    res.status( 401 ).set('Content-Type', 'text/plain').send( 'Unauthorized' );
    return;
  }
  let deletedFavorite;
  knex('favorites')
    .select('*')
    .where('book_id', req.body.bookId)
    .then((noLongerFavorite) => {
      if (!noLongerFavorite[0]) {
          return next();
      }
      deletedFavorite = noLongerFavorite;
      return knex('favorites')
        .del()
        .where('id', req.body.bookId)
    })
    .then( () => {
      delete deletedFavorite[0].id
      res.status(200).send(humps.camelizeKeys(deletedFavorite[0]));
    })
    // .catch(err => res.sendStatus(404))
});

module.exports = router;
