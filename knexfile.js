'use strict';

//const DATABASE_URL = 'postgres://boqshaexdhwmce:46efb730adf90474701514f6184c1c93c25fc4b0d63e1b13b3de37c6c7b1f5d0@ec2-54-243-107-66.compute-1.amazonaws.com:5432/dc5mf16vjl9vcd'

module.exports = {
  development: {
    client: 'pg',
    connection: 'postgres://localhost/bookshelf_dev',
    migrations: {
      directory: `${__dirname}/db/migrations`
    },
    seeds: {
      directory: `${__dirname}/db/seeds/development`
    }
  },
  test: {
    client: 'pg',
    connection: 'postgres://localhost/bookshelf_test',
    migrations: {
      directory: `${__dirname}/db/migrations`
    },
    seeds: {
      directory: `${__dirname}/db/seeds/development`
    }
  },
  production: {
    client: 'pg',
    connection: process.env.DATABASE_URL
    // migrations: {
    //   directory: `${__dirname}/db/migrations`
    // },
    // seeds: {
    //   directory: `${__dirname}/db/seeds/development`
    // }
  }
};
