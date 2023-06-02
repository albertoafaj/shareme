exports.seed = async (knex) => {
  await knex('users').del();
  await knex('users').insert([
    {
      id: 0,
      name: 'Admin user',
      email: process.env.ADMIN_USER,
      passwd: process.env.PSW_USER,
      image: 'http://main_user@photo',
      auth: true,
      dateCreate: knex.fn.now(),
    },
    {
      id: 10002,
      name: 'Main user',
      email: 'main_user@google.com',
      passwd: '$2a$10$8EjQYqcszypZdoG73MM1I./ABYDfQOm2x5E4.VHUmnbV2pCFvhbkm',
      image: 'http://main_user@photo',
      auth: false,
      dateCreate: knex.fn.now(),
    },
    {
      id: 10003,
      name: 'Pin user',
      email: 'pin_user@google.com',
      passwd: '$2a$10$8EjQYqcszypZdoG73MM1I./ABYDfQOm2x5E4.VHUmnbV2pCFvhbkm',
      image: 'http://main_user@photo',
      auth: false,
      dateCreate: knex.fn.now(),
    },
  ]);
};
