import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { IoMdAdd, IoMdSearch } from 'react-icons/io';
const Navbar = ({ searchTerm, setSearchTerm }) => {
  const { user } = useSelector((state) => state);
  const navigate = useNavigate();
  if (!user.data) return null;
  return (
    <div className='flex gap-2 md:gap-5 w-full mt-5 pb-7'>
      <div className='flex justify-start items-center w-full px-2 rounded-md bg-white border-none outline-none focus-within:shadow-sm'>
        <IoMdSearch fontSize={21} className='ml-1' />
        <input
          type="text"
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder='Pesquisar'
          value={searchTerm}
          onFocus={() => navigate('/search')}
          className='p-2 w-full bg-white outline-none'
        />
      </div>
    </div>
  )
}

export default Navbar