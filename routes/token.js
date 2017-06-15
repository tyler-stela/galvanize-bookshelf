'use strict';

const router = express.Router();

const bodyParser = require( 'body-parser' );
const cookieParser = require( 'cookie-parser' )
const express = require( "express" );
const humps = require( 'humps' );
const knex = require( '../knex.js' );
const app = express();

const bcrypt = require( 'bcrypt' );
const saltRounds = 10;

require( 'dotenv' ).config()
const JWT_SECRET = process.env.JWT_KEY;

const jwt = require( 'jsonwebtoken' );

app.use( cookieParser() );

// const privateKey = 'H0L4qgAGO2yqqYXh0gcG3G2M3zSO+ptYrQYt1FnTGIp6LGv9Rk8YkJ2Iz2UdueMP ftOPA1W0geq4E5s+OQDt7g==';

/* ========================================================== */

router.post( '/login', ( req, res ) => {
  const {
    email,
    password
  } = req.body;

  // getUser() checks the database to see if there is an email === email
  users.getUser( email )
    .then( user => {
      if ( !user ) {
        res.status( 404 ).send( 'User not registered' )
      }
      return users.loginUser( email, hashed_password )
    } )
    // loginUser() has to hash the password and compare it to the stored hashed_password for the user that we found in the table using getUser()
    .then( isCorrectPassword => {
      if ( !isCorrectPassword ) {
        res.send( 'Incorrect password' )
      } else {
        res.json( isCorrectPassword )
      }
    } )
    .catch( err => {
      res.status( 500 ).send( `There was an error logging in: ${err}` )
    } )
} )

router.get( '/users', ( req, res ) => {
  // getEmails() queries the database to return the emails of all users
  users.getEmails()
    .then( emails => {
      res.json( emails );
    } )
    .catch( err => {
      res.status( 404 ).send( `There was an error retrieving the emails: ${err}` )
    } )
} )

function getUser( email ) {
  return knex( 'users' )
    .select( '*' )
    .where( 'email', email )
}

function loginUser( email, hashed_password ) {

}

function getEmails() {
  return knex( 'users' )
    .select( 'email' )
}

/* ========================================================== */

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

            var tokenData = {
              email: user.email,
              password: storedPassword
            };

            var result = {
              email: user.email,
              password: storedPassword,
              token: jwt.sign( tokenData, privateKey )
            };

            console.log( 'RESULT:', result );
            return result;
          }
        } )
        .then( ( result ) => {
          var token = result.token;
          res.status( 200 ).json( token );

          var opts = {
            maxAge: 900000,
            httpOnly: true
          };
          res.cookie( 'Auth token', token, opts );
          res.send( 'Cookie was created!' );
          res.end();

        } );
    } )
    .catch( err => {
      // console.log('ERROR:', err);
      res.sendStatus( 500 );
    } );

} );

module.exports = router;
