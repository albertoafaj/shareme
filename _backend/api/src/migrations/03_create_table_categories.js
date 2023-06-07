exports.up = (knex) => knex.schema.createTable('categories', (t) => {
  t.increments('id').primary();
  t.string('name').notNull().unique();
  t.string('friendlyURL').notNull().unique();
  t.integer('photoId')
    .references('id')
    .inTable('photos')
    .default(null);
});

exports.down = (knex) => knex.schema.dropTable('categories');
