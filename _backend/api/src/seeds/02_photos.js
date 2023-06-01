exports.seed = async (knex) => {
  await knex('photos').del();
  await knex('photos').insert([
    {
      id: 10000,
      fieldname: 'files',
      originalname: 'img-project-portfolio-360x280.jpg',
      encoding: '7bit',
      mimetype: 'image/jpeg',
      destination: 'D:\\Projects\\Pratical-studies\\shareme-v2\\_backend\\api\\uploads',
      filename: '2b96fa6aabfb94e75c6362b1232d20ef-img-project-portfolio-360x280.jpg',
      url: 'D:\\Projects\\Pratical-studies\\shareme-v2\\_backend\\api\\uploads\\2b96fa6aabfb94e75c6362b1232d20ef-img-project-portfolio-360x280.jpg',
      size: 6731,
      title: 'Screen portfolio',
      dateCreate: knex.fn.now(),
    },
    {
      id: 10001,
      fieldname: 'files',
      originalname: 'img-project-portfolio-360x280.jpg',
      encoding: '7bit',
      mimetype: 'image/jpeg',
      destination: 'D:\\Projects\\Pratical-studies\\shareme-v2\\_backend\\api\\uploads',
      filename: 'not-remove-img-project-portfolio-360x280.jpg',
      url: 'D:\\Projects\\Pratical-studies\\shareme-v2\\_backend\\api\\uploads\\not-remove-img-project-portfolio-360x280.jpg',
      size: 6731,
      title: 'Screen portfolio 2',
      dateCreate: '2023-03-30T11:16:17.307Z',
    },
    {
      id: 10002,
      fieldname: 'files',
      originalname: 'img-project-portfolio-360x280.jpg',
      encoding: '7bit',
      mimetype: 'image/jpeg',
      destination: 'D:\\Projects\\Pratical-studies\\shareme-v2\\_backend\\api\\uploads',
      filename: 'not-remove-img-project-portfolio-360x280.jpg',
      url: 'D:\\Projects\\Pratical-studies\\shareme-v2\\_backend\\api\\uploads\\not-remove-img-project-portfolio-360x280.jpg',
      size: 6731,
      title: 'Screen portfolio 2',
      dateCreate: '2023-03-30T11:16:17.307Z',
    },
  ]);
};
