'use strict';

const bcrypt = require( 'bcrypt' );
const bodyParser = require( 'body-parser' );
const cookieParser = require( 'cookie-parser' )
const express = require( "express" );
const humps = require( 'humps' );
const jwt = require( 'jsonwebtoken' );
const knex = require( '../knex.js' );
require( 'dotenv' ).config();

const JWT_SECRET = process.env.JWT_KEY;
const saltRounds = 10;

const app = express();
const router = express.Router();
app.use( cookieParser() );

router.get( '/token', ( req, res ) => {
  if ( !req.cookies.token ) {
    res.status( 200 ).send( false );
  } else {
    jwt.verify( req.cookies.token, JWT_SECRET, ( err, decoded ) => {
      if ( err ) {
        res.sendStatus( 404 );
      }
      res.status( 200 ).send( true );
    } )
  }
} );

router.post( '/token', ( req, res ) => {
  const email = req.body.email;
  const password = req.body.password;
  if (!email) {
    res.status( 400 ).set('Content-Type', 'text/plain').send('Email must not be blank');
    return;
  }
  if (!password) {
    res.status( 400 ).set('Content-Type', 'text/plain').send('Password must not be blank');
    return;
  }
  return knex( 'users' )
    .select( '*' )
    .where( 'email', email )
    .then( ( users ) => {
      if ( !users[0] || users[0].email !== email) {
        res.status( 400 ).set('Content-Type', 'text/plain').send( 'Bad email or password' );
        return;
      }
      const user = users[ 0 ];
      bcrypt.compare( password, user.hashed_password ).then( ( resolutionOfBcrypt ) => {
          if ( resolutionOfBcrypt === false ) {
            res.status( 400 ).set('Content-Type', 'text/plain').send( 'Bad email or password' );
            return;
          } else {
            const jwtPayload = {
              sub: {
                id: user.id,
                firstName: user.first_name,
                lastName: user.last_name,
                email: user.email
              },
              exp: Math.floor( Date.now() / 1000 ) + ( 60 * 60 ),
              loggedIn: true
            };

            const opts = {
              httpOnly: true
            };

            const token = jwt.sign( jwtPayload, JWT_SECRET );
            res.cookie( 'token', token, opts ).status( 200 ).json( jwtPayload.sub );
          }
        })
        .catch( err => {
          res.status( 400 ).send('Bad Request');
        });
    });
});

router.delete( '/token', ( req, res ) => {
  if ( !req.cookies.token ) {
    res.cookie( 'token', '' ).status( 200 ).send( true );
  } else {
    jwt.verify( req.cookies.token, JWT_SECRET, ( err, decoded ) => {
      if ( err ) {
        res.sendStatus( 404 );
      }
      delete req.cookies.token;
      res.cookie( 'token', '' ).status( 200 ).send( true );
    });
  }
});

module.exports = router;
