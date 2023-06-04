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
    {
      id: 10001,
      title: 'Animais domésticos',
      about: 'Animais criados em apartamento',
      destination: null,
      categoryId: 10000,
      photoId: 10003,
      postedById: 10004,
      dateCreate: knex.fn.now(),
    },
    {
      id: 10002,
      title: 'Animais aquáticos',
      about: 'Animais que vivem na água',
      destination: null,
      categoryId: 10000,
      photoId: 10004,
      postedById: 10005,
      dateCreate: knex.fn.now(),
    },
    {
      id: 10003,
      title: 'Animais fantasticos',
      about: 'Animais com habilidades especiais',
      destination: null,
      categoryId: 10000,
      photoId: 10005,
      postedById: 10009,
      dateCreate: knex.fn.now(),
    },
  ]);
};
