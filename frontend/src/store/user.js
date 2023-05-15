import { USER_GET } from '../api';
import createAsyncSlice from './helper/createAsyncSlice';
import { deleteToken, fetchToken, resetTokenState, saveToken } from './token';

const slice = createAsyncSlice({
  name: 'user',
  fetchConfig: () => USER_GET(),
});

export const fetchUser = slice.asyncAction;

const { resetState: resetUserState } = slice.actions;

export const userLogin = (user) => async (dispatch) => {
  await dispatch(saveToken(user));
  const { payload } = await dispatch(fetchUser());
  if (!payload) await dispatch(resetTokenState());
};

export const userLogout = () => async (dispatch) => {
  dispatch(deleteToken());
  dispatch(resetUserState());
};

export const autoLogin = () => async (dispatch, getState) => {
  const { payload } = await dispatch(fetchToken());
  if (payload) await dispatch(fetchUser());
  const state = getState();
  if (state.user.data === null) dispatch(userLogout());
};


export default slice.reducer;
