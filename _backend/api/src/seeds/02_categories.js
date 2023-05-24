exports.seed = async (knex) => {
  await knex('categories').del();
  await knex('categories').insert([
    {
      id: 10000,
      name: 'URL Amigavel',
      friendlyURL: 'url-amigavel',
      photoId: null,
    },
    {
      id: 10001,
      name: 'Carros',
      friendlyURL: 'carros',
      photoId: null,
    },
  ]);
};
