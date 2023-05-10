import React, { useState, useRef, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { HiMenu } from 'react-icons/hi';
import { AiFillCloseCircle } from 'react-icons/ai';
import { Link, Route, Routes, useNavigate } from 'react-router-dom';
import { Sidebar, UserProfile } from '../components';
import Pins from './Pins';
import logo from '../assets/logo.png';

const Home = () => {
  const [toggleSidebar, setToggleSidebar] = useState(false);
  const { token, user } = useSelector((state) => state);
  const userData = user.data;
  const navigate = useNavigate();
  const scrollRef = useRef(null);
  React.useEffect(() => {
    if (!token) {
      navigate('/login');
    }
  }, [token]);
  React.useEffect(() => {
    scrollRef.current.scrollTo(0, 0);
  }, []);
  return (
    <>
      <div className="flex bg-gray-50 md:flex-fow flex-col h-screen transaction-height duration-75 ease-out">
        <div className="hidden md:flex h-screen flex-initial">
          <Sidebar userData={userData && userData} closeToggle={setToggleSidebar} />
        </div>
        <div className="flex md:hidden flex-row">
          <div className='p-2 w-full flex justify-between items-center shadow-md'>
            <HiMenu fontSize={40} className='cursor-pointer' onClick={() => setToggleSidebar(true)} />
            <Link to="/">
              <img src={logo} alt="logo" className='w-28' />
            </Link>
            <Link to={`user-profile/${userData?.id}`}>
              <img src={userData?.image} alt="logo" className='w-28' />
            </Link>
          </div>
          {toggleSidebar && (
            <div className="fixed w-4/5 bg-white h-screen overflow-y-auto shadow-md z-10 animate-slide-in">
              <div className="absolute w-full flex justify-end items-center p-2">
                <AiFillCloseCircle fontSize={30} className='cursor-pointer' onClick={() => setToggleSidebar(false)} />
              </div>
              <Sidebar userData={userData && userData} closeToggle={setToggleSidebar} />
            </div>
          )}
        </div>
        <div className='pb-2 flex-1 h-screen overflow-y-scroll' ref={scrollRef}>
          <Routes>
            <Route path="/user-profile/:userId" element={<UserProfile />} />
            <Route path="/*" element={<Pins user={userData && userData} />} />
          </Routes>
        </div>
      </div >
    </>
  )
}

export default Home