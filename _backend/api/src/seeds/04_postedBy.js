exports.seed = async (knex) => {
  await knex('postedBy').del();
  await knex('postedBy').insert([
    {
      id: 10000,
      userId: 10002,
      dateCreate: knex.fn.now(),
    },
    {
      id: 10001,
      userId: 10002,
      dateCreate: knex.fn.now(),
    },
    {
      id: 10002,
      userId: 10002,
      dateCreate: knex.fn.now(),
    },
    {
      id: 10003,
      userId: 10002,
      dateCreate: knex.fn.now(),
    },
  ]);
};
