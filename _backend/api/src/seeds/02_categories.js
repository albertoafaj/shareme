exports.seed = async (knex) => {
  await knex('categories').del();
  await knex('categories').insert([
    {
      id: 10000,
      name: 'URL Amigavel',
      friendlyURL: 'url-amigavel',
      photoId: null,
    },
  ]);
};
