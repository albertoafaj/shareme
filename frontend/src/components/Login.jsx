import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { GoogleLogin } from '@react-oauth/google';
import shareVideo from '../assets/share.mp4';
import logo from '../assets/logowhite.png';
import jwt_decode from 'jwt-decode'
import { useDispatch, useSelector } from 'react-redux';
import { userLogin } from '../store/user';
import Users from '../models/Users';

const Login = () => {

  const dispatch = useDispatch();

  const { token } = useSelector((state) => state);

  const navigate = useNavigate();

  useEffect(() => {
    if (token?.data === true) {
      navigate('/');
    }
  }, [token, navigate])

  const responseGoolge = async (res) => {

    const decoded = jwt_decode(res.credential);
    const { name, email, picture } = decoded;
    const doc = new Users(undefined, name, email, picture);
    // TODO create a function that navigate to home when success login 
    // TODO ADD CORS rules in backend

    dispatch(
      userLogin(doc)
    );
  };

  return (
    <div className='flex justify-start items-center flex-col h-screen'>
      <div className='relative w-full h-full'>
        <video
          src={shareVideo}
          type='video/mp4'
          loop
          controls={false}
          muted
          autoPlay
          className='w-full h-full object-cover'
        />
      </div>
      <div className='absolute flex flex-col justify-center items-center top-0 right-0 left-0 bottom-0 bg-blackOverlay'>
        <div className='p-5'>
          <img src={logo} width='130px' alt='logo' />
        </div>
        <div className='shadow-2x1'>
          <GoogleLogin
            onSuccess={credentialResponse => {
              responseGoolge(credentialResponse);

            }}
            onError={() => {
              console.log('Login Failed');
            }}
          />
        </div>
      </div>
    </div>
  )
};

export default Login;
