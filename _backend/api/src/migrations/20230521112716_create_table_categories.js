exports.up = (knex) => knex.schema.createTable('categories', (t) => {
  t.increments('id').primary();
  t.string('name').notNull();
  t.string('friendlyURL').notNull();
});

exports.down = (knex) => knex.schema.dropTable('categories');
