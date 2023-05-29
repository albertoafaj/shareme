exports.seed = async (knex) => {
  await knex('postedBy').del();
  await knex('postedBy').insert([
    {
      id: 10000,
      userId: 10002,
      dateCreate: knex.fn.now(),
    },
  ]);
};
