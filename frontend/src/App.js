import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './containers/Home';
import Login from './components/Login';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { useDispatch } from 'react-redux';
import { autoLogin } from './store/user';


function App() {
  const dispatch = useDispatch();
  React.useEffect(() => {
    dispatch(autoLogin());
  }, [dispatch]);
  return (
    <GoogleOAuthProvider clientId={`${process.env.REACT_APP_GOOGLE_API_TOKEN}`}>
      <BrowserRouter>
        <Routes>
          <Route path='login' element={<Login />} />
          <Route path='/*' element={<Home />} />
        </Routes>
      </BrowserRouter>
    </GoogleOAuthProvider>
  );
};

export default App;
