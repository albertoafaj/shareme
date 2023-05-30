exports.seed = async (knex) => {
  await knex('comments').del();
  await knex('comments').insert([
    {
      id: 10000,
      postedById: 10002,
      comment: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam auctor ultrices eleifend. Curabitur commodo diam non lacus tristique, ac varius nulla finibus. Fusce eu rutrum lacus. Sed sagittis mi at metus pharetra, ut tristique velit fermentum. ',
      dateCreate: knex.fn.now(),
    },
  ]);
};
