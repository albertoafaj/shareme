import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { Navbar, Search } from '../components';
import Feed from '../components/Feed';

const Pins = () => {
  const [searchTerm, setSearchTerm] = React.useState(null);
  return (
    <>
      <h1>Pins</h1>
      <Navbar searchTerm={searchTerm} setSearchTerm={setSearchTerm} ></Navbar>
      <div className='h-full'>
        <Routes>
          <Route path='/' element={<Feed />} />
          <Route path='search' element={<Search />} />
        </Routes>
      </div>
    </>
  )
}

export default Pins;