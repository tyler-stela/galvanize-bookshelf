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
  console.log(req.cookies.token, '<<<<');

  if ( !req.cookies.token ) {
    res.status(200).send(false);
  } else {
    console.log('check')
    jwt.verify( req.cookies.token, JWT_SECRET, ( err, decoded ) => {
      console.log( 'decoded!', decoded );
      if ( err ) {
        console.log( 'cookie with the error', req.cookies);
        res.sendStatus( 404 );
        return false;
      }
      console.log( 'got to 200' );
      res.status( 200 ).json( result );
    } )
    .catch( err => {
       console.log('ERROR:', err);
      res.sendStatus( 500 );
    } );
  }


} );


  router.post( '/token', ( req, res ) => {
    var email = req.body.email;
    var password = req.body.password;

    return knex( 'users' )
      .select( 'email', 'hashed_password' )
      .where( 'email', email )
      .then( ( users ) => {
        if ( !users ) {
          console.log( 'email not found--you probably don\'t exist' );
          res.sendStatus( 404 );
        }
        const user = users[ 0 ];
        var storedPassword = user.hashed_password;

        bcrypt.compare( password, storedPassword ).then( ( resolutionOfBcrypt ) => {
            if ( resolutionOfBcrypt === false ) {
              console.log( 'wrong password' );
              res.sendStatus( 401.1 );
              return;
            } else {

              const jwtPayload = {
                sub: {
                  id: user.id,
                  first_name: user.first_name,
                  last_name: user.last_name,
                  email: user.email
                },
                exp: Math.floor( Date.now() / 1000 ) + ( 60 * 60 ),
                loggedIn: true,

              };
              const opts = {
                httpOnly: true
              };

              const token = jwt.sign( jwtPayload, JWT_SECRET );
              res.cookie( 'token', token, opts ).send( 'password correct, jwt set in auth cookie' ).status( 200 ).json( jwtPayload );
              console.log( "ressssss", res.cookie );

              console.log( 'RESULT:', token );
              //    return token;
            }
          } )
          .catch( err => {
            // console.log('ERROR:', err);
            res.sendStatus( 500 );
          } );

      } );
  } );
module.exports = router;
