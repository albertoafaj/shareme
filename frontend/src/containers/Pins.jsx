import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { Navbar, Search } from '../components';

const Pins = () => {
  return (
    <>
      <h1>Pins</h1>
      <Navbar></Navbar>
      <div className='h-full'>
        <Routes>
          <Route path='search' element={<Search />} />
        </Routes>
      </div>
    </>
  )
}

export default Pins;