import { TOKEN_GET, TOKEN_POST, TOKEN_REMOVE } from '../api';
import createAsyncSlice from './helper/createAsyncSlice';

const slice = createAsyncSlice({
  name: 'token',
  fetchConfig: () => TOKEN_GET(),
});

export const fetchToken = slice.asyncAction;
export const { resetState: resetTokenState, fetchSuccess: fetchSuccessToken } = slice.actions;

export const saveToken = (user) => async (dispatch) => {
  const { url, options } = TOKEN_POST(user);
  const response = await fetch(url, options);
  await dispatch(fetchSuccessToken(response.ok));
};

export const deleteToken = () => async (dispatch) => {
  const { url, options } = TOKEN_REMOVE();
  await fetch(url, options);
  dispatch(resetTokenState());
};

export default slice.reducer;


