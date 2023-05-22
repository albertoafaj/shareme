exports.up = (knex) => knex.schema.createTable('postedBy', (t) => {
  t.increments('id').primary();
  t.integer('userId')
    .references('id')
    .inTable('users')
    .notNull();
  t.timestamp('dateCreate', { useTz: true }).notNull().defaultTo(knex.fn.now());
});

exports.down = (knex) => knex.schema.dropTable('postedBy');
