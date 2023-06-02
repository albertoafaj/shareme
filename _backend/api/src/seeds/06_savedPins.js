exports.seed = async (knex) => {
  await knex('savedPins').del();
  await knex('savedPins').insert([
    {
      id: 10000,
      userId: 10002,
      pinId: 10001,
      dateCreate: knex.fn.now(),
    },
    {
      id: 10001,
      userId: 10002,
      pinId: 10002,
      dateCreate: knex.fn.now(),
    },
    {
      id: 10002,
      userId: 10003,
      pinId: 10002,
      dateCreate: knex.fn.now(),
    },
  ]);
};
