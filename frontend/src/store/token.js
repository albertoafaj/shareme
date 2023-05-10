import Cookies from 'js-cookie';
import { TOKEN_GET } from '../api';
import createAsyncSlice from './helper/createAsyncSlice';

const slice = createAsyncSlice({
  name: 'token',
  initialState: {
    data: {
      token: Cookies.get('token') || null,
    },
  },
  fetchConfig: () => TOKEN_GET(),
});

export const fetchToken = slice.asyncAction;
export const { resetState: resetTokenState, fetchSuccess: fetchSuccessToken } = slice.actions;

export default slice.reducer;


