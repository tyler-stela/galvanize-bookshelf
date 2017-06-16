'use strict';

exports.up = function(knex, Promise) {
  return knex.schema.createTable('favorites', (table) => {
    table.increments('id').primary();
    table.integer('user_id').notNullable().references('id').inTable('users').onDelete('cascade').index();
    table.integer('book_id').notNullable().references('id').inTable('books').onDelete('cascade').index();
    table.timestamp('created_at').notNullable().defaultTo(knex.fn.now());
    table.timestamp('updated_at').notNullable().defaultTo(knex.fn.now());
  });
};

// Unhandled rejection error: insert or update on table "favorites" violates foreign key constraint "favorites_user_id_foreign"


exports.down = function(knex, Promise) {
  return knex.schema.dropTable('favorites');
};

// │book_id         │ integer                  │not null references books(id) on delete cascade index │
