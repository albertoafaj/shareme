import {
  combineReducers,
  configureStore,
  getDefaultMiddleware,
} from '@reduxjs/toolkit';
import token from './token';
import user from './user';

const middleware = [...getDefaultMiddleware()];
const reducer = combineReducers({ token, user });
const store = configureStore({ reducer, middleware });

export default store;