import React from 'react';
import { useParams } from 'react-router-dom';
import { MansoryLayout, Spinner } from './index';

const Feed = () => {
  const [loading, setLoading] = React.useState(false);
  const [pins, setPins] = React.useState(null);
  const { categoryId } = useParams;
  React.useEffect(() => {
    setLoading(true);
    if (categoryId) {
      // TODO Fetch pins filter by category
      setLoading(false);

    } else {
      // TODO Fetch all pins
      setLoading(false);
    };
  }, [categoryId]);
  if (loading) return <Spinner message='Nós estamos adicionando novas idéias para o seu feed' />;
  return (
    <div className='flex flex-col justify-center items-center w-full h-full'>
      Feed
    </div>
  )
}

export default Feed