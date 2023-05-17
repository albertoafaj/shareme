<!-- users

{
  email: string,
  userName: string,
  image: string
} -->

pin

{
  id: number,
  title: string, match
  about: string,
  destination: string, <!-- url -->
  category: string, match
  image: string,
  userId: string,
  postedById: string,
  save: object,
  comments: object,
}

comments

{
  id: number,
  postedById: string,
  comment: string,
}

save 

{
  id: number,
  postedById: number,
  userId: number
}

postedBy

{
  id: number,
  userId: number,
  
}