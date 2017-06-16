'use strict';

const bodyParser = require( 'body-parser' );
const cookieParser = require( 'cookie-parser' )
const express = require( "express" );
const jwt = require( 'jsonwebtoken' );
const humps = require( 'humps' );
const knex = require( '../knex.js' );
require( 'dotenv' ).config();
const app = express();
const bcrypt = require( 'bcrypt' );
const saltRounds = 10;
app.use( cookieParser() );
const router = express.Router();
const JWT_SECRET = process.env.JWT_KEY;




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
  var email = req.body.email;
  var password = req.body.password;

  return knex( 'users' )
    .select( '*' )
    .where( 'email', email )
    .then( ( users ) => {
      if ( !users[0] || users[0].email !== email ) {
        res.status( 400 ).set('Content-Type', 'text/plain').send( 'Bad email or password' );
        return;
      }

      const user = users[ 0 ];
      var storedPassword = user.hashed_password;

      bcrypt.compare( password, storedPassword ).then( ( resolutionOfBcrypt ) => {
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
        } )
        .catch( err => {
          res.sendStatus( 500 );
        } );
    } );
} );

router.delete( '/token', ( req, res ) => {
  if ( !req.cookies.token ) {
    res.cookie( 'token', '' ).status( 200 ).send( true );
  } else {
    jwt.verify( req.cookies.token, JWT_SECRET, ( err, decoded ) => {
      if ( err ) {
        res.sendStatus( 404 );
      }
      console.log( 'FOUND TOKEN' );
      delete req.cookies.token;
      res.cookie( 'token', '' ).status( 200 ).send( true );
    } )
  }

} );




module.exports = router;
