<!-- users

{
  email: string,
  userName: string,
  image: string
} -->

category 

{
id: p_key,
name: 'string',
friendlyURL: 'string',
}

photos

{
 id: p_key,
 'fieldname': 'string',
'originalname': 'string',
'encoding': 'string',
'mimetype': 'string',
'destination': 'string',
'filename': 'string',
'size': 'int',
'url': 'string',
'title': 'string',
'dateCreate': 'timestamp', 
}

pin

{
  id: p_key,
  title: string, <!-- match -->
  about: string,
  destination: string, <!-- url -->
  categoryId: f_key, <!-- match -->
  photoId: f_key,
  userId: f_key,
  postedBy: f_key, <!-- user.name -->
  save: object, <!-- list users that save this posts -->
  comments: object, <!-- list users that comments this posts -->
}

comments

{
  id: number,
  postedById: string,
  comment: string,
}

savedPins 

{
  id: number,
  userId: number <!-- users that save this posts -->
  pinId: number,
}

postedBy

{
  id: number,
  userId: number,
  pinId: number,
  
}