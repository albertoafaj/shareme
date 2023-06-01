exports.seed = async (knex) => {
  await knex('pins').del();
  await knex('pins').insert([
    {
      id: 10000,
      title: 'Animais selvagens',
      about: 'Animais selvagens na nantureza',
      destination: null,
      categoryId: 10000,
      photoId: 10000,
      postedById: 10000,
      dateCreate: knex.fn.now(),
    },
  ]);
};
