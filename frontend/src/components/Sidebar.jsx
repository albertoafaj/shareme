import React from 'react';
import { NavLink, Link } from 'react-router-dom';
import { RiHomeFill } from 'react-icons/ri';
import { IoIosArrowForward } from 'react-icons/io';
import logo from '../assets/logo.png';
import { useSelector } from 'react-redux';

const Sidebar = ({ closeToogle }) => {
  const { user } = useSelector((state) => state);
  const { image, id, name } = user.data;
  const isNotActiveStyle = 'flex items-center px-5 gap-3 text-gray-500 hover:text-black transition-all duration-200 ease-in-out capitalize';
  const isActiveStyle = 'flex items-center px-5 gap-3 font-extrabold border-r-2 border-black transition-all duration-200 ease-in-out capitalize';
  const handleCloseSidebar = () => {
    if (closeToogle) closeToogle(false);
  };
  const categories = [
    {
      id: 1,
      name: 'Animais',
      friendlyURL: 'animais',
    },
    {
      id: 2,
      name: 'Papéis de Parede',
      friendlyURL: 'papeis-de-parede',
    },
    {
      id: 3,
      name: 'Fotos',
      friendlyURL: 'fotos',
    },
    {
      id: 4,
      name: 'Jogos',
      friendlyURL: 'jogos',
    },
    {
      id: 5,
      name: 'Codificação',
      friendlyURL: 'codificacao',
    },
    {
      id: 6,
      name: 'Outros',
      friendlyURL: 'outros',
    },
  ];
  return (
    <div className='flex flex-col justify-between bg-white overflow-y-scrikk min-w-2010 hide-scrollbar'>
      <div className="flex flex-col"></div>
      <Link
        to="/"
        className='flex px-5 gap-2 my-6 pt-1 w-190 items-center'
        onClick={handleCloseSidebar}>
        <img src={logo} alt="logo" className='w-full' />
      </Link>
      <div className='flex flex-col gap-5'>
        <NavLink
          to='/'
          className={({ isActive }) => isActive ? isActiveStyle : isNotActiveStyle}
          onClick={handleCloseSidebar}
        >
          <RiHomeFill />
          Home
        </NavLink>
        <h3 className='mt-2 px-5 text-base 2xl:text-xl'>Descubra categorias</h3>
        {categories.map((category) => {
          const { id, name, friendlyURL } = category;
          return <NavLink
            to={`/categorias/${friendlyURL}`}
            className={({ isActive }) => isActive ? isActiveStyle : isNotActiveStyle}
            onClick={handleCloseSidebar}
            key={id}
          >
            {name}
          </NavLink>

        })}
      </div>
      {id && (
        <Link
          to={`perfil-do-usuario/${id}`}
          className='flex my-5 mb-3 gap-2 p-2 items-center bg-white rounded-lg shadow-lg mx-3'
          onClick={handleCloseSidebar}
        >
          <img src={image} className="w-10 h-10 rounded-full" alt='perfil-do-usuario' />
          <p>{name}</p>
        </Link>
      )}
    </div>
  )
}

export default Sidebar