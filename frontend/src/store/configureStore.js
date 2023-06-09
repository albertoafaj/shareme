import {
  combineReducers,
  configureStore,
  getDefaultMiddleware,
} from '@reduxjs/toolkit';
import token from './token';
import user from './user';
import categories from './categories';

const middleware = [...getDefaultMiddleware()];
const reducer = combineReducers({ token, user, categories });
const store = configureStore({ reducer, middleware });

export default store;