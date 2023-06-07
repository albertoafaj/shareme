exports.up = (knex) => knex.schema.createTable('pins', (t) => {
  t.increments('id').primary();
  t.string('title').notNull();
  t.string('about');
  t.string('destination');
  t.integer('categoryId')
    .references('id')
    .inTable('categories')
    .notNull();
  t.integer('photoId')
    .references('id')
    .inTable('photos')
    .notNull();
  t.integer('postedById')
    .references('id')
    .inTable('postedBy')
    .notNull();
  t.timestamp('dateCreate', { useTz: true }).notNull().defaultTo(knex.fn.now());
});

exports.down = (knex) => knex.schema.dropTable('pins');
