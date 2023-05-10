import { USER_GET } from '../api';
import createAsyncSlice from './helper/createAsyncSlice';
import { fetchToken, resetTokenState } from './token';

const slice = createAsyncSlice({
  name: 'user',
  fetchConfig: () => USER_GET(),
});

export const fetchUser = slice.asyncAction;
const { resetState: resetUserState, fetchError } = slice.actions;

export const userLogin = (user) => async (dispatch) => {
  const { payload } = await dispatch(fetchToken(user));
  if (payload.token) {
    await dispatch(fetchUser(payload.token));
  }
};

export const userLogout = () => async (dispatch) => {
  dispatch(resetUserState());
  dispatch(resetTokenState());
  window.localStorage.removeItem('token');
};

export const autoLogin = () => async (dispatch, getState) => {
  const { type } = await dispatch(fetchUser());
  if (type === fetchError.type) dispatch(userLogout());
};


export default slice.reducer;
