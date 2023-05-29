module.exports = (app) => {
  // Photo updater for use on entities that are related to a photo
  const updater = async (body, files, method, photoId) => {
    const newBody = body;
    const photos = {
      files,
      photoTitles: newBody.photoTitles,
    };
    let result;
    if (method === 'save') [result] = await app.services.photo.save(photos);
    if (method === 'update') [result] = await app.services.photo.update({ ...photos, id: photoId });
    newBody.photoId = result.id;
    delete newBody.photoTitles;
    return newBody;
  };
  // Methods to handle with photos in routes calls of entities that are related to a photo
  const save = async (body, files) => updater(body, files, 'save', null);
  const update = async (body, files, photoId) => updater(body, files, 'update', photoId);
  return { save, update };
};
