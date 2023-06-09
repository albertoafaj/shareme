import React from 'react';
import Masonry from 'react-masonry-css';
import Pin from './Pin';

const breackpointObj = {
  default: 44,
  3000: 6,
  2000: 5,
  1200: 3,
  1000: 2,
  500: 1,
}

const MansoryLayout = ({ pins }) => {
  return (
    <Masonry className='flex animate-slide-fwd' breakpointCols={breackpointObj}>
      {pins?.map((pin) => <Pin key={pin.id} pin={pin} className='w-max' />)}
    </Masonry>
  )
};

export default MansoryLayout;