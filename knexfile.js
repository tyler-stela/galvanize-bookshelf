'use strict';

const DATABASE_URL = 'postgres://whvpmhxyseuosf:cc6af349e5a4e4ffa1580a987fddf1791ee261ef9ea119bc24bcecb5e31217bd@ec2-54-235-120-39.compute-1.amazonaws.com:5432/dcai5jf3s4vinj'

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
    connection: `postgres://${DATABASE_URL}/bookshelf_production`,
    migrations: {
      directory: `${__dirname}/db/migrations`
    },
    seeds: {
      directory: `${__dirname}/db/seeds/development`
    }
  }
};
