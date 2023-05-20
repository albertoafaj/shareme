exports.up = (knex) => knex.schema.createTable('comments', (t) => {
  t.increments('id').primary();
  t.integer('postedById')
    .references('id')
    .inTable('postedBy')
    .notNull();
  t.string('comment', 255).notNull();
  t.timestamp('dateCreate', { useTz: true }).notNull().defaultTo(knex.fn.now());
});

exports.down = (knex) => knex.schema.dropTable('comments');
