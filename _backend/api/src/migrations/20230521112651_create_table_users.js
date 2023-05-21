exports.up = (knex) => knex.schema.createTable('users', (t) => {
  t.increments('id').primary();
  t.string('name', 255);
  t.string('email', 255).notNull().unique();
  t.string('passwd').notNull();
  t.string('image').notNull();
  t.boolean('auth').notNull().defaultTo(false);
  t.timestamp('dateCreate', { useTz: true }).notNull().defaultTo(knex.fn.now());
});

exports.down = (knex) => knex.schema.dropTable('users');
