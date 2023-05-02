import React from 'react';
import { useNavigate } from 'react-router-dom';
import { GoogleLogin } from '@react-oauth/google';
import shareVideo from '../assets/video-ml.mp4';
import logo from '../assets/logo-ml-w.svg';
import jwt_decode from 'jwt-decode'

const Login = () => {

  const navigate = useNavigate();

  const responseGoolge = (res) => {
    const decoded = jwt_decode(res.credential);
    localStorage.setItem('user', JSON.stringify(decoded));
    const { name, email, picture } = decoded;
    // TODO send doc to save user in backend;
    const doc = {
      email: email,
      userName: name,
      image: picture
    };
    console.log(doc);

    // TODO create a function that navigate to home when success login 
    // TODO ADD CORS rules in backend
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