import Cookies from 'js-cookie';
import { USER_GET, TOKEN_POST } from '../api';
import createAsyncSlice from './helper/createAsyncSlice';
import { fetchSuccessToken, fetchToken, resetTokenState } from './token';

const slice = createAsyncSlice({
  name: 'user',
  fetchConfig: () => USER_GET(),
});

export const fetchUser = slice.asyncAction;

const { resetState: resetUserState } = slice.actions;

export const userLogin = (user) => async (dispatch) => {
  const { url, options } = TOKEN_POST(user);
  const response = await fetch(url, options);
  await dispatch(fetchSuccessToken(response.ok));
  const { payload } = await dispatch(fetchUser());
  if (!payload) await dispatch(resetTokenState());
};

export const userLogout = () => async (dispatch) => {
  dispatch(resetUserState());
  dispatch(resetTokenState());
  Cookies.remove('token');
};

export const autoLogin = () => async (dispatch, getState) => {
  const { payload } = await dispatch(fetchToken());
  if (payload) await dispatch(fetchUser());
};


export default slice.reducer;
