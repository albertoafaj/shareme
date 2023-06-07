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
    {
      id: 10004,
      userId: 10002,
      dateCreate: knex.fn.now(),
    },
    {
      id: 10005,
      userId: 10002,
      dateCreate: knex.fn.now(),
    },
    {
      id: 10006,
      userId: 10002,
      dateCreate: knex.fn.now(),
    },
    {
      id: 10007,
      userId: 10002,
      dateCreate: knex.fn.now(),
    },
    {
      id: 10008,
      userId: 10002,
      dateCreate: knex.fn.now(),
    },
    {
      id: 10009,
      userId: 10002,
      dateCreate: knex.fn.now(),
    },
    {
      id: 10010,
      userId: 10002,
      dateCreate: knex.fn.now(),
    },
    {
      id: 10011,
      userId: 10002,
      dateCreate: knex.fn.now(),
    },
    {
      id: 10012,
      userId: 0,
      dateCreate: knex.fn.now(),
    },
  ]);
};
