exports.seed = async (knex) => {
  await knex('users').del();
  await knex('users').insert([
    {
      id: 10002,
      name: 'Main user',
      email: 'main_user@google.com',
      passwd: '$2a$10$8EjQYqcszypZdoG73MM1I./ABYDfQOm2x5E4.VHUmnbV2pCFvhbkm',
      image: 'http://main_user@photo',
      dateCreate: knex.fn.now(),
    },
  ]);
};
